const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rawMaterialSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  quantity: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true,
    default: 'kg'
  },
  pricePerUnit: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock', 'Pending'],
    default: 'Available'
  },
  image: {
    type: String, // URL or base64 string
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);