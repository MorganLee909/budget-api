import Transaction from "../models/transaction.js";
import Account from "../models/account.js";

import validate from "../validation/transaction.js";
import {CustomError} from "../CustomError.js";

const createRoute = async (req, res, next)=>{
    try{
        validate(req.body);
        verifyAccountOwnership(res.locals.user, req.body.account);
        const transaction = createTransaction(req.body);
        await transaction.save();
        res.json(responseTransaction(transaction));
    }catch(e){next(e)}
}

/*
 Verify that an account is owned by the user

 @param {User} user - User object
 @param {String} accountId - ID of the account to verify
 */
const verifyAccountOwnership = (user, accountId)=>{
    for(let i = 0; i < user.accounts.length; i++){
        if(user.accounts[i].toString() === accountId) return;
    }
    throw new CustomError(403, "Forbidden");
}

/*
 Create a new transaction

 @param {Object} data - Object containing data for a new Transaction
 @return {Transaction} Transaction object
 */
const createTransaction = (data)=>{
    return new Transaction({
        account: data.account,
        tags: data.tags,
        amount: data.amount,
        location: data.location,
        date: data.date,
        note: data.note
    });
}

/*
 Format a transaction into a valid response

 @param {Transaction} transaction - Transaction Object
 @return {Object} Formatted transaction
 */
const responseTransaction = (transaction)=>{
    return {
        id: transaction._id,
        tags: transaction.tags,
        amount: transaction.amount,
        location: transaction.location,
        date: transaction.date,
        note: transaction.note
    };
}

export {
    createRoute
}
