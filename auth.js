import User from "./models/user.js";

import jwt from "jsonwebtoken";
import {CustomError} from "./CustomError.js";

const userAuth = async (req, res, next)=>{
    let userData;
    try{
        const [bearer, token] = req.headers.authorization.split(" ");
        if(bearer !== "Bearer") return next(new CustomError(401, "Unauthorized"));
        userData = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        return next(new CustomError(401, "Unauthorized"));
    }

    let user;
    try{
        user = await User.findOne({_id: userData.id});
    }catch(e){
        throw e;
    }
    if(!user || user.token !== userData.token){
        return next(new CustomError(401, "Unauthorized"));
    }

    res.locals.user = user;
    next();
}

export {userAuth};
