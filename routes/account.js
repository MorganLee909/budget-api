import {userAuth} from "../auth.js";
import {
    create,
    getAccounts,
    addIncome,
    removeIncome,
    addBill,
    removeBill,
    addAllowance
} from "../controllers/account.js";

export default (app)=>{
    app.post("/account", userAuth, create);
    app.get("/account/user/:userId", userAuth, getAccounts);

    app.post("/account/:accountId/income", userAuth, addIncome);
    app.delete("/account/:accountId/income/:incomeId", userAuth, removeIncome);

    app.post("/account/:accountId/bill", userAuth, addBill);
    app.delete("/account/:accountId/bill/:billId", userAuth, removeBill);

    app.post("/account/:accountId/allowance", userAuth, addAllowance);
}
