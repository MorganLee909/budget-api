import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    accounts: [mongoose.Schema.Types.ObjectId]
});

export default mongoose.model("user", UserSchema);
