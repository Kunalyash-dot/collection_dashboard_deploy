import React from 'react'
import API from '../services/api';
import { signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import {  useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function AccessDenied() {

    const dispatch = useDispatch();
          const navigate = useNavigate();
    const handleConfirmSignOut = async () => {
        try {
          const data = await API.post("/api/auth/signout");
          
    
          if (data.success === false) {
            dispatch(signOutUserFailure(data.message));
            console.log("error in logout");
            return;
          }
    
          dispatch(signOutUserSuccess());
          localStorage.removeItem("accessToken");
          console.log(data);
          console.log(" logout");
          navigate("/login");
        } catch (error) {
          dispatch(signOutUserFailure(error.message));
        }
      };
  return (
    <div>
        <h1>Access Denied!</h1>
        <div>
            <button onClick={handleConfirmSignOut}>Click me to relogin</button>
        </div>
    </div>
  )
}

export default AccessDenied
