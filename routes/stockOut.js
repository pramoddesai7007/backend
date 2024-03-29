// routes/stockOutwardRoutes.js
const express = require('express');
const StockOut = require('../models/StockOut');
const router = express.Router();


router.post('/stockOut/addItems', async (req, res) => {
    try {
        const { waiterName, productName, stockQty } = req.body;

        // Validate the inputs if needed

        // Assuming you have a StockOutward model, you can save the entry to the database
        const stockOutwardEntry = new StockOut({
            waiterName,
            productName,
            stockQty,
            date: new Date(),
        });

        await stockOutwardEntry.save();

        res.status(201).json({ message: 'Items added to stock outward entries successfully.' });
    } catch (error) {
        console.error('Error adding items to stock outward entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create stock outward entry
router.post('/stockOut', async (req, res) => {
    try {
        const { waiterName, productName, stockQty } = req.body;
        
        const stockOut = new StockOut({
            waiterName,
            productName,
            stockQty,
        });

        const savedStockOut = await stockOut.save();
        res.json(savedStockOut);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get list of stock outward entries
router.get('/stockOut', async (req, res) => {
    try {
        const stockOutwardList = await StockOut.find();
        res.json(stockOutwardList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
