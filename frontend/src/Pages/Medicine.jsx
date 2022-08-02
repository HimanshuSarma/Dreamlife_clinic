import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {AiFillDelete} from "react-icons/ai";

import BottomRightCard from '../Components/UIElements/BottomRightCard';

import MedicineTable from '../Components/MedicineTable';

import {postMedicine} from '../Redux/ActionCreators/medicineActions';

let medicineMessageTimerID;

const Medicine = () => {
  const medicineFormState = useSelector(store => store.medicineForm);
  const {fetchedMedicines} = useSelector(store => store.fetchedMedicinesData);

  const [medicineMessage, setMedicineMessage] = useState(null);
  const [showMedicines, setShowMedicines] = useState(true);
  const [showMedicineInputs, setShowMedicineInputs] = useState(medicineFormState.length > 0 ? true : false);
  const [totalMedicinesInputVal, setTotalMedicinesInputVal] = useState(1);
  const [totalMedicines, setTotalMedicines] = useState(1);

  const dispatch = useDispatch();
  const location = useLocation();

  const medicineFormStateLength = medicineFormState.length;
  const fetchedMedicinesLength = fetchedMedicines.length;

  const medicineMessageHandler = (message) => {
    setMedicineMessage(message);
    medicineMessageTimerID = setTimeout(() => {
      setMedicineMessage(null);
    }, 4000);
  }

  useEffect(() => {
    if(!showMedicineInputs) {
      dispatch({type: 'DELETE_MEDICINES_FORM'});
    }

    return () => {
      clearTimeout(medicineMessageTimerID);
    }
  }, [showMedicineInputs, dispatch]);

  useEffect(() => {
    if(!medicineFormStateLength) {
      setShowMedicineInputs(false);
    }
  }, [medicineFormStateLength]);

  return (
    <>
    {medicineMessage && 
    <BottomRightCard>
      <h3 style={{fontSize: '1.5rem', color: 'white', width: 'max-content'}}>{medicineMessage}</h3>
    </BottomRightCard>}
    <div className='layout'>
    <div className="layout-wrapper">
      <div className="layout-main">
        {showMedicines && <h1 className="layout-heading">All Medicines</h1>}
        {showMedicines && <MedicineTable setShowMedicines={setShowMedicines} medicineMessageHandler={medicineMessageHandler} 
          comp='medicine-list' />}
        <div className='layout-add-wrapper'>
          {!showMedicineInputs && 
          <button onClick={() => {
              if(totalMedicinesInputVal !== '') {
                dispatch({type: 'ADD_MEDICINE', amount: parseInt(totalMedicinesInputVal)});
                setShowMedicineInputs(true);
                setTotalMedicines(parseInt(totalMedicinesInputVal));
              }
            }} className="layout-btn">
            Add Medicines
          </button>}
          {showMedicineInputs && 
          <button onClick={() => {
            if(totalMedicinesInputVal !== '') {
              dispatch({type: 'ADD_MEDICINE', amount: parseInt(totalMedicinesInputVal)});
              setTotalMedicines((currentVal) => parseInt(totalMedicinesInputVal) + currentVal);
            }
          }} className='layout-btn'>Add more</button>}
          <input value={totalMedicinesInputVal} onChange={(event) => {
              setTotalMedicinesInputVal(event.target.value);
            }} className='layout-amount' type="number" /> 
        </div>

        {showMedicineInputs && 
          <div className='layout-table-wrapper'>
            <table className='layout-table'>
              <tbody className='layout-tablebody'>
                <tr className='layout-tableheading'>
                  <th className="layout-tableheader">Name</th>
                  <th className="layout-tableheader">Category</th>
                  <th className="layout-tableheader">MRP</th>
                  <th className="layout-tableheader">Cost Price</th>
                  <th className="layout-tableheader">Default discount</th>
                  <th className="layout-tableheader">Exp. Date</th>
                  <th className="layout-tableheader">Stock</th>
                  <th className="layout-tableheader">Save</th>
                  <th className="layout-tableheader">Delete</th>
                </tr>
              {medicineFormState.length > 0 && medicineFormState.map((medicineInput, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr key={index}>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: e.target.value, property: 'name', index
                          }})} 
                        value={medicineInput.name} className='layout-input' type="text" placeholder="Name" /></td>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: e.target.value, property: 'category', index
                          }})}  
                        value={medicineInput.category} className='layout-input' type="text" placeholder="Category" /></td>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) ? parseInt(e.target.value) : '', property: 'MRP', index
                          }})}  
                        value={medicineInput.MRP} className='layout-input' type="number" placeholder="MRP" /></td>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) ? parseInt(e.target.value) : '', property: 'costPrice', index
                          }})}  
                        value={medicineInput.costPrice} className='layout-input' type="number" placeholder="Cost Price" /></td>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) ? parseInt(e.target.value) : '', property: 'discount', index
                          }})}  
                        value={medicineInput.visitDate} className='layout-input' type="number" placeholder="Discount" /></td>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: e.target.value, property: 'expDate', index
                          }})}  
                        value={medicineInput.medPrescribed} className='layout-input' type="date" placeholder="Exp. Date" /></td>
                      <td><input onChange={(e) => dispatch({
                          type: 'UPDATE_MEDICINE',
                          payload: {
                            value: parseInt(e.target.value) ? parseInt(e.target.value) : '', property: 'stock', index
                          }})}  
                        value={medicineInput.medPrescribed} className='layout-input' type="number" placeholder="Stock" /></td>
                      <td>
                        <div onClick={() => {
                            dispatch(postMedicine(index, medicineMessageHandler));
                          }} style={{cursor: 'pointer'}} className='layout-save-icon-wrapper'>
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
                          </svg>
                        </div>
                      </td>
                      <td className='layout-tabledata'>
                        <div onClick={() => {
                          dispatch({
                            type: 'DELETE_MEDICINE', 
                            payload: index
                          })}} style={{cursor: 'pointer'}}>
                          <AiFillDelete />
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })}
              </tbody>
            </table>

            <div onClick={() => {setShowMedicineInputs(false)}} className='layout-close-wrapper'>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
            </div>
          </div>}    
      </div>
      </div>
    </div>
    </>
  )
}

export default Medicine
