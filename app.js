import express from "express";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";

import {catchError} from "./CustomError.js";

import userRoutes from "./routes/user.js";
import accountRoutes from "./routes/account.js";

const app = express();
global.cwd = import.meta.dirname;

let mongoString = "mongodb://127.0.0.1/budget";
if(process.env.NODE_ENV === "production"){
    mongoString = `mongodb://website:${process.env.MONGODB_PASS}@127.0.0.1:27017/budget?authSource=admin`;
}
mongoose.connect(mongoString);

app.use(compression());
app.use(express.json());
app.use(cors());

userRoutes(app);
accountRoutes(app);

app.use(catchError);

app.get("/", (req, res)=>{res.sendFile(`${global.cwd}/index.html`)});

if(process.env.NODE_ENV !== "production"){
    app.listen(8000);
}
export default app;
