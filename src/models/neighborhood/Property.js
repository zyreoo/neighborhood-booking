import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide zip code'],
      trim: true
    }
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image']
  }],
  amenities: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxGuests: {
    type: Number,
    required: [true, 'Please specify maximum number of guests'],
    min: [1, 'Maximum guests must be at least 1']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please specify number of bedrooms'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please specify number of bathrooms'],
    min: [0, 'Bathrooms cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property; 