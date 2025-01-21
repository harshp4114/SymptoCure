import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Body from "./routes/Body";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import DetectDisease from "./routes/DetectDisease";
import Consultancy from "./routes/Consultancy";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store/store";
import DoctorInformation from "./routes/DoctorInformation";
import LoadingPage from "./routes/LoadingPage";
import Loader from "./components/Loader";
const App = () => {
  const location = useLocation();
  const isLoading = useSelector((state) => state.loading.isLoading); // Access global loading state
  return (
    <Provider store={store}>
      <div className="h-[100vh] w-full">
        {isLoading && <Loader />} 
        {location.pathname !== "/" && <Header /> }
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
        path: "/home",
        element: <Body />,
      },
      {
        path: "/disease-detection",
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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/doctorInformation",
        element: <DoctorInformation />,
      },
      {
        path: "/",
        element: <LoadingPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);
