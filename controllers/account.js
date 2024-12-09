import Account from "../models/account.js";

import {CustomError} from "../CustomError.js";
import validate from "../validation/account.js";

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
        const income = createIncome(account, req.body);
        account.income.push(income);
        await account.save();
        res.json(income);
    }catch(e){next(e)}
}

/*
 Create a new Account object

 @param {String} name - Name for the account
 @param {Number} balance - Current balance on the account
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

export {
    create,
    getAccounts,
    addIncome
}
