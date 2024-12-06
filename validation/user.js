import {CustomError} from "../CustomError.js";

/*
 Validata data for a user
 Returns error if there is any invalid data

 @param {Object} data - Object containing any data from User, including:
    email
    password
    confirmPassword
 */
export default (data)=>{
    if(data.email){
        if(typeof(email) !== "string") throw new CustomError(400, "Invalid email");
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            throw new CustomError(400, "Invalid email");
        }
    }

    if(data.password){
        if(typeof(data.password) !== "string") throw new CustomError(400, "Invalid password");
        if(data.password.length < 10) throw new CustomError(400, "Password must contain at least 10 characters");
        if(data.confirmPassword){
            if(data.password !== data.confirmPassword){
                throw new CustomError(400, "Passwords do not match");
            }
        }
    }
}
