import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import ChecklistAPI from '../api/checklistAPI';

export const NEW_ORDER_TEMPLATE = {
    name: 'New Order',
    status: 'in-progress',
    items: [],
    checklist: null,
    market: null,
    scheduleDeliveryDate: null,
    deliveryDate: null,
    content: '',
};

const initialState = {
    entities: [],
    status: 'idle',
    error: null,
};

export const fetchOrderList = createAsyncThunk('order/fetchOrderList', async ({ filter }) => {
    const response = await ChecklistAPI.fetchOrders();
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async ({ id }) => {
    const response = await ChecklistAPI.fetchOrderById(id);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const createOrder = createAsyncThunk('order/createOrder', async ({ data }) => {
    const response = await ChecklistAPI.createOrder(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const updateOrder = createAsyncThunk('order/updateOrder', async ({ data }) => {
    const response = await ChecklistAPI.updateOrder(data);
    const result = await response.json();
    if (!result.success) {
        return isRejectedWithValue(result);
    }
    return result.data;
});

export const deleteOrder = createAsyncThunk('order/deleteOrder', async ({ id }) => {
    await ChecklistAPI.deleteOrder(id);
    return id;
});

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderList.fulfilled, (state, action) => {
                state.entities = action.payload;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                const id = action.payload._id;
                state.entities = [
                    action.payload,
                    ...state.entities.filter(entity => entity._id !== id)
                ];
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                const id = action.payload._id;
                state.entities = [
                    action.payload,
                    ...state.entities.filter(entity => entity._id !== id)
                ];
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const id = action.payload._id;
                state.entities = [
                    action.payload,
                    ...state.entities.filter(entity => entity._id !== id)
                ];
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.entities = state.entities.filter(entity => entity._id !== action.payload);
            });
    }
});

export const selectOrders = (state) => state.order.entities;

export default orderSlice.reducer;
