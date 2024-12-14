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
        if(!data.date.year) throw new CustomError(400, "Date must include year");
        if(typeof(data.date.year) !== "number") throw new CustomError(400, "Invalid year");
        if(!Number.isInteger(data.date.year)) throw new CustomError(400, "Invalid year");
        if(data.date.year < 1970 || data.date.year > 2100){
            throw new CustomError(400, "Invalid year");
        }

        if(!data.date.month) throw new CustomError(400, "Date must include month");
        if(typeof(data.date.month) !== "number") throw new CustomError(400, "Invalid month");
        if(!Number.isInteger(data.date.month)) throw new CustomError(400, "Invalid month");
        if(data.date.month < 0 || data.date.month > 11){
            throw new CustomError(400, "Invalid month");
        }

        if(!data.date.day) throw new CustomError(400, "Date must include a day number");
        if(typeof(data.date.day) !== "number") throw new CustomError(400, "Invalid day");
        if(!Number.isInteger(data.date.day)) throw new CustomError(400, "Invalid day");
        if(data.date.day < 0 || data.date.day > 31){
            throw new CustomError(400, "Invalid day");
        }
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
