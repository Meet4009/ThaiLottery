const User = require("../models/userModel");
const { currencyConveraterToUSD, currencyConveraterToTHB, currencyConveraterFormUSD } = require("../utils/currencyConverater");


// -----------------------------------------------//
// --------------- payment Approve -------------- // 
// -----------------------------------------------//

const paymentApprove = async (payment, statusCode, res) => {
    try {
        const amount = await currencyConveraterToUSD(payment.currency_code, payment.amount);
        console.log(amount);

        const userid = payment.user_id;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(400).json({
                status: false,
                data: {},
                message: `user doen not exist Id: ${userid}`
            });
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
                data: { payment, user },
                messaage: "Diposit sucessfully",
            });
        }

        // --------------- withdraw Approve --------------- //
        if ('withdraw' == payment.payment_type) {

            payment.status = 'success';
            payment.action_status = 'approved';

            await payment.save();

            return res.status(statusCode).json({
                status: true,
                data: { payment, user },
                messaage: "Withdraw sucessfully",
            });
        }

    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}


// -----------------------------------------------//
// --------------- payment reject -------------- // 
// -----------------------------------------------//

const paymentReject = async (payment, statusCode, res) => {
    try {
        const userid = payment.user_id;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(400).json({
                status: false,
                data: {},
                message: `user doen not exist Id: ${userid}`
            });
        }

        // --------------- diposit reject --------------- //
        if ('diposit' == payment.payment_type) {

            payment.status = 'rejected';
            payment.action_status = 'rejected';

            await payment.save();

            return res.status(statusCode).json({
                status: true,
                data: { payment, user },
                messaage: "diposit rejected sucessfully"
            });
        }

        // --------------- withdraw reject --------------- //
        if ('withdraw' == payment.payment_type) {

            const amount = await currencyConveraterToUSD(payment.currency_code, payment.amount);
            user.balance = user.balance + amount;

            payment.status = 'rejected';
            payment.action_status = 'rejected';

            await payment.save(); 
            await user.save();


            return res.status(statusCode).json({
                status: true,
                data: { payment, user },
                messaage: "withdraw rejected sucessfully"
            });
        }
    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


// -----------------------------------------------------//
// --------------- Total deposit Amount -------------- // 
// -----------------------------------------------------//
const calculateAmount = async (dipositeData) => {
    const total = await dipositeData.reduce(async (accumulatorPromise, data) => {
        const accumulator = await accumulatorPromise;
        const amountInTHB = await currencyConveraterToTHB(data.currency_code, data.amount || 0);
        return accumulator + amountInTHB;
    }, Promise.resolve(0));

    return total;
};

module.exports = { calculateAmount, paymentReject, paymentApprove };
