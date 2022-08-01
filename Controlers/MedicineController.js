const Medicine = require("../Models/MedicineModel");
const moment = require('moment');

exports.createMedicine = async(req, res) => {
    const { name, category, MRP, costPrice, discount, expDate, stock } = req.body;
    if (!name || !category || typeof costPrice !== 'number' || costPrice <= 0 ||
        typeof discount !== 'number' || discount < 0 || discount > 100 || !expDate ||
        typeof stock !== 'number' || stock <= 0 || typeof MRP !== 'number' || MRP < 0) {
        return res.status(400).json({ message: `please fill all the details` });
    }

    const date = expDate.split('-');
    if(date.length === 3) {
        const expDateObj = {
            date: '', month: '', year: ''
        };

        const dateNow = moment().utc().set('hour', moment().utc().hour() + 5).set('minute', moment().utc().minute() + 30);

        if((date[0] !== '' && date[1] !== '' && date[2] !== '') && (parseInt(date[0]) >= dateNow.year() || 
            parseInt(date[1]) >= dateNow.month() || parseInt(date[2]) >= dateNow.date())) {

            expDateObj.year = parseInt(date[0]);
            expDateObj.month = parseInt(date[1]);
            expDateObj.date = parseInt(date[2]);

            try {
                const medicine = new Medicine({
                    name: name.toLowerCase(),
                    category: category.toLowerCase(),
                    MRP,
                    costPrice,
                    discount,
                    expDate: expDateObj,
                    stock
                });

                const existingMedicine = await Medicine.findOne({ name: name.toLowerCase()});
                if (existingMedicine) {
                    return res.status(401).json({ message: 'medicine already exists' });
                }
    
                const newMedicine = await medicine.save();
                res.status(201).json({ payload: newMedicine, message: 'Medicine saved successfully.' });
        
            } catch (error) {
                res.status(500).json({ message: 'Some error occured. Please try again.' });
            }
        } else {
            res.status(400).json({message: 'Expiry date of the medicine is invalid. Please check again.'});
        }
    } else {
        res.status(400).json({message: 'Date is incorrect. Please check again.'});
    }
    
}

exports.getMedicine = async(req, res) => {
    try {
        const allMedicines = await Medicine.find();
        res.status(200).json({ payload: allMedicines });
    } catch (error) {
        res.status(500).json({ message: 'Some error occured. Please try again.' });
    }
}

exports.getSingleMedicineByName = async(req, res) => {
    if (req.params.name.trim().toLowerCase() === '' || req.params.name.trim().toLowerCase() === '.') {
        console.log(123);
        return res.status(200).json({ payload: [] });
    }

    try {
        const medicine = await Medicine.find({ name: { $regex: `${req.params.name.trim().toLowerCase()}` } });
        if (medicine.length) {
            res.status(200).json({ payload: medicine });
        } else {
            res.status(404).json({ message: 'Medicine not found.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Some error occured. Please try again.' });
    }
}

exports.getMedicinesWithGivenStocks = async(req, res) => {
    try {
        const medicines = await Medicine.find({ stock: { $lte: req.params.stock } });
        res.status(200).json({ payload: medicines });
    } catch (err) {
        res.status(500).json({ message: 'Some error occured. Please try again.' })
    }
}

exports.getSingleMedicine = async(req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(400).send("this medicine does not exist");
        }
        res.status(200).send(medicine)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateMedicine = async(req, res) => {
    try {
        const {body} = req;
        const reqdMedicine = await Medicine.findById(req.params.id);
        if(body.name && typeof body.name === 'string' && body.name !== '') 
            reqdMedicine.name = body.name;
        if(body.category && typeof body.category === 'string' && body.category !== '') {
            reqdMedicine.category = body.category;
        }
        if(body.expDate && typeof body.expDate === 'string' && body.expDate !== '') {
            const dateSplittedArray = body.expDate.split('-');
            if(dateSplittedArray.length === 3) {
                const year = parseInt(dateSplittedArray[0]);
                const month = parseInt(dateSplittedArray[1]);
                const date = parseInt(dateSplittedArray[2]);
                if(year >= 2021 && month <= 12 && 
                    (date <= 31 && date >= 1)) {
                    
                    reqdMedicine.expDate = {
                        date, month, year
                    };
                } else return res.status(400).json({message: 'Date format is invalid. Please check again.'});
            }
        }
        if(body.stock && typeof body.stock === 'number' && body.stock > 0) {
            reqdMedicine.stock = body.stock;
        }
        if(body.costPrice && typeof body.costPrice === 'number' && body.costPrice > 0) {
            reqdMedicine.costPrice = body.costPrice;
        }
        if(body.MRP && typeof body.MRP === 'number' && body.MRP > 0) {
            reqdMedicine.MRP = body.MRP;
        }  
        
        const updatedMedicine = await reqdMedicine.save();
        if(updatedMedicine && updatedMedicine._id)
            res.status(201).json({payload: updatedMedicine, message: 'Medicine updated successfully.'});
    } catch (error) {
        res.status(500).json({message: 'Some error occured. Please try again.'});
    }
}

exports.deleteMedicine = async(req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.status(200).json({ payload: req.params.id, message: "Medicine deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Some error occured. Please try again.' });
    }
}