const express = require("express");
const Auth = require("../Auth/Auth");

const router = express.Router();

const {
    createMedicine,
    getMedicine,
    getSingleMedicine,
    updateMedicine,
    deleteMedicine,
    getSingleMedicineByName,
    getMedicinesWithGivenStocks
} = require("../Controlers/MedicineController");
const { route } = require("./AdminUserRoutes");

router.post("/medicine/create", Auth, createMedicine);

router.get("/medicine/all", Auth, getMedicine);

router.get('/medicine/stocks/:stock', Auth, getMedicinesWithGivenStocks);

router.get("/medicine/:name", Auth, getSingleMedicineByName);

router.get("/medicine/single/:id", Auth, getSingleMedicine);

router.put("/medicine/update/:id", Auth, updateMedicine);

router.delete("/medicine/delete/:id", Auth, deleteMedicine);

module.exports = router