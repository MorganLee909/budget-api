import {userAuth} from "../auth.js";
import {
    createRoute,
    deleteRoute,
    getRoute
} from "../controllers/transaction.js";

export default (app)=>{
    app.post("/transaction", userAuth, createRoute);
    app.delete("/transaction/:transactionId", userAuth, deleteRoute);
    app.get("/account/:accountId/transaction*", userAuth, getRoute);
}
