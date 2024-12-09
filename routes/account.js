import {userAuth} from "../auth.js";
import {
    create,
    getAccounts
} from "../controllers/account.js";

export default (app)=>{
    app.post("/account", userAuth, create);
    app.get("/account/user/:userId", userAuth, getAccounts);
}
