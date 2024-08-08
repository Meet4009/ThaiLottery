const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");

const User = require("../models/userModel");
const userPayment = require("../models/userPayment");

const jwt = require("jsonwebtoken");
const { paymentApprove, paymentReject } = require("../utils/paymentDecision");



// ----------------------------------------------------------//
// ---------------- deposit request -- User ---------------- // 
// ----------------------------------------------------------//

exports.deposit = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401))
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const { amount, UTR } = req.body;

    const payment = await userPayment.create({
        user_id: user.id,
        amount,
        UTR,
        payment_type: "diposit"
    })

    await payment.save();

    res.status(200).json({
        success: true,
        payment,
    });

});



// ----------------------------------------------------------//
// ---------------- Withdraw request -- User --------------- // 
// ----------------------------------------------------------//

exports.withdraw = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const userBalance = user.balance;

    const { amount, upi_id } = req.body;

    if (amount > userBalance) {
        return next(new ErrorHander(`You don't have ${amount} in your account`, 401));
    }

    const payment = await userPayment.create({
        user_id: user.id,
        amount,
        upi_id,
        payment_type: "withdraw"
    })

    await payment.save();

    res.status(200).json({
        success: true,
        payment,
    });

});



// ----------------------------------------------------------//
// --------------- Deposits History -- User ---------------- // 
// ----------------------------------------------------------//

exports.depositsHistory = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const History = await userPayment.find({ payment_type: "diposit", user_id: { _id: user.id } });

    res.status(200).json({
        success: true,
        "Deposits History": History,
    });

});



// ----------------------------------------------------------//
// ---------------- Withdraw History -- User --------------- // 
// ----------------------------------------------------------//

exports.withdrawHistory = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHander("pleses login to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeData.id);

    const History = await userPayment.find({ payment_type: "withdraw", user_id: { _id: user.id } });

    res.status(200).json({
        success: true,
        "withdraw History": History,
    });

});



// ----------------------------------------------------------//
// ---------------- Deposit History -- admin --------------- // 
// ----------------------------------------------------------//

exports.getDeposits = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "diposit" })
        .populate('user_id');

    res.status(200).json({
        success: true,
        "diposit": payment,
    });

});



// ----------------------------------------------------------//
// --- Pending, Approve, Reject Deposit History -- admin --- // 
// ----------------------------------------------------------//

exports.getRequestDeposits = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "diposit", action_status: req.params.status })
        .populate('user_id');

    res.status(200).json({
        success: true,
        "diposit": payment,
    });

});



// ----------------------------------------------------------//
// ---------------- Withdraw History -- admin -------------- // 
// ----------------------------------------------------------//

exports.getWithdraws = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "withdraw" })
        .populate('user_id');

    res.status(200).json({
        success: true,
        "withdraw": payment,
    });

});



// -----------------------------------------------------------//
// --- Pending, Approve, Reject withdraw History -- admin --- // 
// -----------------------------------------------------------//

exports.getRequestWithdraws = catchAsyncErrors(async (req, res) => {

    const payment = await userPayment.find({ payment_type: "withdraw", action_status: req.params.status })
        .populate('user_id');

    res.status(200).json({
        success: true,
        "withdraw": payment,
    });

});



// ----------------------------------------------------------//
// --------------- Approve Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setApproveDeposit = catchAsyncErrors(async (req, res, next) => {

    const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentApprove(payment, 200, res);

});



// ----------------------------------------------------------//
// ---------------- Reject Deposit -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectDeposit = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "diposit", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentReject(payment, 200, res);

});



// ----------------------------------------------------------//
// --------------- Approve Withdraw -- admin --------------- // 
// ----------------------------------------------------------//

exports.setApprovewithdraw = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentApprove(payment, 200, res);

});



// ----------------------------------------------------------//
// --------------- Reject Withdraw -- admin ---------------- // 
// ----------------------------------------------------------//

exports.setRejectwithdraw = catchAsyncErrors(async (req, res, next) => {
    const payment = await userPayment.findOne({ payment_type: "withdraw", status: "pending", action_status: "pending", _id: req.params.id });

    if (!payment) {
        return next(new ErrorHander(`payment doen not exist Id: ${req.params.id}`, 400));
    }

    paymentReject(payment, 200, res);

});

