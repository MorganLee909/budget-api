import {userAuth} from "../auth.js";
import {
    create,
    getAccounts,
    addIncome,
    removeIncome
} from "../controllers/account.js";

export default (app)=>{
    app.post("/account", userAuth, create);
    app.get("/account/user/:userId", userAuth, getAccounts);
    app.post("/account/:accountId/income", userAuth, addIncome);
    app.delete("/account/:accountId/income/:incomeId", userAuth, removeIncome);
}
