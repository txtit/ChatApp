import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { ShoppingCart, Star, Favorite } from '@mui/icons-material';
import React from 'react';
const VirtualStore = () => {
    const items = [
        { id: 1, name: "Avatar Vàng", price: 500, image: "/avatar-gold.jpg", popular: true },
        { id: 2, name: "Nhãn dán Vui", price: 200, image: "/sticker-fun.jpg" },
        { id: 3, name: "Theme Xanh", price: 300, image: "/theme-blue.jpg" },
        { id: 4, name: "Huy hiệu Sao", price: 400, image: "/badge-star.jpg" }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Cửa hàng ảo</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Star color="warning" sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h6">Bạn có: 1,250 điểm</Typography>
            </Box>

            <Grid container spacing={3}>
                {items.map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.image}
                                alt={item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom>{item.name}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip label={`${item.price} điểm`} color="primary" size="small" />
                                    {item.popular && <Favorite color="error" fontSize="small" />}
                                </Box>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ShoppingCart />}
                                    sx={{ mt: 1 }}
                                >
                                    Đổi ngay
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default VirtualStore;