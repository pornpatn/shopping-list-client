import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

export const NEW_MARKET_TEMPLATE = {
    name: 'New Market',
    content: '',
};

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

export const fetchMarketList = createAsyncThunk('market/fetchMarketList', async () => {
    const response = await ChecklistAPI.fetchMarkets();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const createMarket = createAsyncThunk('market/createMarket', async ({ data }) => {
    const response = await ChecklistAPI.createMarket(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const updateMarket = createAsyncThunk('market/updateMarket', async ({ data }) => {
    const response = await ChecklistAPI.updateMarket(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const deleteMarket = createAsyncThunk('market/deleteMarket', async ({ id }) => {
    await ChecklistAPI.deleteMarket(id);
    return id;
});

export const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarketList.fulfilled, (state, action) => {
                state.entities = action.payload;
            })
            .addCase(createMarket.fulfilled, (state, action) => {
                state.entities.push(action.payload);
            })
            .addCase(updateMarket.fulfilled, (state, action) => {
                state.entities = state.entities.map(entity => entity._id === action.payload._id ? action.payload : entity);
            })
            .addCase(deleteMarket.fulfilled, (state, action) => {
                state.entities = state.entities.filter(entity => entity._id !== action.payload);
            });
    }
});

export const selectMarkets = (state) => state.market.entities;

export default marketSlice.reducer;
