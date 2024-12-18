import User from "../models/user.js";

import {CustomError} from "../CustomError.js";
import sendEmail from "../sendEmail.js";
import resetPasswordEmail from "../email/resetPassword.js";
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

const getUser = async (req, res, next)=>{
    try{
        res.json(responseUser(res.locals.user));
    }catch(e){
        next(e);
    }
}

const sendPasswordEmail = async (req, res, next)=>{
    try{
        const user = await getUserWithEmail(req.params.email.toLowerCase());
        sendEmail(
            user.email,
            "Password reset request",
            resetPasswordEmail(user._id, user.token)
        );
        res.json({success: true});
    }catch(e){next(e)}
}

const resetPassword = async (req, res, next)=>{
    try{
        validate(req.body);
        const user = await getUserWithId(req.params.userId);
        verifyToken(user.token, req.params.token);
        user.password = await createPasswordHash(req.body.password);
        user.token = createNewToken();
        user.save();
        res.json({success: true});
    }catch(e){next(e)}
}

/*
 Retrieve user with ID

 @param {String} id - User ID
 @return {User} User object
 */
const getUserWithId = async (id)=>{
    const user = await User.findOne({_id: id});
    if(!user) throw new CustomError(400, "No user with this ID");
    return user;
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
        token: createNewToken(),
        accounts: []
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
        email: user.email
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

const verifyToken = (userToken, inputToken)=>{
    if(userToken !== inputToken) throw new CustomError(401, "Unauthorized");
}

export {
    create,
    getToken,
    getUser,
    sendPasswordEmail,
    resetPassword
};
