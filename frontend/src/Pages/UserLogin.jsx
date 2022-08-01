import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import {userLogin} from '../Redux/ActionCreators/userActions';

import Backdrop from '../Components/UIElements/Backdrop';
import LoadingSpinner from '../Components/UIElements/LoadingSpinner';

const UserLogin = () => {

    const [formState, setFormState] = useState({email: '', password: ''});

    const {isLoggedInState, loginStateLoading} = useSelector(store => store.userState);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginFormSubmitHandler = (event) => {
        event.preventDefault();
        dispatch(userLogin(formState));
    }

    useEffect(() => {
        if(isLoggedInState) {
            navigate('/');
        }
    }, [isLoggedInState, navigate]);

    return (
        <>
        {loginStateLoading && 
        <Backdrop>
            <LoadingSpinner></LoadingSpinner>
        </Backdrop>}
        <div className='login'>
            <div className="login-wrapper">
              <h1 className="login-header">Please login to continue</h1>
              <form onSubmit={loginFormSubmitHandler} className="login-form">
                  <input onChange={event => setFormState(formState => 
                    { return {...formState, email: event.target.value}})} type="email" className="login-input" placeholder='Enter Email' name="email" />
                  <input onChange={(event) => setFormState(formState => 
                    { return {...formState, password: event.target.value} })} type="password" className="login-input" placeholder='Enter Password' name="password" />
                  <button className="login-btn" type="submit">
                     Login
                 </button>
             </form>
           </div>
        </div>
        </>
    )
}

export default UserLogin



