const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A bookmark must belong to a user.']
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityBuild',
      required: [true, 'A bookmark must refer to a community build.']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });
bookmarkSchema.index({ user: 1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
