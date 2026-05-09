import { Chip, Container, Stack, Typography } from "@mui/material";

const categories = ["smartphones", "laptops", "tablets", "mobile-accessories"];

const CategoryList = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Categories
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {categories.map((category) => (
          <Chip key={category} label={category} clickable color="primary" />
        ))}
      </Stack>
    </Container>
  );
};

export default CategoryList;
