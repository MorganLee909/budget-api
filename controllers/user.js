import User from "../models/user.js";

import validate from "../validation/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const create = async (req, res, next)=>{
    try{
        validate(req.body);
        const user = await createUser(req.body);
        await user.save();
        res.json({success: true});
    }catch(e){
        next(e);
    }
}

/*
 Create a new User object

 @param {Object} data - Object containing email and password
 @return {User} new User
 */
const createUser = async (data)=>{
    return new User({
        email: data.email.toLowerCase(),
        password: await createPasswordHash(data.password),
        token: createNewToken()
    });
}

/*
 Create object with response data from user

 @param {User} user - User object
 @return {Object} Object containing User response data
 */
const responseUser = (user)=>{
    return {
        id: user._id,
        email: email
    };
}

/*
 Hash and salt a password

 @param {String} password - Password to hash
 @return {String} Generated hash
 */
const createPasswordHash = async (password)=>{
    return await bcrypt.hash(password, 10);
}

/*
 Create a new uuid

 @return {string} UUID token
 */
const createNewToken = ()=>{
    return crypto.randomUUID();
}

export {
    create
};
