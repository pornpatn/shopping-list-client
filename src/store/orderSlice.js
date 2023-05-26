import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

let nextId = 4;
const fakeOrders = [
    {
        id: '1',
        name: 'Thai Market',
        items: [
            {
                product: { id: '1', name: 'Chicken' },
                qty: 5,
                checked: true
            },
            {
                product: { id: '2', name: 'Beef' },
                qty: 2,
                checked: false
            },
        ],
        checklist: { id: 1 },
        status: 'in-progress',
        description: 'Order note',
        created: '2023-05-04T18:31:07.890Z',
        modified: '2023-05-04T18:31:07.890Z',
    },
    {
        id: '2',
        name: 'Wonder Market',
        items: [
            {
                product: { id: '1', name: 'Chicken' },
                qty: 8,
                checked: true
            },
            {
                product: { id: '2', name: 'Beef' },
                qty: 4,
                checked: false
            },
        ],
        filters: [],
        status: 'in-progress',
        description: 'Dummy order',
        created: '2023-05-04T18:31:07.890Z',
        modified: '2023-05-04T18:31:07.890Z',
    },
    {
        id: '3',
        name: 'Wonder Market',
        items: [
            {
                id: '2',
                product: { id: '2', name: 'Beef' },
                qty: 0,
                checked: true
            },
            {
                id: '1',
                product: { id: '1', name: 'Chicken' },
                qty: 10,
                checked: true
            },
        ],
        filters: [],
        status: 'in-progress',
        description: 'Dummy order',
        created: '2023-05-04T18:31:07.890Z',
        modified: '2023-05-04T18:31:07.890Z',
    },
];

export const NEW_ORDER_TEMPLATE = {
    name: 'New Order',
    items: [],
    filters: [],
    status: 'in-progress',
    created: null,
    modified: null,
};

const initialState = {
    entities: [],
    currentOrderId: 0,
    currentOrder: null,
    status: 'idle',
    error: null,
};

export const fetchOrderList = createAsyncThunk('order/fetchOrderList', async ({ filter }) => {
    // const response = await client.get('/fakeApi/posts')
    // return response.data
    console.log('fetch order filter: ', filter);
    return fakeOrders;
});

export const fetchOrderById = createAsyncThunk('order/fetchOrderById', async ({ orderId }) => {
    // const response = await client.get('/fakeApi/posts')
    // return response.data
    return fakeOrders.find(order => order.id === orderId) || ({ ...NEW_ORDER_TEMPLATE, id: orderId });
});

export const createOrder = createAsyncThunk('order/createOrder', async ({ data }) => {
    // const response = await client.post('/fakeApi/posts', initialPost);
    // return response.data;

    console.log('create order');

    return ({ ...data, id: '' + nextId++ });
});

export const updateOrder = createAsyncThunk('order/updateOrder', async ({ data }) => {
    return data;
});

export const deleteOrder = createAsyncThunk('order/deleteOrder', async ({ id }) => {
    return id;
});

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderList.fulfilled, (state, action) => {
                console.log('orders fullfilled: ', action.payload);
                state.entities = action.payload;

                if (state.currentOrder === null) {
                    state.currentOrder = action.payload[0];
                    state.currentOrderId = action.payload[0].id;
                }
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                console.log('order by id fullfilled: ', action.payload);
                state.currentOrder = action.payload;
                state.currentOrderId = action.payload?.id;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                console.log('create order fulfilled');
                state.entities.push(action.payload);
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.entities = state.entities.map(entity => entity.id === action.payload.id ? action.payload : entity);
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.entities = state.entities.filter(entity => entity.id !== action.payload);
            });
    }
});

export const selectOrders = (state) => state.order.entities;

export default orderSlice.reducer;
