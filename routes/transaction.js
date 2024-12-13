import {userAuth} from "../auth.js";
import {
    createRoute
} from "../controllers/transaction.js";

export default (app)=>{
    app.post("/transaction", userAuth, createRoute);
}
