import {userAuth} from "../auth.js";
import {
    createRoute,
    deleteRoute
} from "../controllers/transaction.js";

export default (app)=>{
    app.post("/transaction", userAuth, createRoute);
    app.delete("/transaction/:transactionId", userAuth, deleteRoute);
}
