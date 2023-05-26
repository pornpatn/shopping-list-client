import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile, selectToken, init } from '../store/sessionSlice';

function useSessionHook() {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const token = useSelector(selectToken);
    const isLogin = profile !== null;

    useEffect(() => {
        if (!isLogin) {
            dispatch(init());
        }
    }, [dispatch, isLogin]);

    return {
        isLogin,
        profile,
        token,
    };
}

export default useSessionHook;
