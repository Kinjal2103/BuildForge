const mongoose = require('mongoose');

const postLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A like must belong to a user.']
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityBuild',
      required: [true, 'A like must belong to a community build.']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// One user can like a post only once
postLikeSchema.index({ user: 1, post: 1 }, { unique: true });
postLikeSchema.index({ post: 1 });

const PostLike = mongoose.model('PostLike', postLikeSchema);

module.exports = PostLike;
