import Account from "../models/account.js";

import {CustomError} from "../CustomError.js";
import validate from "../validation/account.js";

const create = async (req, res, next)=>{
    try{
        validate(req.body);
        const account = createAccount(req.body);
        await account.save();
        res.json(account);
    }catch(e){next(e)}
}

export {
    create
}
