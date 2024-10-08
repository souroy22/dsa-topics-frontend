import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Switch,
  Drawer,
  IconButton,
} from "@mui/material";
import { LogOut, Moon, SunMedium, Menu } from "lucide-react";
import { customLocalStorage } from "../../utils/customLocalStorage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../store/user/userReducer";
import { RootState } from "../../store/store";
import useThemeMode from "../../hooks/useThemeMode";
import { sidebarOptions } from "../../constants/sidebarOptions";
import { FC, useState } from "react";
import { setSelectedSidebarOption } from "../../store/global/globalReducer";
import { useMediaQuery } from "@mui/material";
import "./style.css";

const Sidebar: FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { selectedSidebarOption, theme } = useSelector(
    (state: RootState) => state.globalReducer
  );
  const { toggleTheme } = useThemeMode();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const currentTheme = theme === "dark";

  const handleSignout = () => {
    customLocalStorage.deleteData("token");
    dispatch(setUserData(null));
    navigate("/signin");
  };

  const handleClick = (value: string) => {
    dispatch(setSelectedSidebarOption(value));
    navigate("/");
    if (isMobile) {
      setIsDrawerOpen(false); // Close drawer on mobile after selecting an option
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100vh",
        width: "250px",
        backgroundColor: "background.paper",
        boxShadow: 2,
        paddingTop: "1rem",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          paddingLeft: "1rem",
        }}
      >
        <Avatar
          alt={user?.firstName}
          src="/avatar.png"
          sx={{ width: 56, height: 56, marginRight: 2 }}
        />
        <Typography variant="h6">{user?.firstName}</Typography>
        <Switch
          onChange={toggleTheme}
          checked={currentTheme}
          icon={<SunMedium />}
          checkedIcon={
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: "black",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3px",
              }}
            >
              <Moon />
            </Box>
          }
          sx={{
            padding: "5px",
            "& .MuiSwitch-thumb": {
              width: 24,
              height: 24,
              margin: 3,
              backgroundColor: currentTheme ? "#2196f3" : "#f50057",
            },
            "& .MuiSwitch-track": {
              backgroundColor: currentTheme ? "#2196f3" : "#f50057",
              height: 32,
              width: 56,
              borderRadius: 16,
              position: "relative",
            },
            "& .Mui-checked": {
              color: "#FFF",
            },
            "& .Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#272A2F",
            },
          }}
        />
      </Box>

      {/* Navigation Links */}
      <List>
        {sidebarOptions.map(({ title, IconComponent, value }) => (
          <ListItem
            key={value}
            disablePadding
            onClick={() => handleClick(value)}
            className={`${
              selectedSidebarOption === value
                ? theme === "dark"
                  ? "selected"
                  : "selected-light"
                : ""
            }`}
            sx={{ paddingLeft: "1rem" }}
          >
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <IconComponent size={20} />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ListItem disablePadding sx={{ position: "absolute", bottom: 0 }}>
        <ListItemButton onClick={handleSignout}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={() => setIsDrawerOpen(true)}
            sx={{ position: "absolute", top: 10, left: 10 }}
          >
            <Menu size={24} />
          </IconButton>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <Box>{sidebarContent}</Box>
      )}
    </>
  );
};

export default Sidebar;
