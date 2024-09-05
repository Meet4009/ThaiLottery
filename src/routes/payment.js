const express = require("express");

const {
    deposit,
    withdraw,
    getWithdraws,
    getRequestWithdraws,
    getDeposits,
    getRequestDeposits,
    setRejectDeposit,
    setRejectwithdraw,
    setApprovewithdraw,
    setApproveDeposit,
    depositsHistory,
    withdrawHistory,
    userDepositsHistory,
    userWithdrawHistory
} = require("../controller/paymentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { paymentvalidStatus } = require("../middleware/paymentStatus");
const { currency } = require("../controller/updateCurrency");
const router = express.Router();


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api/user/payment

router.route("/deposit").post(deposit);                                                                    // OK 
router.route("/withdraw").post(withdraw);                                                                  // OK

router.route("/deposit-history").get(depositsHistory);                                                    // OK 
router.route("/withdraw-history").get(withdrawHistory);                                                    // OK



// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api/admin/payment

router.route("/deposits").get(isAuthenticatedUser, authorizeRoles("admin"), getDeposits);                                      // OK
router.route("/:status/deposits").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestDeposits);   // OK

router.route("/withdraws").get(isAuthenticatedUser, authorizeRoles("admin"), getWithdraws);                                     // OK
router.route("/:status/withdraws").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestWithdraws);   // OK


router.route("/deposit/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApproveDeposit);                     // Ok
router.route("/deposit/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectDeposit);                       // OK  

router.route("/withdraw/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApprovewithdraw);                    // Ok
router.route("/withdraw/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectwithdraw);                      // OK

router.route("/deposit-history/:id").get(isAuthenticatedUser, authorizeRoles("admin"), userDepositsHistory);                     // Ok
router.route("/withdraw-history/:id").get(isAuthenticatedUser, authorizeRoles("admin"), userWithdrawHistory);                     // Ok



module.exports = router;