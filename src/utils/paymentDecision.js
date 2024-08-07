const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHander = require("./errorhander");


// -----------------------------------------------//
// --------------- payment Approve -------------- // 
// -----------------------------------------------//

const paymentApprove = catchAsyncErrors(async (payment, statusCode, res) => {

    const amount = payment.amount;

    const userid = payment.user_id;

    const user = await User.findById(userid);
    if (!user) {
        return new ErrorHander(`user doen not exist Id: ${userid}`, 400);
    }
    const userBalance = user.balance;

    // --------------- diposit Approve --------------- //
    if ('diposit' == payment.payment_type) {
        const newBalance = userBalance + amount

        user.balance = newBalance;

        await user.save();

        payment.status = 'success';
        payment.action_status = 'approved';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            messaage: "diposit sucessfully",
            "Deposit": payment,
            "user": user
        });
    }

    // --------------- withdraw Approve --------------- //
    if ('withdraw' == payment.payment_type) {

        const newBalance = userBalance - amount;

        user.balance = newBalance;

        await user.save();

        payment.status = 'success';
        payment.action_status = 'approved';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            messaage: "withdraw sucessfully",
            "withdraw": payment,
            "user": user
        });
    }
})


// -----------------------------------------------//
// --------------- payment Approve -------------- // 
// -----------------------------------------------//

const paymentReject = catchAsyncErrors(async (payment, statusCode, res) => {

    const userid = payment.user_id;

    const user = await User.findById(userid);
    if (!user) {
        return next(new ErrorHander(`user doen not exist Id: ${userid}`, 400));
    }

    // --------------- diposit Approve --------------- //
    if ('diposit' == payment.payment_type) {

        payment.status = 'rejected';
        payment.action_status = 'rejected';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            messaage: "diposit rejected sucessfully",
            "Deposit": payment,
            "user": user
        });
    }

    // --------------- withdraw Approve --------------- //
    if ('withdraw' == payment.payment_type) {

        payment.status = 'rejected';
        payment.action_status = 'rejected';

        await payment.save();

        return res.status(statusCode).json({
            status: true,
            messaage: "withdraw rejected sucessfully",
            "withdraw": payment,
            "user": user
        });
    }
});


// -----------------------------------------------------//
// --------------- Total Deposite Amount -------------- // 
// -----------------------------------------------------//
function calculateAmount(dipositeData) {
    return dipositeData.reduce((total, dipositeData) => total + (dipositeData.amount || 0), 0);

};

module.exports = { calculateAmount, paymentReject, paymentApprove };
