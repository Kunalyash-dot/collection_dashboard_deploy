import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';


const LoginPage = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {error} =useSelector((state)=>state.user);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/auth/signin', { mobile, password });
      const { accessToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
    //   console.log("Logged in successfully:", response);
    console.log(user)
      
    dispatch(signInSuccess(user));
       // Navigate to appropriate dashboard based on role
       switch (user.role) {
        case "Admin":
          navigate("/");
          break;
        case "StateHead":
          navigate("/statehead/dashboard");
          break;
        case "Manager":
          navigate(`/manager/${user._id}/dashboard`);
          break;
        case "Employee":
          navigate(`/employee/${user._id}/dashboard`);
          break;
        default:
          navigate("/unauthorized");
      
       }
    } catch (error) {
      // console.log(error.response.data.message);
      console.log(error)
      // dispatch(signInFailure(error.response.data.message));

      // alert(error.response.data.message || 'Login failed');
    }
  };

  return (
    <div className='w-full  bg-slate-200 h-screen flex'>
    <div className='flex flex-col  lg:w-[500px]  w-full   lg:m-auto pt-36 lg:pt-0 '>
       <h1 className='text-3xl text-center font-semibold my-7'>Log-In</h1>
    <form onSubmit={handleLogin} className='flex flex-col gap-4 w-full p-6'>
      <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} className='border p-3 rounded-lg' />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='border p-3 rounded-lg' />
      <button type="submit" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Login</button>
    </form>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </div>
  );
};

export default LoginPage;