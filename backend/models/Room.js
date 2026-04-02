import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: 'Experience luxury and comfort.', trim: true },
  capacity: { type: Number, default: 2, min: 1 },
  size: { type: Number, default: 300, min: 0 },
  amenities: [{ type: String, trim: true }],
  images: {
    type: [String],
    default: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg']
  },
  availability: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

roomSchema.index({ type: 1, availability: 1, price: 1 });
roomSchema.index({ featured: 1 });

roomSchema.pre('save', function (next) {
  if (!this.images || this.images.length === 0) {
    this.images = ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'];
  }
  next();
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
