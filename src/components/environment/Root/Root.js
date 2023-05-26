import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConfirmProvider } from "material-ui-confirm";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Main from '../Main';

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Root({ store }) {
    return (
        <Provider store={store}>
            <ConfirmProvider>
                <GoogleOAuthProvider clientId={client_id}>
                    <Main />
                </GoogleOAuthProvider>
            </ConfirmProvider>
        </Provider>
    );
};

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
