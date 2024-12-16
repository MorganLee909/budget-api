import {userAuth} from "../auth.js";
import {
    createRoute,
    deleteRoute,
    getRoute,
    updateRoute
} from "../controllers/transaction.js";

export default (app)=>{
    app.post("/transaction", userAuth, createRoute);
    app.delete("/transaction/:transactionId", userAuth, deleteRoute);
    app.get("/account/:accountId/transaction*", userAuth, getRoute);
    app.put("/transaction/:transactionId", userAuth, updateRoute);
}
