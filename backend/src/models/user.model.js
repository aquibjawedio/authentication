import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  AvailableUserRolesEnum,
  AvailableUserRoles,
  AvailableUserGendersEnum,
} from "../constants/user.constant.js";
import { env } from "../config/env.js";

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
      default: "https://placehold.co/400",
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
        sessionId: { type: String },
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
  { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 10 * 60 * 1000;
  return { unHashedToken, hashedToken, tokenExpiry };
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      username: this.username,
      email: this.email,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function (sessionId) {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      sessionId,
      username: this.username,
      email: this.email,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const User = mongoose.model("User", userSchema);

export { User };
