import { FC, MouseEvent, useState } from "react";
import {
  TextField,
  InputAdornment,
  MenuItem,
  Box,
  Checkbox,
  MenuList,
  ListItemIcon,
  Button,
  Menu,
} from "@mui/material";
import { Filter, SearchIcon } from "lucide-react";

type PropTypes = {
  searchTerm: string;
  difficulty: string[];
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDifficultyChange: (value: string) => void;
};

const QuestionsFilter: FC<PropTypes> = ({
  searchTerm,
  difficulty,
  handleSearchChange,
  handleDifficultyChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      gap={2}
      sx={{
        flexDirection: { xs: "column", md: "row" },
        marginTop: { xs: "30px", md: "0" },
      }}
    >
      {/* Search Bar */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search problems"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 300 }}
      />

      {/* Difficulty Dropdown */}
      <Button
        sx={{
          border: "1px solid #FFF",
          borderRadius: "10px",
          display: "flex",
          gap: "5px",
          padding: "5px",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Filter /> <Box>Difficulty</Box>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{ marginTop: "10px" }}
      >
        <MenuList dense sx={{ width: "200px" }}>
          <MenuItem value="EASY" sx={{ color: "#2A6767" }}>
            <ListItemIcon>
              <Checkbox
                checked={difficulty.includes("EASY")}
                onChange={() => handleDifficultyChange("EASY")}
              />
            </ListItemIcon>
            Easy
          </MenuItem>
          <MenuItem value="MEDIUM" sx={{ color: "#FFB700" }}>
            <ListItemIcon>
              <Checkbox
                checked={difficulty.includes("MEDIUM")}
                onChange={() => handleDifficultyChange("MEDIUM")}
              />
            </ListItemIcon>
            Medium
          </MenuItem>
          <MenuItem value="HARD" sx={{ color: "#DE3636" }}>
            <ListItemIcon>
              <Checkbox
                checked={difficulty.includes("HARD")}
                onChange={() => handleDifficultyChange("HARD")}
              />
            </ListItemIcon>
            Hard
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default QuestionsFilter;
