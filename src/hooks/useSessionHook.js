import { useDispatch, useSelector } from 'react-redux';
import {
    selectProfile,
    selectToken,
    selectIsReady,
    init,
} from '../store/sessionSlice';

function useSessionHook() {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const token = useSelector(selectToken);
    const isLogin = profile !== null;
    const isReady = useSelector(selectIsReady);

    if (!isLogin) {
        dispatch(init());
    }

    return {
        isLogin,
        isReady,
        profile,
        token,
    };
}

export default useSessionHook;
