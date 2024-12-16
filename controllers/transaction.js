import Transaction from "../models/transaction.js";
import Account from "../models/account.js";

import validate from "../validation/transaction.js";
import {CustomError} from "../CustomError.js";
import mongoose from "mongoose";

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

const getRoute = async (req, res, next)=>{
    try{
        verifyAccountOwnership(res.locals.user, req.params.accountId);
        const transactions = await getTransactionList(
            req.params.accountId,
            new Date(req.query.from),
            new Date(req.query.to)
        );
        res.json(transactions);
    }catch(e){next(e)}
}

const updateRoute = async (req, res, next)=>{
    try{
        validate(req.body);
        const {transaction, account} = await getTransaction(req.params.transactionId);
        verifyAccountOwnership(res.locals.user, transaction.account.toString());
        if(req.body.amount) updateBalance(account, transaction.amount, req.body.amount);
        updateTransaction(transaction, req.body);
        await Promise.all([transaction.save(), account.save()]);
        res.json(transaction);
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
 Get transactions based on account and dates

 @param {String} account - ID of account
 @param {Date} from - Starting date for search
 @param {Date} to - Ending date for search
 @return {[Transaction]} List of transactions
 */
const getTransactionList = async (account, from, to)=>{
    return await Transaction.aggregate([
        {$match: {
            account: new mongoose.Types.ObjectId(account),
            date: {
                "$gte": from,
                "$lt": to
            }
        }},
        {$project: {
            id: "$_id",
            tags: 1,
            amount: 1,
            location: 1,
            date: 1,
            note: 1,
            category: 1
        }}
    ]);
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
 Update the balance of an account for an updated transaction amount

 @param {Account} account - Account object
 @param {Number} originalAmount - Original amount on the transaction
 @param {Number} newAmount - New amount to be updated on the transaction
 @return {Account} Account object
 */
const updateBalance = (account, originalAmount, newAmount)=>{
    const difference = originalAmount - newAmount;
    account.balance -= difference;
    return account;
}

/*
 Update the data on a transaction

 @param {Transaction} transaction - Transaction object
 @param {Object} data - Data to update on the transaction
 @return {Transaction} - Update transaction object
 */
const updateTransaction = (transaction, data)=>{
    if(data.tags) transaction.tags = data.tags;

    if(data.amount) transaction.amount = data.amount;

    if(data.location) transaction.location = data.location;

    if(data.date) transaction.date = new Date(data.date);

    if(data.note) transaction.note = data.note;

    return transaction;
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
    deleteRoute,
    getRoute,
    updateRoute
}
