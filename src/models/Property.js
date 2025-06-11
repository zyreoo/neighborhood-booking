import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Villa', 'Apartment', 'Cabin', 'House', 'Loft', 'Other'],
    default: 'House'
  },
  description: String,
  bedrooms: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  maxGuests: {
    type: Number,
    default: 2
  }
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property; 