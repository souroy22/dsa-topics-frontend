import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";

const PrivateRoute = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.userReducer);

  if (user) {
    return (
      <BaseLayout>
        <Outlet />
      </BaseLayout>
    );
  }
  const prevUrl = encodeURIComponent(location.pathname + location.search);
  return (
    <Navigate
      to={`/signin?prevUrl=${prevUrl}`}
      state={{ prevUrl: location.pathname }}
    />
  );
};

export default PrivateRoute;
