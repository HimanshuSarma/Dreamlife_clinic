import base_url from '../../setup/appSetup.jsx';

export const fetchMedicines = () => {
    return async(dispatch) => {
        dispatch({type: 'FETCH_MEDICINES_LOADING'});

        try {
            const fetchMedicinesReq = await fetch(`${base_url}/medicine/all`, {
                method: 'GET',
                credentials: 'include'
            });

            const fetchMedicinesReqData = await fetchMedicinesReq.json();

            if(fetchMedicinesReq.ok) {
                dispatch({
                    type: 'FETCH_MEDICINES_LOADED',
                    payload: fetchMedicinesReqData.payload
                })
            } else {

            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const fetchMedicineByNameInSales = (payload, setShowSalesProductSearchedNames) => {
    return async(dispatch, getState) => {
        const product = getState().salesForm[payload.currentSaleIndex].products[payload.currentProductIndex];
        dispatch({type: 'UPDATE_SALES_SEARCHED_PRODUCTS_LOADING'});

        try {
            let fetchMedicineByNameReq;
            let fetchMedicineByNameReqData;

            clearTimeout(product.debouncingTimerID);
            const timerID = setTimeout(() => {
                const req = async () => {
                    if(payload.val !== '') {
                        fetchMedicineByNameReq = await fetch(`${base_url}/medicine/${payload.val}`, {
                            method: 'GET',
                            credentials: 'include'
                        });

                        if(fetchMedicineByNameReq.ok) {
                            fetchMedicineByNameReqData = await fetchMedicineByNameReq.json();
                        } else {
                            fetchMedicineByNameReqData = {payload: []};
                        }

                    } else {
                        fetchMedicineByNameReqData = {payload: []};
                    }

                    dispatch({
                        type: 'UPDATE_SALES_SEARCHED_PRODUCTS_LOADED',
                        payload: {
                            searchedProducts: fetchMedicineByNameReqData.payload,
                            currentSaleIndex: payload.currentSaleIndex,
                            currentProductIndex: payload.currentProductIndex
                        }
                    });

                    setShowSalesProductSearchedNames(true);
                }

                req();
            }, 1000); 

            dispatch({
                type: 'UPDATE_SALES_PRODUCT_DEBOUNCING_ID',
                payload: {currentSaleIndex: payload.currentSaleIndex, 
                        currentProductIndex: payload.currentProductIndex,
                        debouncingTimerID: timerID}
            });
            
        } catch (err) {
            console.log(err);
        }
    }
}

export const postMedicine = (index, medicineMessageHandler) => {
    return async(dispatch, getState) => {

        const medicine = getState().medicineForm[index];

        if(medicine.name !== '' && medicine.category !== '' && typeof medicine.costPrice === 'number' && 
            medicine.costPrice > 0 && typeof medicine.MRP === 'number' && 
            medicine.MRP > 0 && typeof medicine.discount === 'number' && medicine.discount >= 0 && 
            medicine.expDate !== '' && typeof medicine.stock ==='number' && medicine.stock > 0) {

            dispatch({type: 'POST_MEDICINE_LOADING'});

            try {
                const postMedicineReq = await fetch(`${base_url}/medicine/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(medicine)
                });

                const postMedicineReqData = await postMedicineReq.json();

                if(postMedicineReq.ok) {
                    dispatch({
                        type: 'POST_MEDICINE_LOADED',
                        payload: postMedicineReqData.payload
                    });

                    medicineMessageHandler(postMedicineReqData.message);
                } else {
                    medicineMessageHandler(postMedicineReqData.message);
                }
            } catch (err) {
                console.log(err);
            }
            
        } else {
            medicineMessageHandler('Please fill out the details correctly.');
        }
    }
}


export const editMedicine = (payload, editMedicineMessageHandler) => {
    return async(dispatch) => {

        if(((typeof payload.editData.MRP === 'number' && payload.editData.MRP >= 0) || payload.editData.MRP === '') && 
        ((typeof payload.editData.costPrice === 'number' && payload.editData.costPrice >= 0) || payload.editData.costPrice === '') && 
        ((typeof payload.editData.discount === 'number' && payload.editData.discount >= 0) || payload.editData.discount === '') && 
        ((typeof payload.editData.stock === 'number' && payload.editData.stock >= 0) || payload.editData.stock === '')) {
            dispatch({type: 'EDIT_MEDICINE_LOADING'});

            try {
                const editMedicineReq = await fetch(`${base_url}/medicine/update/${payload._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload.editData)
                });

                const editMedicineReqData = await editMedicineReq.json();

                if(editMedicineReq.ok) {
                    dispatch({
                        type: 'EDIT_MEDICINE_LOADED',
                        payload: editMedicineReqData.payload
                    });

                    editMedicineMessageHandler(editMedicineReqData.message);
                } else {
                    dispatch({type: 'EDIT_MESSAGE_FAILED'});
                    editMedicineMessageHandler(editMedicineReqData.message);
                }
            } catch(err) {
                console.log(err);
            }
        }
        
    }
}


export const deleteMedicine = (payload, medicineMessageHandler) => {
    return async(dispatch) => {
        dispatch({type: 'DELETE_MEDICINE_LOADING'});

        try {
            const deleteMedicineReq = await fetch(`${base_url}/medicine/delete/${payload}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const deleteMedicineReqData = await deleteMedicineReq.json();
        
            if(deleteMedicineReq.ok) {
                dispatch({
                    type: 'DELETE_MEDICINE_LOADED',
                    payload: deleteMedicineReqData.payload
                });

                medicineMessageHandler(deleteMedicineReqData.message);
            } else {
                medicineMessageHandler(deleteMedicineReqData.message);
            }
        } catch(err) {
            console.log(err);
        }
    }
}


