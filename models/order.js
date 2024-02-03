const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  dates: {
    type: String,
    required: true,
  },
  orderTime: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  distance: {
    type: String,
    enum: ['Within the City', 'Outside City'],
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Packer',
  },
  payment: {
    type: String,
    required: false,
  },
  orderCompletion: {
    type: String,
    enum: ['Processing', 'Approved', 'Completed'],
    default: 'Processing',
  },
  tracking: [
    {
      status: {
        type: String,
        enum: ['Processing', 'Picked', 'Completed'],
        default: 'Processing',
        required: false,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  furniture: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Furniture',
    },
  ],
  appliances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliances',
    },
  ],
  cartons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cartons',
    },
  ],
  singleLayerPacking: {
    type: Boolean,
    default: false,
  },
  multiLayerPacking: {
    type: Boolean,
    default: false,
  },
  carpenterCharges: {
    type: Boolean,
    default: false,
  },
  acUninstallation: {
    type: Boolean,
    default: false,
  },
  acInstallation: {
    type: Boolean,
    default: false,
  },
  tvMounting: {
    type: Boolean,
    default: false,
  },
  razorpayOrderId: {
    type: String,
    required: false,
  },
 }, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
