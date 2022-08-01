export const fetchedMedicinesReducer = (currentFetchedMedicinesState = {fetchedMedicines: [],
    fetchedMedicinesLoading: false}, action) => {
    
    if(action.type === 'FETCH_MEDICINES_LOADING') {
        return {...currentFetchedMedicinesState, fetchedMedicinesLoading: true};
    } else if(action.type === 'FETCH_MEDICINES_LOADED') {
        return {fetchedMedicines: action.payload, fetchedMedicinesLoading: false};
    } else if(action.type === 'POST_MEDICINE_LOADED') {
        return {fetchedMedicines: [...currentFetchedMedicinesState.fetchedMedicines, action.payload]};
    } else if(action.type === 'DELETE_MEDICINE_LOADING') {
        return {...currentFetchedMedicinesState, fetchedMedicinesLoading: true};
    } else if(action.type === 'DELETE_MEDICINE_LOADED') {
        return {fetchedMedicines: currentFetchedMedicinesState.fetchedMedicines.filter(medicine => {
            return medicine._id !== action.payload;
        }), fetchedMedicinesLoading: false};
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_FETCHED_MEDICINES') {
        return {fetchedMedicines: [], fetchedMedicinesLoading: false};
    }   

    return currentFetchedMedicinesState;
}

export const medicinesFormReducer = (currentMedicinesFormState = [], action) => {

    if(action.type === 'ADD_MEDICINE') {
        const newMedicineForm = currentMedicinesFormState;
        for(let i = 0; i < action.amount; i++) {
            newMedicineForm.push({
                name: '',
                category: '',
                MRP: '',
                costPrice: '',
                discount: '',
                expDate: '',
                stock: ''
            });
        } 

        return newMedicineForm;

    } else if(action.type === 'UPDATE_MEDICINE') {
        return currentMedicinesFormState.map((formItem, i) => {
            if(i === action.payload.index) {
                return {...formItem, [action.payload.property]: action.payload.value};
            } else return formItem;
        })
    } else if(action.type === 'DELETE_MEDICINE') {
        return currentMedicinesFormState.filter((formItem, i) => action.payload !== i);
    } else if(action.type === 'USER_LOGGED_IN' || action.type === 'USER_LOGGED_OUT' || 
        action.type === 'DELETE_MEDICINES_FORM') {
        return [];
    }

    return currentMedicinesFormState;
}