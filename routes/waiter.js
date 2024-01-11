const express = require('express');
const Waiter = require('../models/Waiter');
const router = express.Router();

// Create Waiter
router.post('/', async (req, res) => {
  try {
    const { waiterName, address, contactNumber } = req.body;
    const newWaiter = new Waiter({ waiterName, address, contactNumber });
    const savedWaiter = await newWaiter.save();
    res.json(savedWaiter);
  } catch (error) {
    console.error('Error creating waiter:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Waiters
router.get('/', async (req, res) => {
  try {
    const waiters = await Waiter.find();
    res.json(waiters);
  } catch (error) {
    console.error('Error getting waiters:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Waiter by ID
router.get('/:id', async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id);
    if (waiter) {
      res.json(waiter);
    } else {
      res.status(404).json({ error: 'Waiter not found' });
    }
  } catch (error) {
    console.error('Error getting waiter by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Waiter's Mobile Number by Name
router.get('/waiter/mobile', async (req, res) => {
    try {
      const { name } = req.query;
      const waiter = await Waiter.findOne({ waiterName: name });
      if (waiter) {
        res.json({ mobileNumber: waiter.contactNumber });
      } else {
        res.status(404).json({ error: 'Waiter not found' });
      }
    } catch (error) {
      console.error('Error getting waiter by name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

// Update Waiter by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedWaiter = await Waiter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedWaiter) {
      res.json(updatedWaiter);
    } else {
      res.status(404).json({ error: 'Waiter not found' });
    }
  } catch (error) {
    console.error('Error updating waiter by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Waiter by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedWaiter = await Waiter.findByIdAndDelete(req.params.id);
    if (deletedWaiter) {
      res.json({ message: 'Waiter deleted successfully' });
    } else {
      res.status(404).json({ error: 'Waiter not found' });
    }
  } catch (error) {
    console.error('Error deleting waiter by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
