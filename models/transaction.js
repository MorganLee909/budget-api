import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    tags: [String],
    amount: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    date: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        }
    },
    note: {
        type: String,
        required: false
    }
});

export default mongoose.model("transaction", TransactionSchema);
