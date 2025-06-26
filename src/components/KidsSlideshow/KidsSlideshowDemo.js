import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/Store';
import KidsSlideshow from './KidsSlideshow';
import { sampleSlideData } from '../../data/sampleSlideData';
import { Container, Typography, Box } from '@mui/material';

const KidsSlideshowDemo = () => {
    return (
        <Provider store={store}>
            <Container maxWidth="xl" sx={{ py: 2 }}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        mb: 2
                    }}>
                        Demo KidsSlideshow
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Với QuizSlide và ExerciseSlide
                    </Typography>
                </Box>
                
                <KidsSlideshow data={sampleSlideData} />
            </Container>
        </Provider>
    );
};

export default KidsSlideshowDemo;
