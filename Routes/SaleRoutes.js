const express = require('express');
const Auth = require('../Auth/Auth');
const { createSale, getSalesForReqdYear, getSalesForReqdYearAndMonth, deleteSale } = require('../Controlers/SaleController');

const router = express.Router();

router.post('/sale/create', Auth, createSale);
router.get('/sales/year/:year', Auth, getSalesForReqdYear);
router.get('/sales/year-month/:year/:month', Auth, getSalesForReqdYearAndMonth);
router.delete('/sales/delete/:id', Auth, deleteSale);

module.exports = router;