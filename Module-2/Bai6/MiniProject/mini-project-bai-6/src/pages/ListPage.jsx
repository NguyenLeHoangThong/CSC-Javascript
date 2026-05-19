import { Grid, Card, CardContent, Typography, Button, Container, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const partners = [
  { id: 1, name: "Google", email: "contact@google.com" },
  { id: 2, name: "Meta", email: "hr@meta.com" },
  { id: 3, name: "Amazon", email: "support@amazon.com" },
];

export default function ListPage() {
  return (
    <Container sx={{ py: 4 }}>
      {/* 1. Responsive Stack: 
          - Mobile (xs): Xếp dọc (column), căn trái, khoảng cách các con là 2 (16px)
          - Tablet/PC (sm trở lên): Xếp ngang (row), giãn cách 2 bên 
      */}
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2} 
        sx={{ mb: 5 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Đối tác
        </Typography>

        <Button 
          variant="contained" 
          href="/add" 
          startIcon={<AddIcon />}
          sx={{ 
            // Mobile: Chiều rộng 100%, PC: Tự động theo nội dung
            width: { xs: "100%", sm: "auto" } 
          }}
        >
          Thêm đối tác
        </Button>
      </Stack>

      {/* 2. Grid System:
          - xs={12}: 1 cột trên mobile
          - sm={6}: 2 cột trên tablet
          - md={4}: 3 cột trên desktop
      */}
      <Grid container spacing={3}>
        {partners.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 10, transform: "translateY(-5px)" } 
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                <Typography color="text.secondary">{item.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}