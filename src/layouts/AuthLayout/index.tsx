import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import AUTH_IMAGE from "../../assets/images/undraw_authentication_re_svpt.svg";
import "./style.css";

type PropTypes = {
  children: ReactNode | null;
};

const AuthLayout: FC<PropTypes> = ({ children }) => {
  return (
    <Box className="auth-layout">
      <Box className="auth-layout-img">
        <img src={AUTH_IMAGE} alt="Authentication Illustration" />
      </Box>
      <Box className="auth-form">{children}</Box>
    </Box>
  );
};

export default AuthLayout;
