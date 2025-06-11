import mongoose from 'mongoose';

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide amenity name'],
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Please provide an icon identifier']
  },
  category: {
    type: String,
    enum: ['basic', 'safety', 'entertainment', 'kitchen', 'outdoor', 'accessibility'],
    required: [true, 'Please specify amenity category']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Amenity = mongoose.models.Amenity || mongoose.model('Amenity', AmenitySchema);

export default Amenity; 