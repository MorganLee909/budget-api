import {userAuth} from "../auth.js";
import {
    create
} from "../controllers/account.js";

export default (app)=>{
    app.post("/account", userAuth, create);
}
