import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Body from "./routes/Body";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import DetectDisease from "./routes/DetectDisease";
import Consultancy from "./routes/Consultancy";
import Profile from "./routes/Profile";
import About from "./routes/About";
import Login from "./routes/LogIn";
import { Provider } from "react-redux";
import store from "./redux/store/store";
const App = () => {
  return (
    <Provider store={store}>
      <div className="h-[100vh] w-full">
        <Header />
        <Outlet />
      </div>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/disease",
        element: <DetectDisease />,
      },
      {
        path: "/consultancy",
        element: <Consultancy />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<RouterProvider router={appRouter} />);
