const mongoose = require("mongoose");

const { sendEmail } = require('../Controlers/EmailController');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    expDate: {
        date: {type: Number, required: true},
        month: {type: Number, required: true},
        year: {type: Number, required: true}
    },
    stock: {
        type: Number,
        required: true
    }
})

const Medicine = mongoose.model("Medicine", medicineSchema);
Medicine.watch().on('change', change => {
    const medicineChangeHandler = async() => {
        if (change && change.updateDescription && change.updateDescription.updatedFields &&
            change.updateDescription.updatedFields.stock) {
            const fetchedMedicine = await Medicine.findById(change.documentKey._id);
            if(fetchedMedicine.stock <= 100) {
                sendEmail(undefined, undefined, 
                `Stock is low for the medicine ${fetchedMedicine.name}. Only ${fetchedMedicine.stock} units are remaining.`);
            }
        }
    }
    
    medicineChangeHandler();
});

module.exports = Medicine;

