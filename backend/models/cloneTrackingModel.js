const mongoose = require('mongoose');

const cloneTrackingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A clone record must belong to a user.']
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityBuild',
      required: [true, 'A clone record must refer to a community build.']
    },
    clonedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'clonedAt', updatedAt: false }
  }
);

cloneTrackingSchema.index({ post: 1 });
cloneTrackingSchema.index({ user: 1 });

const CloneTracking = mongoose.model('CloneTracking', cloneTrackingSchema);

module.exports = CloneTracking;
