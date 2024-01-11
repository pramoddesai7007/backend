const express = require('express');
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const router = express.Router();


// Example in your backend code
router.get('/purchase/stockQty', async (req, res) => {
    try {
        const itemName = req.query.itemName;
        // Use a case-insensitive regular expression for item name matching
        const item = await Item.findOne({ itemName: { $regex: new RegExp(itemName, 'i') } });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ stockQty: item.stockQty });
    } catch (error) {
        console.error('Error fetching stock quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/purchase/addItem', async (req, res) => {
    try {
        const { billNo, productName, quantity, unit, pricePerQty } = req.body;

        // Find the existing purchase or create a new one
        let purchase = await Purchase.findOne({ billNo });

        if (!purchase) {
            purchase = new Purchase({
                billNo,
                items: [],
                subtotal: 0,
                gstAmount: 0,
                paidAmount: 0,
                discount: 0,
            });
        }

        // Add the new item to the items array
        purchase.items.push({
            productName,
            quantity,
            unit,
            pricePerQty,
        });

        // Update subtotal based on the new item
        purchase.subtotal += quantity * pricePerQty;

        const item = await Item.findOne({ itemName: productName });
        if (item) {
            item.stockQty -= quantity; // Adjust stock quantity
            await item.save();
        }
        // Save the updated purchase
        const savedPurchase = await purchase.save();
        res.json(savedPurchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/purchase/savebill', async (req, res) => {
    try {
        const {
            billNo,
            vendor,
            subtotal,
            gstAmount,
            paidAmount,
            discount,
            items,
        } = req.body;

        // Find or create the purchase
        let purchase = await Purchase.findOne({ billNo });
        if (!purchase) {
            // Create a new purchase if not found
            purchase = new Purchase({
                billNo,
                items: [],
                subtotal: 0,
                gstAmount: 0,
                paidAmount: 0,
                discount: 0,
            });
        }

        // Update the remaining fields and save the complete bill
        purchase.vendorName = vendor;
        purchase.subtotal = subtotal;
        purchase.gstAmount = gstAmount;
        purchase.paidAmount = paidAmount;
        purchase.discount = discount;

        // Iterate through purchased items to update stock quantity
        for (const item of items) {
            // Find the corresponding item in the database
            const purchasedItem = await Item.findOne({ itemName: item.productName });
            if (purchasedItem) {
                // Update stock quantity based on the purchased quantity
                purchasedItem.stockQty += parseFloat(item.quantity);
                await purchasedItem.save();
            }
        }

        purchase.items = items;

        const savedPurchase = await purchase.save();
        res.json(savedPurchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router