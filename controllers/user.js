import User from "../models/user.js";

import {CustomError} from "../CustomError.js";
import validate from "../validation/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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

const getToken = async (req, res, next)=>{
    try{
        const user = await getUserWithEmail(req.body.email.toLowerCase());
        await checkPassword(user.password, req.body.password);
        const token = createJWT(user);
        res.json({token: token});
    }catch(e){
        next(e);
    }
}

/*
 Retrieve user from email address

 @param {String} email - user email address
 @return {User} User object
 */
const getUserWithEmail = async (email)=>{
    const user = await User.findOne({email: email});
    if(!user) throw new CustomError(400, "No user with this email address");
    return user;
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

/*
 Check password
 Throw error if no match

 @param {string} hashedPass - Hashed password from DB
 @param {string} pass - User entered password
 */
const checkPassword = async (hashedPass, pass)=>{
    if(!await bcrypt.compare(pass, hashedPass)){
        throw new CustomError(401, "Unauthorized");
    }
}

/*
 Create a new JWT for user authorization

 @param {User} user - User object
 @return {String} New JWT
 */
const createJWT = (user)=>{
    return jwt.sign({
        id: user._id,
        token: user.token
    }, process.env.JWT_SECRET);
}

export {
    create,
    getToken
};
