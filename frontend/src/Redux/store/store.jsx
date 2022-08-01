import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {userReducer} from '../Reducers/userReducers';
import {searchReducer, searchItemsReducer} from '../Reducers/searchReducers';
import {fetchedPatientsReducer, patientsFormReducer} from '../Reducers/patientReducers';
import {fetchedMedicinesReducer, medicinesFormReducer} from '../Reducers/medicineReducers';
import {salesFormReducer, salesOfGivenYearAndMonthReducer} from '../Reducers/salesReducers';
import {salesOfReqdYearReducer, medicinesWithGivenStockReducer} from '../Reducers/statsReducers';

const reducer = combineReducers({
    userState: userReducer,
    fetchedPatientsData: fetchedPatientsReducer,
    fetchedMedicinesData: fetchedMedicinesReducer,
    salesOfReqdYear: salesOfReqdYearReducer,
    salesOfGivenYearAndMonth: salesOfGivenYearAndMonthReducer,
    medicinesWithGivenStock: medicinesWithGivenStockReducer,
    patientForm: patientsFormReducer,
    medicineForm: medicinesFormReducer,
    salesForm: salesFormReducer,
    search: searchReducer,
    searchedItems: searchItemsReducer
});

const initialState = {};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;