import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import "./style.css";

type PropTypes = {
  children: ReactNode | null;
};

const AuthLayout: FC<PropTypes> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        height: "100svh",
      }}
    >
      <Box
        sx={{
          boxShadow: "0 0 10px gray",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
