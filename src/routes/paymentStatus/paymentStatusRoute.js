const express = require('express');
const paymentStatusController = require("../../controllers/paymentStatus/paymentStatusController.js");

const router = express.Router();

router.get('/get-master-data', paymentStatusController.getMasterData)

module.exports = router;