import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../redux/slices/loadingSlice";

const useLoadingNavigate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateWithLoader = (path) => {
    dispatch(showLoader());
    setTimeout(() => {
      navigate(path);
      dispatch(hideLoader());
    }, 500); // Simulate delay (optional)
  };

  return navigateWithLoader;
};

export default useLoadingNavigate;
