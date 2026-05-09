import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();
  return (
    <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate(-1)}>
      {label}
    </Button>
  );
};

export default BackButton;
