import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import ProductGrid from "../components/product/ProductGrid";

// Import the mock data and fetch function you provided
import { fetchProducts } from "../products";

const ProductGridSkeleton = () => {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {[...Array(8)].map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1.5 }} />
            <Skeleton width="85%" />
            <Skeleton width="55%" />
            <Skeleton width="40%" />
            <Skeleton variant="rounded" height={32} sx={{ mt: 1.3 }} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

const HomePage = () => {
  const { search = "" } = useOutletContext() ?? {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Using your provided fetchProducts function
        const allProducts = await fetchProducts();

        // Logic: Filtering by Search and Category
        let filtered = allProducts.filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

          // Since data has no category field, we filter by name keywords for demo purposes
          const matchesCategory =
            category === "all" ||
            (category === "phone" && (item.name.includes("iPhone") || item.name.includes("S23"))) ||
            (category === "laptop" && (item.name.includes("Laptop") || item.name.includes("MacBook"))) ||
            (category === "accessories" && !item.name.includes("iPhone") && !item.name.includes("Laptop"));

          return matchesSearch && matchesCategory;
        });

        // Logic: Sorting
        if (sort === "priceAsc") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === "priceDesc") {
          filtered.sort((a, b) => b.price - a.price);
        }

        setProducts(filtered);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, search, sort]);

  if (error) return <EmptyState message={error} />;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Section with Gradient UI */}
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 3,
          background: "linear-gradient(105deg, #0B74E5 0%, #3C8CFF 50%, #7A5AF8 100%)",
          color: "common.white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            top: -70,
            right: -30,
          },
        }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ position: "relative", zIndex: 1 }}>
          CSC Tech Shop
        </Typography>
        <Typography sx={{ opacity: 0.9, mt: 1, position: "relative", zIndex: 1 }}>Premium gadgets and tech accessories for developers.</Typography>
      </Box>

      {/* Filter Toolbar */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="phone">Smartphones</MenuItem>
                <MenuItem value="laptop">Laptops</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by</InputLabel>
              <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
                <MenuItem value="default">Relevance</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Product List or Skeleton */}
      <Stack spacing={2}>
        {loading ? (
          <>
            <Loading />
            <ProductGridSkeleton />
          </>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState message="No products found matching your criteria." />
        )}
      </Stack>
    </Container>
  );
};

export default HomePage;
