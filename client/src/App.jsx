// when user manually tries to book app, check the cities of both doc and patient and give warning if diffeerent
// add a appointments page in the patient panel which will show all the appointments of the patient, (confirmed, past and pending) 
// when patient cliccks on a confirmed appoint, it will redirect him to the doctor information page where instead of the book app button, it will 
// display a chat button option


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
import CheckPatients from "./routes/CheckPatients";
import CheckAppointments from "./routes/CheckAppointments";
const App = () => {
  const location = useLocation();
  const isLoading = useSelector((state) => state.loading.isLoading); // Access global loading state
  return (
      <div className="h-[100vh] w-full">
        {isLoading && <Loader />} {/* Show loader if isLoading is true */}
        {location.pathname !== "/" && <Header />}
        {/*Dont Show header on loading page */}
        <Outlet />
      </div>
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
      {
        path: "/check-patients",
        element: <CheckPatients />,
      },
      {
        path: "/check-appointments",
        element: <CheckAppointments />,
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
