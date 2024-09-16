import { FC, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import RouterComponent from "./routers/router";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { notification } from "./configs/notification.config";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "./api/user.api";
import { setUserData } from "./store/user/userReducer";
import { RootState } from "./store/store";
import { setUserTheme } from "./store/global/globalReducer";
import { customLocalStorage } from "./utils/customLocalStorage";

const App: FC = () => {
  const { theme } = useSelector((state: RootState) => state.globalReducer);

  const dispatch = useDispatch();

  const muiTheme = createTheme({
    palette: {
      mode: theme as "light" | "dark",
      background: {
        default: theme === "dark" ? "#1e1e1e" : "#F6F9FB",
      },
    },
  });

  const onLoad = async () => {
    const theme = customLocalStorage.getData("userTheme");
    if (theme) {
      dispatch(setUserTheme(theme));
    } else {
      dispatch(setUserTheme("light"));
    }
    try {
      const result = await getUserData();
      dispatch(setUserData(result.user));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Toaster />
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
