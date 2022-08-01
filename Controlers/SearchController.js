const express = require('express');
const res = require('express/lib/response');

const Patient = require('../Models/PatientModel');
const Medicine = require('../Models/MedicineModel');

exports.search = async(req, res) => {
    const { val, mainCategory, subCategory } = req.body;
    if (val === '' || val === '.') {
        return res.status(200).json({ payload: [], searchedItems: mainCategory });
    };
    let searchResults;
    try {
        if (mainCategory === 'patients') {
            searchResults = await Patient.find({
                [subCategory]: { $regex: `${val.trim().toLowerCase()}` }
            });

            res.status(200).json({ payload: searchResults, searchedItems: mainCategory });
        } else if (mainCategory === 'medicines') {
            searchResults = await Medicine.find({
                [subCategory]: { $regex: `${val.trim().toLowerCase()}` }
            });

            res.status(200).json({ payload: searchResults, searchedItems: mainCategory });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}