import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConfirmProvider } from "material-ui-confirm";
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {userContext} from '../../../hooks/userContext';
import Main from '../Main';

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Root({ store }) {
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState('');
    const [ready, setReady] = useState(false);

    const saveToLocalStorage = (state) => {
        try {
            localStorage.setItem("sessionState", JSON.stringify(state));
        } catch (err) {
            console.ward(err);
        }
    };
    
    const loadFromLocalStorage = () => {
        try {
            const serialisedState = localStorage.getItem("sessionState");
            if (serialisedState === null) return undefined;
            return JSON.parse(serialisedState);
        } catch (e) {
            console.warn(e);
            return undefined;
        }
    };

    const loginUser = ({ credential }) => {
        const userProfile = jwt_decode(credential);
        setProfile(userProfile);
        setToken(credential);
        saveToLocalStorage({ profile: userProfile, token: credential });
    };

    const logoutUser = () => {
        setProfile(null);
        setToken('');
        saveToLocalStorage(null);
    };

    useEffect(() => {
        const sessionState = loadFromLocalStorage();
        if (sessionState) {
            setProfile(sessionState.profile);
            setToken(sessionState.token);
        }
        setReady(true);
    }, []);

    if (!ready) {
        return (<div>Loading...</div>);
    }

    return (
        <Provider store={store}>
            <ConfirmProvider>
                <GoogleOAuthProvider clientId={client_id}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <userContext.Provider value={{ profile, token, ready, loginUser, logoutUser }}>
                            <Main />
                        </userContext.Provider>
                    </LocalizationProvider>
                </GoogleOAuthProvider>
            </ConfirmProvider>
        </Provider>
    );
};

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
