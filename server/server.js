// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const mongoose = require("mongoose");


// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Define Routes
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Define Pet Schema and Model
const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    image: { type: String, required: true }, // This will be a Base64 string or URL
});

const Pet = mongoose.model("Pet", petSchema);


// --- API ROUTES FOR PETS ---

/**
 * @route   GET /api/pets
 * @desc    Fetch all pets, with optional filtering by type and location.
 *          Used by PetList and PetResults components.
 */
app.get("/api/pets", async (req, res) => {
    try {
        const { type, location } = req.query; // Get type and location from query parameters
        let filter = {};

        if (type) {
            filter.type = type;
        }
        if (location) {
            filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search for location
        }

        const pets = await Pet.find(filter);
        res.status(200).json(pets);
    } catch (error) {
        console.error("❌ Error fetching pets:", error);
        res.status(500).json({ message: "Error fetching pets", error: error.message });
    }
});


/**
 * @route   GET /api/pets/:id
 * @desc    Fetch a single pet by ID.
 *          Used by the AdoptPetPage component.
 */
app.get("/api/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json(pet);
  } catch (error) {
    console.error("❌ Error fetching pet:", error);
    res.status(500).json({ message: "Error fetching pet", error: error.message });
  }
});


/**
 * @route   POST /api/pets
 * @desc    Add a new pet to the database.
 *          Used by the SellPetForm component.
 */
app.post("/api/pets", async (req, res) => {
    try {
        const newPet = new Pet({
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            description: req.body.description,
            location: req.body.location,
            image: req.body.image,
        });

        const savedPet = await newPet.save();
        res.status(201).json(savedPet);
    } catch (error) {
        console.error("❌ Error saving pet:", error);
        res.status(500).json({ message: "Error adding new pet", error: error.message });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));