import { Alert, Box, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import ProductGrid from "../components/product/ProductGrid";
import { useCart } from "../context/CartProvider";

import { getCategories, getProducts } from "../services/productService";

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
  const { wishlistItems } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");
  const [collectionType, setCollectionType] = useState("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const sortMap = {
          priceAsc: { sortBy: "price", order: "asc" },
          priceDesc: { sortBy: "price", order: "desc" },
          ratingDesc: { sortBy: "rating", order: "desc" },
        };

        const priceMap = {
          under50: { minPrice: "", maxPrice: 50 },
          from50to200: { minPrice: 50, maxPrice: 200 },
          from200to500: { minPrice: 200, maxPrice: 500 },
          from500: { minPrice: 500, maxPrice: "" },
        };

        const data = await getProducts({
          search: debouncedSearch,
          category,
          ...(priceMap[priceRange] ?? {}),
          ...(sortMap[sort] ?? {}),
        });

        setProducts(data.products);
      } catch {
        setError("Cannot load products right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, debouncedSearch, priceRange, sort]);

  const visibleProducts = useMemo(() => {
    if (collectionType === "wishlist") {
      return products.filter((item) => wishlistItems.includes(item.id));
    }
    return products;
  }, [collectionType, products, wishlistItems]);

  if (error) {
    return <EmptyState message={error} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          mb: 3,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(105deg, #0B74E5 0%, #3C8CFF 50%, #7A5AF8 100%)"
              : "linear-gradient(105deg, #1e293b 0%, #0f172a 60%, #312e81 100%)",
          color: "common.white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.16)",
            top: -70,
            right: -35,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.14)",
            bottom: -50,
            left: "35%",
          },
        }}
      >
        <Typography variant="h4" fontWeight={800} sx={{ position: "relative", zIndex: 1 }}>
          CSC Shop 
        </Typography>
        <Typography sx={{ opacity: 0.95, mt: 1, position: "relative", zIndex: 1 }}>
          Fast shipping, curated products, and a floral-themed modern shopping experience.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2.5} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Collection</InputLabel>
              <Select value={collectionType} label="Collection" onChange={(event) => setCollectionType(event.target.value)}>
                <MenuItem value="all">All products</MenuItem>
                <MenuItem value="wishlist">Wishlist only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(event) => setCategory(event.target.value)}>
                <MenuItem value="all">All categories</MenuItem>
                {categories.map((item) => {
                  const categoryValue = item.slug;
                  const categoryLabel = item.name;
                  return (
                    <MenuItem key={categoryValue} value={categoryValue}>
                      {categoryLabel}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>Price range</InputLabel>
              <Select value={priceRange} label="Price range" onChange={(event) => setPriceRange(event.target.value)}>
                <MenuItem value="all">All prices</MenuItem>
                <MenuItem value="under50">Under $50</MenuItem>
                <MenuItem value="from50to200">$50 - $200</MenuItem>
                <MenuItem value="from200to500">$200 - $500</MenuItem>
                <MenuItem value="from500">Over $500</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select value={sort} label="Sort by" onChange={(event) => setSort(event.target.value)}>
                <MenuItem value="default">Relevance</MenuItem>
                <MenuItem value="priceAsc">Price low to high</MenuItem>
                <MenuItem value="priceDesc">Price high to low</MenuItem>
                <MenuItem value="ratingDesc">Top rated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {collectionType === "wishlist" && wishlistItems.length === 0 ? (
        <EmptyState message="Your wishlist is empty. Tap heart icon on products to save favorites." />
      ) : null}

      <Stack spacing={2}>
        {loading ? (
          <>
            <Loading />
            <ProductGridSkeleton />
          </>
        ) : visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <EmptyState message="No products match current filters." />
        )}
      </Stack>
    </Container>
  );
};

export default HomePage;
