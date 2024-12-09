import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    income: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    bills: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    allowances: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        isPercent: {
            type: Boolean,
            required: true
        }
    }]
});

export default mongoose.model("account", AccountSchema);
