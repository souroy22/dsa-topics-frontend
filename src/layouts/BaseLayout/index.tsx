import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import "./style.css";
import Sidebar from "../../components/Sidebar";

type PropTypes = {
  children: ReactNode | null;
};

const BaseLayout: FC<PropTypes> = ({ children }) => {
  return (
    <Box className="base-layout-container">
      <Sidebar />
      <Box>{children}</Box>
    </Box>
  );
};

export default BaseLayout;
