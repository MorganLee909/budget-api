import Transaction from "../models/transaction.js";
import Account from "../models/account.js";

import validate from "../validation/transaction.js";
import {CustomError} from "../CustomError.js";

const createRoute = async (req, res, next)=>{
    try{
        validate(req.body);
        const account = await getAccount(req.body.account);
        verifyAccountOwnership(res.locals.user, req.body.account);
        const transaction = createTransaction(req.body);
        account.balance += transaction.amount;
        await Promise.all([transaction.save(), account.save()]);
        res.json(responseTransaction(transaction));
    }catch(e){next(e)}
}

const deleteRoute = async (req, res, next)=>{
    try{
        const {transaction, account} = await getTransaction(req.params.transactionId);
        verifyAccountOwnership(res.locals.user, account._id.toString());
        account.balance -= transaction.amount;
        await Promise.all([
            Transaction.deleteOne({_id: transaction._id}),
            account.save()
        ]);
        res.json({success: true});
    }catch(e){next(e)}
}

/*
 Retrieve account from the database

 @param {String} accountId - ID of the account to retrieve
 @return {Account} Account object
 */
const getAccount = async (accountId)=>{
    return await Account.findOne({_id: accountId});
}

/*
 Retrieve transaction and associated account

 @param {String} transactionId - ID of the transaction
 @return {Transaction, Account} Transaction and Account objects
 */
const getTransaction = async (transactionId)=>{
    const transaction = await Transaction.findOne({_id: transactionId});
    const account = await getAccount(transaction.account);
    return {transaction, account};
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
        note: data.note,
        category: {
            type: data.category.type,
            name: data.category.name
        }
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
        note: transaction.note,
        category: transaction.category
    };
}

export {
    createRoute,
    deleteRoute
}
