const express = require("express");
const Service = require("../services/render");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { setlottery,
    getLottery,
    buylottery,
    genarateTicketNumber,
    pendingTickets,
    ticketHistory,
    getAllPendingTickets,
    lossbuyer,
    winbuyer,
    getLotterys,
    getWinnerSpace,
    allWinners } = require("../controller/lottery");
const router = express.Router();

// fortend Routes
router.get('/all-lotteries', Service.allLottries)
// router.get('/allwinner', Service.totalWinning)
router.get('/chooseWinner', Service.chooseWinner)


// -----------------------------------------------//
// ------------------ Admin side ---------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/admin/lottery

router.route("/admin/lottery/newlottery").post(isAuthenticatedUser, authorizeRoles("admin"), setlottery);                      // OK
// router.route("/admin/lottery/all-lottery").get(getLotterys);                     // OK
router.route("/all-lottery").get(isAuthenticatedUser, authorizeRoles("admin"), getLotterys);                     // OK

// router.route("/admin/lottery/choose-winner").get(getAllPendingTickets);          // OK
router.route("/admin/lottery/choose-winner").get(isAuthenticatedUser, authorizeRoles("admin"), getAllPendingTickets);          // OK

router.route("/admin/lottery/loss-buyer/:id").get(isAuthenticatedUser, authorizeRoles("admin"), lossbuyer);                    // OK
router.route("/admin/lottery/win-buyer/:id").post(isAuthenticatedUser, authorizeRoles("admin"), winbuyer);  // admin
router.route("/admin/lottery/winner-space/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getWinnerSpace);  // admin

// router.route("/admin/lottery/allwinner/:id").get(allWinners);  // admin
router.route("/admin/lottery/allwinner/:id").get(isAuthenticatedUser, authorizeRoles("admin"), allWinners);  // admin


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// --> http://localhost:8002/thailottery/api/user/lottery

router.route("/details/:id").get(isAuthenticatedUser, getLottery);                          // OK
router.route("/ticket-number").get(isAuthenticatedUser, genarateTicketNumber);              // Ok
router.route("/buylottery").post(isAuthenticatedUser, buylottery);                          // OK 
router.route("/pending-ticket").get(isAuthenticatedUser, pendingTickets);                   // OK
router.route("/all-ticket").get(isAuthenticatedUser, ticketHistory);                        // OK





module.exports = router;