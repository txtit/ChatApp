import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh", // full màn hình
        width: "100vw",     // full chiều ngang
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f6fa",
        textAlign: "center",
        p: 3,
        position: "fixed", // giữ cố định full màn hình
        top: 0,
        left: 0,
        zIndex: 1300
      }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold" sx={{ fontSize: { xs: 80, md: 140 } }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Không tìm thấy trang bạn yêu cầu!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Có thể đường dẫn đã bị thay đổi hoặc trang không tồn tại.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/")}
        sx={{ borderRadius: 2, px: 4, fontWeight: "bold" }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default Page404;