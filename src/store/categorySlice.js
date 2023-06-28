import _ from 'lodash';
import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

export const NEW_CATEGORY_TEMPLATE = {
    name: 'New Category',
    order: 1,
    content: '',
};

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

const sortEntities = (entities) => _.sortBy(entities, ['order', 'name']);

export const fetchCategoryList = createAsyncThunk('category/fetchCategoryList', async () => {
    const response = await ChecklistAPI.fetchCategories();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const createCategory = createAsyncThunk('category/createCategory', async ({ data }) => {
    const response = await ChecklistAPI.createCategory(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const updateCategory = createAsyncThunk('category/updateCategory', async ({ data }) => {
    const response = await ChecklistAPI.updateCategory(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const deleteCategory = createAsyncThunk('category/deleteCategory', async ({ id }) => {
    await ChecklistAPI.deleteCategory(id);
    return id;
});

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryList.fulfilled, (state, action) => {
                state.entities = sortEntities(action.payload);
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.entities.push(action.payload);
                state.entities = sortEntities(state.entities);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.entities = state.entities.map(entity => entity._id === action.payload._id ? action.payload : entity);
                state.entities = sortEntities(state.entities);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.entities = state.entities.filter(entity => entity._id !== action.payload);
            });
    }
});

export const selectCategories = (state) => state.category.entities;

export default categorySlice.reducer;
