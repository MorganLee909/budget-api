import {
    create
} from "../controllers/user.js";

export default (app)=>{
    app.post("/user", create);
}
