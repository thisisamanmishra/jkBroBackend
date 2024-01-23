const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    required: true,
  },
  orderTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    enum: ['Within the City', 'Outside City'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Packer',
  },
  payment: {
    type: String,
    required: true,
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
        required: true,
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
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
