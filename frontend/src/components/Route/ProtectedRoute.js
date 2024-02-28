// ProtectedRoute.js
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ path, element: Component, ...rest }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {

        const storedAuthStatus = localStorage.getItem('isAuthenticated');
        const initialAuthStatus = storedAuthStatus === 'true'

        if (initialAuthStatus === false) {
            navigate('/login');
        }
    }, [loading, navigate]);

    return isAuthenticated ? <Component {...rest} /> : null;
};

export default ProtectedRoute;
