import {CustomError} from "../CustomError.js";

/*
 Validate data for an account
 Returns error if there is any invalid data

 @param {Object} data - Object containing any data from Account, including:
    name
    balance
 */
export default (data)=>{
    if(data.name){
        if(typeof(data.name) !== "string") throw new CustomError(400, "Invalid name");
        if(data.name.length > 100) throw new CustomError(400, "Name must contain 100 characters or less");
    }

    if(data.balance){
        if(typeof(data.balance) !== "number") throw new CustomError(400, "Invalid balance");
        if(!Number.isInteger(data.balance)) throw new CustomError(400, "Invalid balance");
    }

    if(data.amount){
        if(typeof(data.amount) !== "number") throw new CustomError(400, "Invalid amount");
        if(!Number.isInteger(data.amount)) throw new CustomError(400, "Invalid amount");
    }
}
