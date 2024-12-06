import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

export default mongoose.model("account", AccountSchema);
