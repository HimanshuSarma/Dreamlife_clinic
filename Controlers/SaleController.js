const mongoose = require('mongoose');
const SaleSchema = require('../Models/SaleModel');
const Medicine = require('../Models/MedicineModel');
const moment = require('moment');

exports.createSale = async(req, res) => {
    const session = await mongoose.startSession();
    try {
        const reqSale = req.body;
        const postSale = { products: [], phone: null };
        if ((typeof reqSale.custPhone === 'number' && reqSale.custPhone > 0) || reqSale.custPhone === '') {
            postSale.custPhone = reqSale.custPhone ? reqSale : null;
            session.startTransaction();
            for (let i = 0; i < reqSale.products.length; i++) {
                if (reqSale.products[i].name !== '' && typeof reqSale.products[i].sellingPrice === 'number' &&
                    reqSale.products[i].sellingPrice > 0 && typeof reqSale.products[i].profit === 'number' &&
                    reqSale.products[i].profit >= 0 && typeof reqSale.products[i].qty === 'number' &&
                    reqSale.products[i].qty > 0) {
                    const medicine = await Medicine.find({ 'name': reqSale.products[i].name });

                    if (medicine.length !== 1) {
                        return res.status(400).json({ message: 'Invalid inputs. Please fill the details correctly.' });
                    } else {
                        const discount = (100 - (reqSale.products[i].sellingPrice * 100) /
                            medicine[0].MRP);

                        if (reqSale.products[i].profit === reqSale.products[i].sellingPrice -
                            medicine[0].costPrice) {
                            postSale.products.push({
                                name: reqSale.products[i].name,
                                costPrice: reqSale.products[i].costPrice,
                                sellingPrice: reqSale.products[i].sellingPrice,
                                discount,
                                profit: reqSale.products[i].profit,
                                qty: reqSale.products[i].qty
                            });

                            medicine[0].stock -= reqSale.products[i].qty;
                            await medicine[0].save({ session });
                        } else {
                            return res.status(400).json({ message: 'Profit is incorrect. Please check again.' });
                        }

                    }
                } else {
                    return res.status(400).json({ message: 'Invalid inputs. Please fill the details correctly.' });
                }
            }

            const dateNow = moment().utc();
            dateNow.set('hour', dateNow.hour() + 5);
            dateNow.set('minute', dateNow.minute() + 30);
            postSale.createdAt = {
                date: dateNow.date(),
                month: dateNow.month() + 1,
                year: dateNow.year()
            };
            const newSale = new SaleSchema(postSale);
            const postedSale = await newSale.save({ session });
            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ payload: postedSale, message: 'Sale posted successfully.' });

        } else {
            await session.abortTransaction();
            res.status(400).json({ message: 'Please enter the customer phone correctly.' });
        }
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}


exports.getSalesForReqdYear = async(req, res) => {
    try {
        if (req.params.year >= 2021) {
            const sales = await SaleSchema.find({ 'createdAt.year': req.params.year });
            res.status(200).json({ payload: sales });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}

exports.getSalesForReqdYearAndMonth = async(req, res) => {
    try {
        const { year, month } = req.params;
        const sales = await SaleSchema.find({ 'createdAt.year': year, 'createdAt.month': month });
        res.status(200).json({ payload: sales });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}

exports.deleteSale = async(req, res) => {
    try {
        await SaleSchema.findByIdAndDelete(req.params.id);
        res.status(200).json({payload: req.params.id, message: 'Sale deleted successfully.'});
    } catch(err) {
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
}