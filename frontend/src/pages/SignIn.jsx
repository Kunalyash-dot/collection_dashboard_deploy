import {useState} from 'react'
import {  useNavigate } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';

function SignIn() {
   const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const {error} =useSelector((state)=>state.user);
    // console.log(loading);
    // console.log(error)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleChange =(e)=>{
        setFormData({
          ...formData,
          [e.target.id]:e.target.value,
        });
      };
// console.log(formData)
// console.log(currentUser);
      const handleSubmit =async(e)=>{
        e.preventDefault();
        try {
          dispatch(signInStart());
          const response = await API.post('/api/auth/signin', { mobile, password });
          // console.log(res);
          const { token, user } = response.data;
          // console.log(data);
          if (data.success === false) {
            dispatch(signInFailure(data.message));
            return;
          }
          dispatch(signInSuccess(data));
          // console.log(currentUser)
          navigate('/');
    
        } catch (error) {
          signInFailure(error.message);
        }
      }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="number" placeholder='Mobile Number' className='border p-3 rounded-lg' onChange={(e) => setMobile(e.target.value)} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={(e) => setPassword(e.target.value)} />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >Sign In</button>
        </form>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn
