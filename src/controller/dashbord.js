const User = require("../models/userModel");
const userPayment = require("../models/userPayment");
const LotteryBuyer = require("../models/lotteryBuyer");
const { calculateAmount } = require("../utils/paymentDecision");


// ------------------------------------------------------------- //
// ----------- 30 ----------- Deshbord ------------------------- //
// ------------------------------------------------------------- //

exports.dashboard = async (req, res, next) => {

    try {
        // User Details
        const totalUsers = await User.countDocuments({ role: "user" });
        const activeUsers = await User.countDocuments({ role: "user", loggedIn: true });
        const emailUnverified = null;
        const mobileUnverified = null;

        //  Deposits 

        const depositData = await userPayment.find({ payment_type: "diposit", status: "success", action_status: "approved" });
        const totalDeposits = Math.round(await calculateAmount(depositData));

        const pendingDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "pending", action_status: "pending" });
        const approvedDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "success", action_status: "approved" });
        const rejectedDeposit = await userPayment.countDocuments({ payment_type: "diposit", status: "rejected", action_status: "rejected" });


        //  Withdraw 
        const withdrawData = await userPayment.find({ payment_type: "withdraw", status: "success", action_status: "approved" });
        const totalWithdrawals = Math.round(await calculateAmount(withdrawData));

        const pendingWithdraw = await userPayment.countDocuments({ payment_type: "withdraw", status: "pending", action_status: "pending" });
        const approvedWithdrawal = await userPayment.countDocuments({ payment_type: "withdraw", status: "success", action_status: "approved" });
        const rejectedWithdrawal = await userPayment.countDocuments({ payment_type: "withdraw", status: "rejected", action_status: "rejected" });
        const soldTicket = await LotteryBuyer.countDocuments();
        const soldAmount = null;
        const winner = null;
        const winAmmount = null;

        res.status(200).json({
            success: true,
            "totalUsers": totalUsers,                       // Count
            "activeUsers": activeUsers,                     // Count
            "emailUnverified": emailUnverified,             // Count 
            "mobileUnverified": mobileUnverified,           // Count
            "soldTicket": soldTicket,                       // Count
            "soldAmount": soldAmount,                       // Amount
            "winner": winner,                               // Count
            "winAmmount": winAmmount,                       // Amount
            "totalDeposits": totalDeposits,                 // Amount
            "approvedDeposit": approvedDeposit,             // Count
            "rejectedDeposit": rejectedDeposit,             // Count
            "pendingDeposit": pendingDeposit,               // Count
            "totalWithdrawals": totalWithdrawals,           // Amount
            "approvedWithdrawal": approvedWithdrawal,       // Count
            "rejectedWithdrawal": rejectedWithdrawal,       // Count
            "pendingWithdraw": pendingWithdraw,             // Count
        });
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }


};
