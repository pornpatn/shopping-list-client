import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { userContext } from '../../../hooks/userContext';

function LoginPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { profile, loginUser } = useContext(userContext);

    const handleLoginSuccess = (credentialResponse) => {
        loginUser(credentialResponse);
        navigate(state.to ?? "/");
    };

    const handleLoginFailure = () => {
        console.error('login failed');
    };

    if (profile) {
        navigate("/");
    }

    return (
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            useOneTap
            auto_select
        />
    );
}

export default LoginPage;
