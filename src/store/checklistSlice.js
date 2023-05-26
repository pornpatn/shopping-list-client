import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

export const NEW_CHECKLIST_TEMPLATE = {
    name: 'New Checklist',
    items: [],
    status: 'in-progress',
    content: '',
};

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

export const fetchChecklistList = createAsyncThunk('checklist/fetchChecklistList', async () => {
    const response = await ChecklistAPI.fetchChecklists();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const fetchChecklistById = createAsyncThunk('checklist/fetchChecklistById', async ({ id }) => {
    const response = await ChecklistAPI.fetchChecklistById(id);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const createChecklist = createAsyncThunk('checklist/createChecklist', async ({ data }) => {
    const response = await ChecklistAPI.createChecklist(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const updateChecklist = createAsyncThunk('checklist/updateChecklist', async ({ data }) => {
    const response = await ChecklistAPI.updateChecklist(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const deleteChecklist = createAsyncThunk('checklist/deleteChecklist', async ({ id }) => {
    await ChecklistAPI.deleteChecklist(id);
    return id;
});

export const checklistSlice = createSlice({
    name: 'checklist',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChecklistList.fulfilled, (state, action) => {
                state.entities = action.payload;
            })
            .addCase(fetchChecklistById.fulfilled, (state, action) => {
                const id = action.payload._id;
                state.entities = [
                    action.payload,
                    ...state.entities.filter(entity => entity._id !== id)
                ];
            })
            .addCase(createChecklist.fulfilled, (state, action) => {
                const id = action.payload._id;
                state.entities = [
                    action.payload,
                    ...state.entities.filter(entity => entity._id !== id)
                ];
            })
            .addCase(updateChecklist.fulfilled, (state, action) => {
                const id = action.payload._id;
                state.entities = [
                    action.payload,
                    ...state.entities.filter(entity => entity._id !== id)
                ];
            })
            .addCase(deleteChecklist.fulfilled, (state, action) => {
                state.entities = state.entities.filter(entity => entity._id !== action.payload);
            });
    }
});

export const selectChecklists = (state) => state.checklist.entities;

export default checklistSlice.reducer;
