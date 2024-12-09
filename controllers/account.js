import Account from "../models/account.js";

import {CustomError} from "../CustomError.js";
import validate from "../validation/account.js";

const create = async (req, res, next)=>{
    try{
        validate(req.body);
        const account = createAccount(req.body);
        res.locals.user.accounts.push(account._id);
        await Promise.all(account.save(), res.locals.user.save());
        res.json(account);
    }catch(e){next(e)}
}

const createAccount = (data)=>{
    return new Account({
        name: data.name,
        balance: data.balance,
        income: [],
        bills: [],
        allowances: []
    });
}

export {
    create
}
