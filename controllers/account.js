import Account from "../models/account.js";

import {CustomError} from "../CustomError.js";
import validate from "../validation/account.js";
import mongoose from "mongoose"

const create = async (req, res, next)=>{
    try{
        validate(req.body);
        const account = createAccount(req.body.name, req.body.balance);
        res.locals.user.accounts.push(account._id);
        await Promise.all([account.save(), res.locals.user.save()]);
        res.json(account);
    }catch(e){next(e)}
}

const getAccounts = async (req, res, next)=>{
    try{
        const accounts = await Account.find({_id: res.locals.user.accounts});
        res.json(accounts);
    }catch(e){next(e)}
}

const addIncome = async (req, res, next)=>{
    try{
        validate(req.body);
        const account = await Account.findOne({_id: req.params.accountId});
        validateOwnership(account, res.locals.user);
        const income = createIncome(req.body.name, req.body.amount);
        account.income.push(income);
        await account.save();
        res.json(responseIncome(income));
    }catch(e){next(e)}
}

const removeIncome = async (req, res, next)=>{
    try{
        const account = await Account.findOne({_id: req.params.accountId});
        validateOwnership(account, res.locals.user);
        deleteIncome(account, req.params.incomeId);
        await account.save();
        res.json({success: true});
    }catch(e){next(e)}
}

/*
 Create a new Account object

 @param {String} name - Name for the account
 @param {Number} balance - Current balance on the account
 @return {Account} - Newly created account
 */
const createAccount = (name, balance)=>{
    return new Account({
        name: name,
        balance: balance,
        income: [],
        bills: [],
        allowances: []
    });
}

/*
 Validate that the account is owned by the user
 Throw error if not owned

 @param {Account} account - Account to verify
 @param {User} user - User to verify
 */
const validateOwnership = (account, user)=>{
    let isOwned = false;
    for(let i = 0; i < user.accounts.length; i++){
        if(user.accounts[i].toString() === account._id.toString()){
            isOwned = true;
            break;
        }
    }
    if(!isOwned) throw new CustomError(403, "Forbidden");
}

/*
 Create a new Income object

 @param {String} name - Name of the income
 @param {Number} amount - Integer representing income amount in cents
 @return {Income} New Income object
 */
const createIncome = (name, amount)=>{
    return {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        amount: amount
    };
}

/*
 Remove an income from an account

 @param {Account} account - Account to remove income from
 @param {String} incomeId - ID of the income to be removed
 @param {Account} Account with removed income
 */
const deleteIncome = (account, incomeId)=>{
    for(let i = 0; i < account.income.length; i++){
        if(account.income[i]._id.toString() === incomeId){
            account.income.splice(i, 1);
            break;
        }
    }
    return account;
}

/*
 Return a formatted income for response

 @param {Income} income - Income object
 @return {Object} Formatted income
 */
const responseIncome = (income)=>{
    return {
        id: income._id,
        name: income.name,
        amount: income.amount
    };
}

export {
    create,
    getAccounts,
    addIncome,
    removeIncome
}
