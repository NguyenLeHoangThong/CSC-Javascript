import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ value, onChange }) => (
  <TextField
    fullWidth
    size="small"
    placeholder="Search products, brands..."
    value={value}
    onChange={onChange}
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        color: "text.primary",
        "& input::placeholder": {
          color: "text.secondary",
          opacity: 0.9,
        },
      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="action" />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar;
