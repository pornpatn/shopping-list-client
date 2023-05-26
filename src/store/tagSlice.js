import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

export const fetchTagList = createAsyncThunk('tag/fetchTagList', async () => {
    const response = await ChecklistAPI.fetchTags();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTagList.fulfilled, (state, action) => {
                state.entities = action.payload;
            });
    }
});

export const selectTags = (state) => state.tag.entities;

export default tagSlice.reducer;
