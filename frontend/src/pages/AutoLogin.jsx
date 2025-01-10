import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

function AutoLogin() {
    const { mobile } = useParams(); // Extract mobile number from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(mobile)
  useEffect(() => {
    const login = async () => {
      try {
        const response = await API.post('/api/auth/signin', { mobile });
        const { accessToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);

        dispatch(signInSuccess(user));

        // Navigate based on user role
        switch (user.role) {
          case 'Admin':
            navigate('/');
            break;
          case 'StateHead':
            navigate('/statehead/dashboard');
            break;
          case 'Manager':
            navigate(`/manager/${user._id}/dashboard`);
            break;
          case 'Employee':
            navigate(`/employee/${user._id}/dashboard`);
            break;
          default:
            navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Login failed:', error);
        // You can display an error message or redirect to an error page
      }
    };

    login();
  }, [mobile, navigate, dispatch]);
  return (
    <div>   
      <div>Loading...</div>
    </div>
  )
}

export default AutoLogin
