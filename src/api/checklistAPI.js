const BASE_API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const doGet = async (api) => fetch(`${BASE_API}${api}`, {
    method: 'GET',
});

const doPost = async (api, data = {}) => fetch(`${BASE_API}${api}`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});

const doPatch = async (api, data = {}) => fetch(`${BASE_API}${api}/${data._id}`, {
    method: 'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});

const doDelete = async (api, id) => fetch(`${BASE_API}${api}/${id}`, {
    method: 'DELETE',
});

// Markets
export const fetchMarkets = async () => doGet('/market');

export const createMarket = async (data) => doPost('/market', data);

export const updateMarket = async (data) => doPatch('/market', data);

export const deleteMarket = async (id) => doDelete('/market', id);

// Products
export const fetchProducts = async () => doGet('/product?limit=100');

export const createProduct = async (data) => doPost('/product', data);

export const updateProduct = async (data) => doPatch('/product', data);

export const deleteProduct = async (id) => doDelete('/product', id);

// Categories
export const fetchCategories = async () => doGet('/category');

// Tags
export const fetchTags = async () => doGet('/tag');

// Checklist
export const fetchChecklists = async () => doGet('/checklist/active');

export const fetchChecklistById = async (id) => doGet(`/checklist/${id}`);

export const createChecklist = async (data) => doPost('/checklist', data);

export const updateChecklist = async (data) => doPatch('/checklist', data);

export const deleteChecklist = async (id) => doDelete('checklist', id);

const ChecklistAPI = {
fetchMarkets, createMarket, updateMarket, deleteMarket,
    fetchProducts, createProduct, updateProduct, deleteProduct,
    fetchCategories, 
    fetchTags, 
    fetchChecklists, fetchChecklistById, createChecklist, updateChecklist, deleteChecklist,
};

export default ChecklistAPI;
