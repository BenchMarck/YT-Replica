import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '../components/Loader';

const AuthRoute = (props) => {
    const { children } = props;
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoading(false);
                console.log('authenticated');
            } else {
                console.error('unauthorized');
                setLoading(false);
                navigate('/signup')
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);
    
    return loading ? <Loader /> : <div> { children } </div>;
}

export default AuthRoute