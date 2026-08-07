import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import AISuggestWidget from "../components/ai/AISuggestWidget";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";
import ProductGrid from "../components/product/ProductGrid";

import { useCart } from "../context/CartProvider";
import { useDebounce } from "../hooks/useDebounce";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { Category, Product, sortMap, SortOption } from "../types";

/* Skeleton while loading */
const ProductGridSkeleton = () => (
  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
    {[...Array(8)].map((_, i) => (
      <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1.5 }} />
          <Skeleton width="85%" />
          <Skeleton width="55%" />
          <Skeleton variant="rounded" height={32} sx={{ mt: 1.3 }} />
        </Paper>
      </Grid>
    ))}
  </Grid>
);

type OutletContext = { search: string };

const HomePage = () => {
  const { search = "" } = useOutletContext<OutletContext>();
  const { wishlistItems } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [collectionType, setCollectionType] = useState("all");

  // Bài 34 — the inline useState + useEffect + setTimeout block that used to live here
  // is now the reusable `useDebounce` hook.
  const debouncedSearch = useDebounce(search, 400);

  // Fetch products (search + category go to the server; sort is applied client-side below)
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [cats, res] = await Promise.all([
          getCategories({ signal: controller.signal }),
          getProducts({ search: debouncedSearch, category, limit: 100, signal: controller.signal }),
        ]);
        setCategories(cats);
        setProducts(res.products);
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
        setError("Không tải được sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [debouncedSearch, category]);

  // Client-side: wishlist filter + sort
  const visibleProducts = useMemo(() => {
    let list = collectionType === "wishlist" ? products.filter((p) => wishlistItems.includes(p.id)) : products;
    const s = sortMap[sort] as { sortBy?: string; order?: string };
    if (s?.sortBy === "price") list = [...list].sort((a, b) => (s.order === "desc" ? b.price - a.price : a.price - b.price));
    if (s?.sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [collectionType, products, wishlistItems, sort]);

  if (error) return <EmptyState message={error} />;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Hero */}
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          mb: 3,
          background: (t) =>
            t.palette.mode === "light"
              ? "linear-gradient(105deg, #0B74E5 0%, #3C8CFF 50%, #7A5AF8 100%)"
              : "linear-gradient(105deg, #1e293b 0%, #0f172a 60%, #312e81 100%)",
          color: "common.white",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>CSC Shop</Typography>
        <Typography sx={{ opacity: 0.95, mt: 1 }}>Sản phẩm công nghệ chính hãng — dữ liệu thật từ shop-backend.</Typography>
      </Box>

      {/* Bài 34 — AI assistant, above the catalogue so it is the first thing offered
          to a shopper who does not know what to search for. */}
      <AISuggestWidget />

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Bộ sưu tập</InputLabel>
              <Select value={collectionType} label="Bộ sưu tập" onChange={(e) => setCollectionType(e.target.value)}>
                <MenuItem value="all">Tất cả sản phẩm</MenuItem>
                <MenuItem value="wishlist">Chỉ yêu thích</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select value={category} label="Danh mục" onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="all">Tất cả danh mục</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.slug} value={c.slug}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Sắp xếp</InputLabel>
              <Select value={sort} label="Sắp xếp" onChange={(e) => setSort(e.target.value as SortOption)}>
                <MenuItem value="default">Liên quan</MenuItem>
                <MenuItem value="priceAsc">Giá thấp → cao</MenuItem>
                <MenuItem value="priceDesc">Giá cao → thấp</MenuItem>
                <MenuItem value="ratingDesc">Đánh giá cao</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Products */}
      <Stack spacing={2}>
        {loading ? (
          <>
            <Loading />
            <ProductGridSkeleton />
          </>
        ) : visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <EmptyState message="Không có sản phẩm phù hợp." />
        )}
      </Stack>
    </Container>
  );
};

export default HomePage;
