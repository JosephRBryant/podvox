import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Splash from '../components/Splash';
import ShowList from '../components/ShowList';
import Browse from '../components/Browse';
import ShowPage from '../components/ShowPage';
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
        path: "shows",
        element: <ShowList />
      },
      {
        path: "browse",
        element: <Browse />,
      },
      {
        path: "/shows/:showId",
        element: <ShowPage />
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
