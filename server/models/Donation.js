// server/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentId: {
    type: String,
    // unique: true, // This will be set after successful payment
  },
  signature: {
    type: String,
  },
  donorName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: { // Store in smallest currency unit (e.g., paisa for INR)
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'paid', 'failed'],
    default: 'created',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Donation', DonationSchema);