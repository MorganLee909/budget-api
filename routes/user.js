import {userAuth} from "../auth.js";
import {
    create,
    getToken,
    getUser,
    sendPasswordEmail
} from "../controllers/user.js";

export default (app)=>{
    app.post("/user", create);
    app.post("/user/token", getToken);
    app.get("/user/:userId", userAuth, getUser);
    app.get("/user/password/:email", sendPasswordEmail);
}
