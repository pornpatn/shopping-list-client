import { createSlice } from '@reduxjs/toolkit';
import { googleLogout } from '@react-oauth/google';

const DEBUG_NO_LOGIN = false;
const DUMMY_PROFILE = { name: "Dummy", picture: "https://picsum.photos/200" };

const initialState = {
    profile: DEBUG_NO_LOGIN ? DUMMY_PROFILE : null,
    token: DEBUG_NO_LOGIN ? "token" : null,
    ready: DEBUG_NO_LOGIN,
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
            if (!state.ready) {
                const sessionState = loadFromLocalStorage();
                if (sessionState) {
                    state.profile = sessionState.profile;
                    state.token = sessionState.token;
                }
                state.ready = true;
            }
        },
        login: (state, action) => {
            saveToLocalStorage(action.payload);  
            state.profile = action.payload.profile;
            state.token = action.payload.token;
            state.ready = true;
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
export const selectIsReady = (state) => (state.session.ready);

export default sessionSlice.reducer;

