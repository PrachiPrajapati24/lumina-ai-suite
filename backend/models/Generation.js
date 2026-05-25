import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    toolType: {
      type: String,
      enum: ['caption', 'blog', 'notes'],
      required: true,
    },

    prompt: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    output: {
      type: String,
      required: true,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
      },
    ],

    title: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Generation = mongoose.model('Generation', generationSchema);

export default Generation;