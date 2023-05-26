import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

export const fetchCategoryList = createAsyncThunk('category/fetchCategoryList', async () => {
    const response = await ChecklistAPI.fetchCategories();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryList.fulfilled, (state, action) => {
                state.entities = action.payload;
            });
    }
});

export const selectCategories = (state) => state.category.entities;

export default categorySlice.reducer;
