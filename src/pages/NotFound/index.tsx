import { Box, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ERROR_IMAGE from "../../assets/images/undraw_page_not_found_re_e9o6.svg"; // Import your 404 image

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let prevUrl = new URLSearchParams(location.search).get("prevUrl") || "/";
  if (prevUrl.includes("/signin") || prevUrl.includes("/signup")) {
    prevUrl = "/";
  }

  return (
    <Box
      sx={{
        height: "100svh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Image of 404 */}
      <Box
        component="img"
        src={ERROR_IMAGE}
        alt="404 Not Found"
        sx={{
          maxWidth: "100%",
          height: "60svh",
          marginBottom: "20px",
        }}
      />

      {/* Error Message */}
      <Typography variant="h3" color="primary" gutterBottom>
        Oops! Page Not Found
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Link to={prevUrl}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(location)}
        >
          Go Back
        </Button>
      </Link>
    </Box>
  );
};

export default NotFound;
