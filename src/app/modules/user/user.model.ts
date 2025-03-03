import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserModel } from "./user.interface";
import config from "../../config";
import { USER_ROLE } from "./user.constant";

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: 0,
    },
    role: {
      type: String,
      enum: [USER_ROLE.CUSTOMER, USER_ROLE.MEAL_PROVIDER, USER_ROLE.ADMIN],
      required: [true, "Account type is required"],
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiredAt: {
      type: Date,
      select: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
  },
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

UserSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

UserSchema.statics.isUserExistsByCustomEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

UserSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findById(id).select("+password");
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>("User", UserSchema);
