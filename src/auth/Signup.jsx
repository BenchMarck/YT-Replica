import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { createUserDocument } from '../utils/userHelper';

const Signup = () => {
    // Initialize Firebase authentication and navigation
    const navigate = useNavigate();
    
    // State variables for managing authentication state, email, password, confirm password, and error messages
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) navigate("/");
  });
  return () => unsubscribe();
}, [navigate]);

    // Function to handle sign-up with Google
    const signUpWithGoogle = async () => {
        setIsAuthenticating(true);
        
        // Use Firebase to sign up with Google
        signInWithPopup(auth, googleProvider)
            .then(async (response) => {
                const user = response.user;
                await createUserDocument(user);
                navigate('/');
            })
            .catch(() => {
                setIsAuthenticating(false);
            });
    };

    // Function to handle sign-up with email and password
    const signUpWithEmail = async () => {
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsAuthenticating(true);
        setError('');

        // Use Firebase to create a new user with email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                const user = response.user;
                await createUserDocument(user);
                navigate('/');
                //await signOut(auth); // force logout after registration
                //navigate('/login');
            })
            .catch(error => {
                setError(error.message);
                setIsAuthenticating(false);
            });
    };

    return (
        <div className='w-full h-auto md:h-screen flex flex-col md:flex-row'>
            {/* Left half of the screen - background styling */}
            <div className='md:w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center'>
                <Link to="/" > <img src='/homelogo.png' alt="logo" width={45} height={45} /> </Link>
            </div>

            {/* Right half of the screen - signup form */}
            <div className='w-full md:w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto
                bg-[#1a1a1a] rounded-lg p-10 shadow-md
                 border-gray-700 hover:shadow-[0_0_25px_5px_rgba(56,140,248,1)] transition duration-500
                ease-out'
                >
                    {/* Header section with title and welcome message */}
                    <div className='w-full flex flex-col mb-10 text-white'>
                        <h3 className='text-4xl font-bold mb-2'>Sign Up</h3>
                        <p className='text-lg mb-4'>Welcome! Please enter your information.</p>
                    </div>

                    {/* Input fields for email, password, and confirm password */}
                    <div className='w-full flex flex-col mb-6'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Re-Enter Password'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* Display error message if there is one */}
                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    {/* Button to sign up with email and password */}
                    <div className='w-full flex flex-col mb-4'>
                        <button
                            onClick={signUpWithEmail}
                            disabled={isAuthenticating}
                            className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4
                            text-center flex items-center justify-center cursor-pointer
                            hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600
                            focus:ring focus:ring-white focus:outline-none shadow-md hover:shadow-lg'
                            >
                            Sign Up With Email and Password
                        </button>
                    </div>

                    {/* Divider with 'OR' text */}
                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-lg absolute text-gray-500 bg-[#1a1a1a] px-2'>OR</p>
                    </div>

                    {/* Button to sign up with Google */}
                    <button
                        onClick={signUpWithGoogle}
                        disabled={isAuthenticating}
                        className='w-full bg-gray-700 text-white font-semibold rounded-md shadow-md py-3
                        border border-gray-600
                        text-center flex items-center justify-center cursor-pointer mt-7
                        hover:bg-gray-600 hover:shadow-lg
                        focus:ring focus:ring-white focus:outline-none'
                        >
                        <FcGoogle className='h-6 w-6 mr-3' />
                        Sign In With Google
                    </button>

                    {/* Link to login page */}
                    <div className='w-full flex items-center justify-center mt-10'>
                        <p className='text-sm font-normal text-gray-400'>Already have an account?
                            <span className='font-semibold text-white cursor-pointer underline'>
                                <Link to='/login' className='text-white'>Log In</Link>
                                {/* <a href='/login' className='text-white'>Log In</a> */}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;