import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
  IconButton,
  DialogActions,
  Skeleton,
  Box,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useForm } from "react-hook-form";
import { BlogService } from "../services/blogService";

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái load danh sách bài viết
  const [commentData, setCommentData] = useState({ open: false, list: [], loading: false });
  const [deleteId, setDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // 1. Load danh sách bài viết khi vào trang
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 2. Xử lý xem bình luận (gọi API lồng trong Dialog)
  const handleOpenComments = async (postId) => {
    setCommentData({ open: true, list: [], loading: true });
    try {
      const comments = await BlogService.getComments(postId);
      setCommentData((prev) => ({ ...prev, list: comments, loading: false }));
    } catch (err) {
      setCommentData((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  // 3. Thêm bài viết mới
  const onAddPost = async (data) => {
    try {
      const newPost = await BlogService.createPost(data);
      setPosts([{ ...newPost, id: Date.now() }, ...posts]);
      reset();
    } catch (error) {
      alert("Không thể đăng bài!");
    }
  };

  // 4. Xác nhận xóa bài viết
  const confirmDelete = async () => {
    try {
      await BlogService.deletePost(deleteId);
      setPosts(posts.filter((p) => p.id !== deleteId));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={900} gutterBottom color="primary">
        BLOG EXPLORER
      </Typography>

      {/* FORM THÊM MỚI */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit(onAddPost)}>
          <Stack spacing={2}>
            <TextField label="Tiêu đề bài viết" {...register("title", { required: true })} fullWidth disabled={isSubmitting} />
            <TextField label="Nội dung bài viết" {...register("body", { required: true })} multiline rows={2} fullWidth disabled={isSubmitting} />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng bài ngay"}
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* DANH SÁCH POST (CÓ XỬ LÝ LOADING SKELETON) */}
      <Grid container spacing={3}>
        {loading
          ? // Hiển thị 6 Skeleton khi đang load danh sách
            Array.from(new Array(6)).map((_, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                <Skeleton width="80%" sx={{ mt: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))
          : posts.map((post) => (
              <Grid size={{ xs: 12, md: 4 }} key={post.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.body.substring(0, 80)}...
                    </Typography>
                  </CardContent>
                  <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0 }}>
                    <Button size="small" variant="outlined" startIcon={<ChatBubbleIcon />} onClick={() => handleOpenComments(post.id)}>
                      Bình luận
                    </Button>
                    <IconButton color="error" onClick={() => setDeleteId(post.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* DIALOG BÌNH LUẬN (CÓ XỬ LÝ CIRCULAR PROGRESS) */}
      <Dialog open={commentData.open} onClose={() => setCommentData({ ...commentData, open: false })} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>Bình luận bài viết</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 200, display: "flex", flexDirection: "column" }}>
          {commentData.loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {commentData.list.map((c) => (
                <ListItem key={c.id} divider>
                  <ListItemText primary={<strong>{c.email}</strong>} secondary={c.body} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentData({ ...commentData, open: false })}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÁC NHẬN XÓA */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Bạn có chắc muốn xóa bài viết này?</DialogTitle>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">
            Hủy
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
