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
        const income = createIncome(req.body.name, req.body.amount);
        account.income.push(income);
        await account.save();
        res.json(income);
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
        name: name,
        amount: amount
    };
}

export {
    create,
    getAccounts,
    addIncome
}
