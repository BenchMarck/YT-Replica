import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { createUserDocument } from '../utils/userHelper';

const Login = () => {
    // Initialize Firebase authentication and navigation
    const navigate = useNavigate();
    
    // State variables for managing authentication state, email, password, and error messages
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) navigate("/");
  });
  return () => unsubscribe();
}, [navigate]);

        // Function to handle sign-in with Google
    const signInWithGoogle = async () => {
        setError('');
        try{
            setIsAuthenticating(true);
            // Use Firebase to sign in with Google
            const result =  await signInWithPopup(auth, googleProvider);
            await createUserDocument(result.user); // Ensure user document (record) exists in Firestore
            navigate('/');
        } catch(error) {
            setError(error.message);
        } finally {
            setIsAuthenticating(false);
        }
    };
    
    // Function to handle sign-in with email and password
    const signInWithEmail = async () => {
        setError('');
        try {
            setIsAuthenticating(true);
            // Use Firebase to sign in with email and password
            const response = await signInWithEmailAndPassword(auth, email, password);
            await createUserDocument(response.user); // Ensure user document (record) exists in Firestore
            navigate('/');
        } catch(err) {
            setError(err.message);
        } finally {
            setIsAuthenticating(false);
        }
    };

return (
  <div className='w-full h-auto md:h-screen flex flex-col md:flex-row'>

    {/* Right half of the screen - login form */}
    <div className='w-full md:w-1/2 h-full bg-[#1a1a1a] flex flex-col p-6 sm:p-10 md:p-20 justify-center'>
      <div className='w-full flex flex-col max-w-[450px] sm:max-w-[420px] md:max-w-[450px] mx-auto
        bg-[#1a1a1a] rounded-lg p-10 shadow-md
        border border-[#7d7d7d] hover:shadow-[0_0_25px_5px_rgba(56,140,248,1)] transition duration-500
        ease-out'
      >

        {/* Header */}
        <div className='w-full flex flex-col mb-10 text-white'>
          <h3 className='text-3xl sm:text-4xl font-bold mb-2'>Login</h3>
          <p className='text-base sm:text-lg mb-4'>
            Welcome Back! Please enter your details.
          </p>
        </div>

        {/* Input fields */}
        <div className='w-full flex flex-col mb-6'>
          <input
            type='email'
            placeholder='Email'
            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500
            focus:outline-none focus:border-cyan-400 text-sm sm:text-base'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className='relative'>
            <input
              type={passwordVisible ? 'text' : 'password'} 
              id='password'
              name='password'
              placeholder='Password'
              className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 
              focus:outline-none focus:border-cyan-400 text-sm sm:text-base'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type='button'
              onClick={() => setPasswordVisible(!passwordVisible)}
              className='absolute right-2 top-3 text-gray-400 hover:text-cyan-400 focus:outline-none'
            >
              {passwordVisible ? (
                <AiOutlineEyeInvisible className='h-5 w-5' />
              ) : (
                <AiOutlineEye className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <div className='w-full flex flex-col mb-4'>
          <button
            className='w-full bg-linear-to-r from-cyan-500 to-blue-500
              border border-white text-white my-2 py-2 font-semibold rounded-md text-center
              flex items-center justify-center cursor-pointer
              hover:bg-linear-to-l hover:from-cyan-600 hover:to-blue-600
              focus:ring focus:ring-cyan-300 focus:outline-none shadow-md hover:shadow-lg
              text-sm sm:text-base md:text-lg'
            onClick={signInWithEmail}
            disabled={isAuthenticating}
          >
            Login
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className='text-red-500 mb-4 text-sm sm:text-base'>
            {error}
          </div>
        )}

        {/* Divider */}
        <div className='w-full flex items-center justify-center relative py-4'>
          <div className='w-full h-px bg-gray-500'></div>
          <p className='text-sm sm:text-lg absolute text-gray-500 bg-[#1a1a1a] px-6'>
            OR
          </p>
        </div>

        {/* Google Button */}
        <button
          className='w-full bg-white text-black font-semibold rounded-md p-3 text-center
            flex items-center justify-center cursor-pointer mt-7
            text-sm sm:text-base md:text-lg'
          onClick={signInWithGoogle}
          disabled={isAuthenticating}
        >
          <FcGoogle className='h-6 w-6 mr-3' />
          Continue With Google
        </button>

        {/* Signup Link */}
        <div className='w-full flex items-center justify-center mt-10'>
          <p className='text-xs sm:text-sm font-normal text-gray-400'>
            Don't have an account?
            <span className='font-semibold text-white cursor-pointer'>
              <Link to='/signup' className='text-cyan-400 hover:underline text-xs sm:text-sm'>
                {' '} Sign Up
              </Link>
            </span>
          </p>
        </div>

      </div>
    </div>

    <div className='md:w-1/2 h-auto md:h-full flex flex-col bg-[#282c34] items-center justify-center'>
      <Link to="/">
        <img src='/homelogo.png' alt="logo" width={45} height={45} />
      </Link>
    </div>

  </div>
);
}

export default Login;