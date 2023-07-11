const BASE_API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getToken = () => {
    try {
        const serialisedState = localStorage.getItem("sessionState");
        if (serialisedState === null) return undefined;
        return JSON.parse(serialisedState)?.token;
    } catch (e) {
        console.warn(e);
        return undefined;
    }
};

const doGet = async (api) => fetch(`${BASE_API}${api}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${getToken()}` },
});

const doPost = async (api, data = {}) => fetch(`${BASE_API}${api}`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
});

const doPatch = async (api, data = {}) => fetch(`${BASE_API}${api}/${data._id}`, {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
});

const doDelete = async (api, id) => fetch(`${BASE_API}${api}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` },
});

// Markets
export const fetchMarkets = async () => doGet('/market');

export const createMarket = async (data) => doPost('/market', data);

export const updateMarket = async (data) => doPatch('/market', data);

export const deleteMarket = async (id) => doDelete('/market', id);

// Products
export const fetchProducts = async () => doGet('/product?limit=1000');

export const createProduct = async (data) => doPost('/product', data);

export const updateProduct = async (data) => doPatch('/product', data);

export const deleteProduct = async (id) => doDelete('/product', id);

// Categories
export const fetchCategories = async () => doGet('/category');

export const createCategory = async (data) => doPost('/category', data);

export const updateCategory = async (data) => doPatch('/category', data);

export const deleteCategory = async (id) => doDelete('/category', id);

// Tags
export const fetchTags = async () => doGet('/tag');

// Checklist
export const fetchChecklists = async () => doGet('/checklist/active');

export const fetchChecklistById = async (id) => doGet(`/checklist/${id}`);

export const createChecklist = async (data) => doPost('/checklist', data);

export const updateChecklist = async (data) => doPatch('/checklist', data);

export const deleteChecklist = async (id) => doDelete('checklist', id);

// Order
export const fetchOrders = async () => doGet('/order');

export const fetchOrderById = async (id) => doGet(`/order/${id}`);

export const createOrder = async (data) => doPost('/order', data);

export const updateOrder = async (data) => doPatch('/order', data);

export const deleteOrder = async (id) => doDelete('order', id);

const ChecklistAPI = {
fetchMarkets, createMarket, updateMarket, deleteMarket,
    fetchProducts, createProduct, updateProduct, deleteProduct,
    fetchCategories, createCategory, updateCategory, deleteCategory,
    fetchTags, 
    fetchChecklists, fetchChecklistById, createChecklist, updateChecklist, deleteChecklist,
    fetchOrders, fetchOrderById, createOrder, updateOrder, deleteOrder,
};

export default ChecklistAPI;
