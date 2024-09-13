import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import FallBack from "../components/FallBack";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import QuestionsList from "../pages/QuestionsList";

const HomePage = lazy(() => import("../pages/Home"));

const RouterComponent = () => {
  return (
    <Suspense fallback={<FallBack />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:slug" element={<QuestionsList />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;
