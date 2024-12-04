import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import Register from './pages/Public/Register/Register';
import MainClient from "./clientPages/Main/MainClient";
import Home from "./clientPages/Main/Movie/Home/Home";
import View from "./clientPages/Main/Movie/View/View";
import MovieContextProvider from "./context/MovieContext";
import Users from './pages/Main/Users/Users';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainClient />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/view/:movieId?",
        element: <View />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      // Temporarily disabled the dashboard route
      {
        path: '/main/users',
        element: <Users />,
      },
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Form />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
    </div>
  );
}

export default App;
