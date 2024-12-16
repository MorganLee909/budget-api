import {CustomError} from "../CustomError.js";

/*
 Validate data for a transaction
 Returns error if there is any invalid data

 @param {Object} data - Object containing any data from a Transaction, including:
    tags
    amount
    location
    date
    note
    category.type
    category.name
 */
export default (data)=>{
    if(data.tags){
        if(!data.tags.length) throw new CustomError(400, "Invalid tag");
        for(let i = 0; i < data.tags.length; i++){
            if(typeof(data.tags[i]) !== "string"){
                throw new CustomError(400, "Invalid tag");
            }
            if(data.tags[i].length > 50){
                throw new CustomError(400, "Tag cannot exceed 50 characters");
            }
        }
    }

    if(data.amount){
        if(typeof(data.amount) !== "number") throw new CustomError(400,"Invalid amount");
        if(!Number.isInteger(data.amount)) throw new CustomError(400, "Invalid amount");
    }

    if(data.location){
        if(typeof(data.location) !== "string") throw new CustomError(400, "Invalid location");
    }

    if(data.date){
        const date = new Date(data.date);
        if(date.toString() === "Invalid Date") throw new CustomError(400, "Invalid date");
    }

    if(data.note){
        if(typeof(data.note) !== "string") throw new CustomError(400, "Invalid note");
    }

    if(data.category){
        if(!data.category.type) throw new CustomError(400, "Category must contain a type");
        if(typeof(data.category.type) !== "string") throw new CustomError(400, "Invalid category type");
        const types = ["income", "bill", "allowance", "discretionary"];
        if(!types.includes(data.category.type)) throw new CustomError(400, "Invalid category type");
        if((
            data.category.type === "income" ||
            data.category.type === "bill" ||
            data.category.type === "allowance"
        ) && !data.category.name) throw new CustomError(400, "Category requires a name");
    }
}
