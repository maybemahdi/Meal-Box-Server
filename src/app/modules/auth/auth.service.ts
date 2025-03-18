/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILoginUser, IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";
import { createToken } from "./auth.utils";
import AppError from "../../errors/AppError";
import { USER_ROLE } from "../user/user.constant";
import { User } from "../user/user.model";
import config from "../../config";
import { sendEmail } from "../../utils/sendEmail";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(payload?.email);
  if (user) {
    throw new AppError(httpStatus.CONFLICT, "User already exists!");
  }
  if (payload?.role === USER_ROLE.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admin registration is not allowed!",
    );
  }
  const result = await User.create(payload);
  const html = `
  <html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Our Platform!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table align="center" width="600" style="background: white; padding: 20px; border-radius: 10px;">
    <tr>
      <td align="center">
        <h2 style="color: #333;">Welcome to Our Platform, ${result?.name}! 🎉</h2>
        <p>We are excited to have you on board. You can now explore and enjoy our services.</p>
        <p>Need help? <a href=${`mailto:${config.email}`} style="color: #059669;">Contact Support</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  sendEmail("Welcome Onboard", result?.email, html);
  return {
    _id: result?._id,
    name: result?.name,
    email: result?.email,
  };
};

const loginUser = async (payload: ILoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }
  // checking if the user is already deleted

  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.UNAUTHORIZED, "This user is blocked!");
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "No User Exists!");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");

  //create token and sent to the  client

  const jwtPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    payload?.rememberMe ? "7d" : (config.jwt_access_expires_in as string),
  );

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role as string,
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m",
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
        }
        .message {
            font-size: 16px;
            color: #333;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background: #059669;
            color: #ffffff !important;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            transition: 0.3s;
        }
        .btn:hover {
            background: #059669;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="logo">MealBox</div>
        <p class="message">We received a request to reset your password. Click the button below to set a new password.</p>
        <a href=${resetUILink} target="_blank" class="btn">Reset Password</a>
        <p class="message">The Link will be valid for 10 minutes.</p>
        <p class="message">If you didn't request this, you can ignore this email.</p>
        <p class="footer">&copy; ${new Date().getFullYear()} MealBox. All rights reserved.</p>
    </div>
  </body>
 </html>
  `;

  sendEmail("Reset your password", user?.email, html);
  return {
    resetToken: resetToken,
  };
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the given token is valid
  let decoded: JwtPayload = {} as JwtPayload;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(httpStatus.FORBIDDEN, "Token has expired!");
    }
  }

  // checking if the user is exist
  const user = await User.isUserExistsByCustomEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (payload?.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized Attempt!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );
};

const changePassword = async (
  payload: {
    oldPassword: string;
    newPassword: string;
  },
  user: any,
) => {
  const { oldPassword, newPassword } = payload;
  const userForCheck = await User.findById(user?.id).select("+password");
  // Check if the current password matches
  if (!userForCheck?.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password not found");
  }
  const isPasswordMatched = await User.isPasswordMatched(
    oldPassword,
    userForCheck.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Current password is invalid")
  }

  // Update the password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Update the pin
  await User.findByIdAndUpdate(user?.id, { password: hashedPassword });

  return {
    success: true,
    message: "Password changed successfully",
  };
};

const updatedUserStatus = async (payload: { id: string; status: boolean }) => {
  const result = await User.findByIdAndUpdate(
    payload.id,
    { isBlocked: payload.status },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Something went wrong!");
  }
  return result;
};

export const AuthService = {
  registerUserIntoDB,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  updatedUserStatus,
};
