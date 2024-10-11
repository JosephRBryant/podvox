import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Splash from '../components/Splash';
import Browse from '../components/Browse';
import Showpage from '../components/ShowPage';
import LivePage from '../components/LivePage/LivePage';
import ManageAccount from '../components/ManageAccount';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Splash />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "browse",
        element: <Browse />,
      },
      {
        path: "/shows/:showId",
        element: <Showpage />
      },
      {
        path: "/shows/:showId/live",
        element: <LivePage />
      },
      {
        path: "/account",
        element: <ManageAccount />
      }
    ],
  },

]);
