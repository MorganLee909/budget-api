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
        type: Date,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    category: {
        //enum: income, bill, allowance, discretionary
        type: {type: String},
        //Not required for type=descretionary
        name: String
    }
});

export default mongoose.model("transaction", TransactionSchema);
