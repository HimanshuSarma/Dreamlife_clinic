import React, {useState} from 'react';
import Navbar from './Components/Navbar';
import './css/main.css';
import {Routes , Route} from "react-router-dom"
import Home from './Pages/Home';
import Stats from './Pages/Stats';
import Sales from './Pages/Sales';
import Medicine from './Pages/Medicine';
import Patients from './Pages/Patients';
import AddMedicine from './Pages/AddMedicine';
import AddPatient from './Pages/AddPatient';
import EditMedicine from './Pages/EditMedicine';
import EditPatient from './Pages/EditPatient';
import UserLogin from './Pages/UserLogin';
import SearchComponent from './Components/SearchComponent';
import SearchResults from './Components/SearchResults';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {checkLogin} from './Redux/ActionCreators/userActions';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  return (
    <div>
      <Navbar /> 
      <SearchComponent />
      <SearchResults />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/medicine" element={<Medicine />} />
        <Route path='/patients' element={<Patients />} />
        <Route path="/addmedicine" element={<AddMedicine />} />
        <Route path="/addpatient" element={<AddPatient />} />
        <Route path='/edit/medicine/:_id' element={<EditMedicine />} />
        <Route path='/edit/patient/:_id' element={<EditPatient />} />
        <Route path='/login' element={<UserLogin />} />
      </Routes>
    </div>
  )
}

export default App

