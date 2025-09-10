// server/routes/paymentRoutes.js
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto'); // Node.js built-in crypto module
const Donation = require('../models/Donation.js'); // Our new Donation model
require('dotenv').config();

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/createOrder
// @access  Public
router.post('/createOrder', async (req, res) => {
    const { amount, donorName, email } = req.body;

    // Basic server-side validation
    if (!amount || amount < 1 || !donorName || !email) {
        return res.status(400).json({ message: 'Invalid donation details provided' });
    }

    try {
        const amountInPaisa = amount * 100; // Convert Rupee to Paisa
        const receiptId = `receipt_donation_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const options = {
            amount: amountInPaisa,
            currency: "INR",
            receipt: receiptId,
            payment_capture: 1 // Auto-capture the payment
        };

        const order = await razorpayInstance.orders.create(options);

        // Save initial order details to your database
        const newDonation = new Donation({
            orderId: order.id,
            donorName,
            email,
            amount: amountInPaisa,
            currency: order.currency,
            status: 'created', // Initial status
        });
        await newDonation.save();

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            receipt: order.receipt,
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
});

// @desc    Verify payment signature
// @route   POST /api/payments/verifyPayment
// @access  Public
router.post('/verifyPayment', async (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    try {
        // Find the donation in your database
        const donation = await Donation.findOne({ orderId: order_id });

        if (!donation) {
            return res.status(404).json({ message: 'Donation order not found' });
        }

        // Generate HMAC signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${order_id}|${payment_id}`);
        const digest = shasum.digest('hex');

        if (digest === signature) {
            // Payment is successful and verified
            donation.paymentId = payment_id;
            donation.signature = signature;
            donation.status = 'paid';
            donation.paidAt = Date.now();
            await donation.save(); // Update donation status in DB

            // You can also send a confirmation email here
            res.json({ status: 'success', message: 'Payment verified successfully', donationId: donation._id });
        } else {
            donation.status = 'failed'; // Mark as failed if signature doesn't match
            await donation.save();
            res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
        }

    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        res.status(500).json({ message: 'Error verifying Razorpay payment' });
    }
});

module.exports = router;