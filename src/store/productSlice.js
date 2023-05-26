import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

export const NEW_PRODUCT_TEMPLATE = {
    name: 'New Product',
    category: null,
    tags: [],
    content: '',
};

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

export const fetchProductList = createAsyncThunk('product/fetchProductList', async () => {
    const response = await ChecklistAPI.fetchProducts();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const createProduct = createAsyncThunk('product/createProduct', async ({ data }) => {
    const response = await ChecklistAPI.createProduct(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const updateProduct = createAsyncThunk('product/updateProduct', async ({ data }) => {
    const response = await ChecklistAPI.updateProduct(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const deleteProduct = createAsyncThunk('product/deleteProduct', async ({ id }) => {
    await ChecklistAPI.deleteProduct(id);
    return id;
});

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductList.fulfilled, (state, action) => {
                state.entities = action.payload;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.entities.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.entities = state.entities.map(entity => entity._id === action.payload._id ? action.payload : entity);
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.entities = state.entities.filter(entity => entity._id !== action.payload);
            });
    }
});

export const selectProducts = (state) => state.product.entities;

export default productSlice.reducer;
