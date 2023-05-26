import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from "react-router-dom";
import { useDispatch } from 'react-redux';
import Layout from '../Layout';
import LoginPage from '../../pages/LoginPage';
import ChecklistPage from '../../pages/ChecklistPage';
import ChecklistCheckingPage from '../../pages/ChecklistPage/ChecklistCheckingPage';
import ChecklistReviewPage from '../../pages/ChecklistPage/ChecklistReviewPage';
import SettingsPage from '../../pages/SettingsPage';
import ProductSettings from '../../pages/SettingsPage/ProductSettings';
import MarketSettings from '../../pages/SettingsPage/MarketSettings';
import { fetchCategoryList } from '../../../store/categorySlice';
import { fetchTagList } from '../../../store/tagSlice';
import { fetchProductList } from '../../../store/productSlice';
import { fetchMarketList } from '../../../store/marketSlice';
import { fetchChecklistList, fetchChecklistById } from '../../../store/checklistSlice';

const getRouter = (dispatch) => createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <div>Welcome</div>,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'checklists',
                element: <Outlet />,
                loader: () => {
                    dispatch(fetchCategoryList());
                    dispatch(fetchTagList());
                    dispatch(fetchProductList());
                    dispatch(fetchMarketList());
                    return null;
                },        
                children: [
                    {
                        index: true,
                        element: <ChecklistPage />,
                        loader: () => {
                            dispatch(fetchChecklistList({ filter: null }));
                            return null;
                        },
                    },
                    {
                        path: ':id',
                        element: <ChecklistCheckingPage />,
                        loader: ({ params }) => {
                            dispatch(fetchChecklistById(params));
                            return null;
                        },
                    },
                    {
                        path: ':id/review',
                        element: <ChecklistReviewPage />,
                        loader: ({ params }) => {
                            dispatch(fetchChecklistById(params));
                            return null;
                        },
                    },
                ],
            },
            {
                path: 'settings',
                element: <Outlet />,       
                children: [
                    {
                        index: true,
                        element: <SettingsPage />
                    },
                    {
                        path: 'products',
                        element: <ProductSettings />,
                        loader: () => {
                            dispatch(fetchProductList());
                            return null;
                        }
                    },
                    {
                        path: 'markets',
                        element: <MarketSettings />,
                        loader: () => {
                            dispatch(fetchMarketList());
                            return null;
                        }        
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    },
], {
    basename: '/checklist',
});

function Main() {
    const dispatch = useDispatch();

    return (
        <RouterProvider router={getRouter(dispatch)} />
    );
};

export default Main;
