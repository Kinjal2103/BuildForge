const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityBuild',
      required: [true, 'A comment must belong to a community build.']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have an author.']
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty.'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters.']
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    likes: {
      type: Number,
      default: 0
    },
    edited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexing strategies
commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual to populate nested replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
