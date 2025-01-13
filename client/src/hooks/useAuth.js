import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { userLoggedin, userLoggedout } from '../redux/slices/signInSlice';

const useAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get('jwt-token'); // Check for JWT token
        if (token) {
             dispatch(userLoggedin()); // Dispatch login action
        } else {
            dispatch(userLoggedout()); // Dispatch logout action
        }
    }, [dispatch]); // Dependency ensures this runs once when the component mounts
};

export default useAuth;
