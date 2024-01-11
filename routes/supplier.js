const express = require('express');
const Supplier = require('../models/Supplier');
const router = express.Router();


router.post('/suppliers', async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// API route to get all suppliers
router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// API route to get a specific supplier by ID
router.get('/suppliers/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// API route to update a specific supplier by ID
router.patch('/suppliers/:id', async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// API route to delete a specific supplier by ID
router.delete('/suppliers/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(deletedSupplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router