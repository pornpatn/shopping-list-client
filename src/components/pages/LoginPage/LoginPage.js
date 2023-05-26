import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, selectIsLogin } from '../../../store/sessionSlice';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLogin = useSelector(selectIsLogin);

    const loginSuccess = ({ credential }) => {
        const profile = jwt_decode(credential);
        dispatch(login({ profile, token: credential }));
    };

    const loginFailure = (err) => {
        console.error('failed:', err);
    };

    useEffect(() => {
        if (isLogin) {
            navigate("/");
        }
    }, [isLogin, navigate]);

    return (
        <GoogleLogin
            onSuccess={loginSuccess}
            onFailure={loginFailure}
            useOneTap
            auto_select
        />
    );
}

export default LoginPage;
