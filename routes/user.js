import {userAuth} from "../auth.js";
import {
    create,
    getToken,
    getUser
} from "../controllers/user.js";

export default (app)=>{
    app.post("/user", create);
    app.post("/user/token", getToken);
    app.get("/user/:userId", userAuth, getUser);
}
