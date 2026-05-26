import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';

const userSchema =
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: [
          true,
          'Please add a username',
        ],
        trim: true,
      },

      email: {
        type: String,
        required: [
          true,
          'Please add an email',
        ],
        unique: true,
        trim: true,
        lowercase: true,

        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },

      // PASSWORD
      password: {
        type: String,

        // OPTIONAL FOR GOOGLE USERS
        minlength: [
          6,
          'Password must be at least 6 characters',
        ],

        select: false,
      },

      // GOOGLE LOGIN FLAG
      googleAuth: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

// HASH PASSWORD BEFORE SAVE
userSchema.pre(
  'save',
  async function (next) {
    // SKIP IF NO PASSWORD
    if (!this.password) {
      return next();
    }

    // SKIP IF PASSWORD NOT MODIFIED
    if (!this.isModified('password')) {
      return next();
    }

    // HASH PASSWORD
    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );

    next();
  }
);

// MATCH PASSWORD METHOD
userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

const User = mongoose.model(
  'User',
  userSchema
);

export default User;