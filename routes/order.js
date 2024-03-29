const express = require('express');
const Order = require('../models/Order');
const Table = require('../models/Table');
const Section = require('../models/Section');
const router = express.Router();
const mongoose = require('mongoose')

// router.post('/order/:tableId', async (req, res) => {
//   try {
//     const { tableId } = req.params;
//     const { items, subtotal, CGST, SGST, total, isTemporary } = req.body;

//     const newOrder = new Order({
//       tableId,
//       items,
//       subtotal,
//       CGST,
//       SGST,
//       total,
//       isTemporary: isTemporary !== undefined ? isTemporary : true,
//       // The isTemporary field will default to true
//     });

//     const savedOrder = await newOrder.save();

//     res.json(savedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.post('/order/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
    const { items, subtotal, CGST, SGST, total, isTemporary, acPercentageAmount } = req.body;

    const newOrder = new Order({
      tableId,
      items,
      subtotal,
      CGST,
      SGST,
      acPercentageAmount, // Include AC charges in the order
      total,
      isTemporary: isTemporary !== undefined ? isTemporary : true,
    });

    const savedOrder = await newOrder.save();

    res.json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.patch('/order/:tableId', async (req, res) => {
router.patch('/order/update-order-by-table/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
    const { items, subtotal, CGST, SGST, total, isTemporary } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { tableId: tableId }, // Use the correct field name from your schema
      {
        items,
        subtotal,
        CGST,
        SGST,
        total,
        isTemporary,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.patch('/order/:orderId', async (req, res) => {
// router.patch('/update-order-by-id/:orderId', async (req, res) => {

//   try {
//     const { orderId } = req.params;
//     const { items, subtotal, CGST, SGST, total, isTemporary } = req.body;

//     // Validate orderId
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({ error: 'Invalid Order ID' });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         items,
//         subtotal,
//         CGST,
//         SGST,
//         total,
//         isTemporary,
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     res.json(updatedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.patch('/update-order-by-id/:orderId', async (req, res) => {

  try {
    const { orderId } = req.params;
    const { items, subtotal, CGST, SGST, total, isTemporary,acPercentageAmount } = req.body;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        items,
        subtotal,
        CGST,
        SGST,
        total,
        isTemporary,
        acPercentageAmount
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/orders', async (req, res) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders) {
      return res.status(404).json({ error: 'Orders not found' });
    }

    const ordersWithTableNames = await Promise.all(
      orders.map(async (order) => {
        const table = await Table.findById(order.tableId);
        return {
          ...order.toObject(),
          tableName: table ? table.tableName : 'Unknown Table',
        };
      })
    );

    res.json(ordersWithTableNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// routes/order.js

router.get('/order/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;

    // Filter bills with isTemporary: true
    const temporaryBills = await Order.find({ tableId, isTemporary: true }).sort({ createdAt: -1 });

    res.json(temporaryBills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/orderlist/:tableId', async (req, res) => {
//   try {
//     const { tableId } = req.params;

//     // Filter bills with isTemporary: true
//     const temporaryBills = await Order.find({ tableId});

//     res.json(temporaryBills);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


router.get('/get/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if the orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid Order ID' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ...

// Endpoint to fetch the order based on the table ID
router.get('/orders/:tableId', async (req, res) => {
  try {
    const tableId = req.params.tableId;

    // Assuming the order is uniquely identified by the table ID
    const order = await Order.findOne({ tableId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...

// Add this route at the end of your existing code
router.get('/last-10-orders', async (req, res) => {
  try {
    // Fetch the last 10 orders based on the createdAt field in descending order
    const last10Orders = await Order.find({isTemporary:false}).sort({ createdAt: -1 }).limit(10);

    if (!last10Orders || last10Orders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    res.json(last10Orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/orders/list/menuwise', async (req, res) => {
  try {
    const { date, menuName } = req.query;

    // Convert the date string to a Date object
    const selectedDate = new Date(date);

    // Find orders for the given date and menu name
    const orders = await Order.find({
      'orderDate': { $gte: selectedDate, $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000) }, // Considering orders within the same day
      'items.name': menuName
    });

    // Calculate menu counts and quantities
    let menuCounts = 0;
    let totalQuantity = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.name === menuName) {
          menuCounts++;
          totalQuantity += item.quantity;
        }
      });
    });

    res.json({ menuCounts, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router