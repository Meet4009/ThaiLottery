const LotteryPrice = require("../models/lotteryPrice");

// ----------------------------------------------------------------- //
// ------ 28 -----------set Lottery price -- Admin ----------------- //
// ----------------------------------------------------------------- //
exports.addLotteryPrice = async (req, res) => {
    try {
        const { priceNumber, price, totalPerson } = req.body;

        const lottery_price = new LotteryPrice({
            priceNumber, price, totalPerson
        });

        await lottery_price.save();

        res.status(200).json({
            status: true,
            data: lottery_price,
            message: `lottery Price create successfully`
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
};


// ----------------------------------------------------------------- //
// ------ 29 -----------get Lottery price -- Admin ----------------- //
// ----------------------------------------------------------------- //

exports.lotteryPrice = async (req, res) => {
    try {
        const lortteryPrice = await LotteryPrice.find().sort({ priceNumber: 1 });

        res.status(200).json({
            status: true,
            data: lortteryPrice,
            message: `All lottery Price`
        });


    } catch (error) {

        res.status(500).json({
            status: false,
            message: `Internal Server Error -- ${error}`
        });
    }
}


