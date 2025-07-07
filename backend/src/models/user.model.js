import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import {
  AvailableUserRolesEnum,
  AvailableUserRoles,
  AvailableUserGendersEnum,
} from "../constants/user.constant.js";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, trim: true, required: true },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, trim: true },
    role: {
      type: String,
      enum: AvailableUserRolesEnum,
      required: true,
      default: AvailableUserRoles.USER,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      trim: true,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
      trim: true,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },

    avatarUrl: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: AvailableUserGendersEnum,
    },
    bio: { type: String, trim: true },
    birthdate: { type: Date },
    country: {
      type: String,
      trim: true,
    },
    socialProfile: {
      twitter: { type: String, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
    },

    sessions: [
      {
        _id: false,
        deviceId: { type: String },
        userAgent: { type: String },
        ip: { type: String },
        refreshToken: { type: String },
        lastLoginAt: { type: Date },
        loginCount: { type: Number, default: 0 },
        isRevoked: { type: Boolean, default: false },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        lastUsedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export { User };
