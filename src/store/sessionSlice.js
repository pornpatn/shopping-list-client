import { createSlice } from '@reduxjs/toolkit';
import { googleLogout } from '@react-oauth/google';

const initialState = {
    profile: null,
    token: null,
};

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

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        init: (state) => {
            if (state.profile === null) {
                const sessionState = loadFromLocalStorage();
                if (sessionState) {
                    state.profile = sessionState.profile;
                    state.token = sessionState.token;
                }
            }
        },
        login: (state, action) => {
            saveToLocalStorage(action.payload);  
            state.profile = action.payload.profile;
            state.token = action.payload.token;
        },
        logout: (state) => {
            googleLogout();
            saveToLocalStorage(null);
            state.profile = null;
            state.token = null;
        },
    },
});

export const { init, login, logout } = sessionSlice.actions;
export const selectProfile = (state) => state.session.profile;
export const selectIsLogin = (state) => (state.session.profile !== null);
export const selectToken = (state) => state.session.token;

export default sessionSlice.reducer;

