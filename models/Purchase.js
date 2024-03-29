const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    billNo: {
        type: String,
        // required: true,
    },
    vendorName: {
        type: String,
        // required: true,
    },
    items: [
        {
            productName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
            },
            pricePerQty: {
                type: Number,
                required: true,
            },
        }
    ],
    subtotal: {
        type: Number,
        required: true,
    },
    gstAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
