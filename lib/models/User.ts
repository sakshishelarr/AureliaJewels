// lib/models/User.ts
import mongoose, { Schema, models, model } from 'mongoose'

export interface IUser {
  name: string
  email: string
  passwordHash: string
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export default models.User || model<IUser>('User', UserSchema)
