import {
    create,
    getToken
} from "../controllers/user.js";

export default (app)=>{
    app.post("/user", create);
    app.post("/user/token", getToken);
}
