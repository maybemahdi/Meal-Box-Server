/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface IUser {
  [x: string]: any;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  dietaryPreferences: string[]; // for customers
  cuisineSpecialties: string[]; // for providers
  otp?: string;
  otpExpiredAt?: Date;
  status?: string;
  passwordChangedAt?: Date;
  isDeleted?: boolean;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist by email
  isUserExistsByCustomEmail(email: string): Promise<IUser>;

  //instance methods for checking if the user exist by id
  isUserExistsByCustomId(id: string | Types.ObjectId): Promise<IUser>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  //instance methods for checking if JWT was issued before password changed
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type IUserRole = keyof typeof USER_ROLE;
