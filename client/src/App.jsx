import "ldrs/helix"
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
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store/store";
import DoctorInformation from "./routes/DoctorInformation";
import LoadingPage from "./routes/LoadingPage";
import Loader from "./components/Loader";
import CheckPatients from "./routes/CheckPatients";
import CheckAppointments from "./routes/CheckAppointments";
import { connectSocket, getSocket } from "./socket";
import Cookies from "js-cookie";
import { socketConnected } from "./redux/slices/socketSlice";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const location = useLocation();
  const dispatch=useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading); // Access global loading state
  const isSocketConnected=useSelector((state)=>state.socketio.isSocketConnected);

  useEffect(()=>{
    const token=Cookies.get("jwt-token");
    // console.log("refrresh occurecd",isSocketConnected);
    if(token && !isSocketConnected){
      connectSocket();
      const socket=getSocket();
      const decoded=jwtDecode(token);
      socket.emit("join",decoded.id);
      dispatch(socketConnected());
    }
  },[isSocketConnected,dispatch])
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
