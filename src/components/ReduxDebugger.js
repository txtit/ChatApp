import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const ReduxDebugger = () => {
    const fullReduxState = useSelector(state => state);
    const progressState = useSelector(state => state.progress);
    const slideState = useSelector(state => state.slide); // Add slide state debugging

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                🔍 Redux State Debugger
            </Typography>

            {/* Progress State Summary */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                        📊 Progress State Summary
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">Basic Info:</Typography>
                            <Typography variant="body2">User ID: {progressState.userId || 'Empty'}</Typography>
                            <Typography variant="body2">Slide ID: {progressState.slideId || 'Empty'}</Typography>
                            <Typography variant="body2">Overall Progress: {progressState.overallProgress || 0}%</Typography>
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="bold">Completions:</Typography>
                            <Typography variant="body2">Slides: {progressState.completedSlides?.length || 0}</Typography>
                            <Typography variant="body2">Exercises: {progressState.completedExercises?.length || 0}</Typography>
                            <Typography variant="body2">Quizzes: {progressState.completedQuizzes?.length || 0}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="bold">Achievements:</Typography>
                            <Typography variant="body2">Achievements: {progressState.achievements?.length || 0}</Typography>
                            <Typography variant="body2">Badges: {progressState.unlockedBadges?.length || 0}</Typography>
                            <Typography variant="body2">Goals: {progressState.currentGoals?.length || 0}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Simple Progress Object */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="secondary">
                        📝 Simple Progress Object (Current Data)
                    </Typography>
                    <Box sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                        {Object.keys(progressState.progress || {}).length > 0 ? (
                            <pre style={{ fontSize: '12px', margin: 0 }}>
                                {JSON.stringify(progressState.progress, null, 2)}
                            </pre>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No simple progress data available
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Detailed Progress State */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">🔧 Full Progress State (All Properties)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, maxHeight: 600, overflow: 'auto' }}>
                        <pre style={{ fontSize: '11px', margin: 0 }}>
                            {JSON.stringify(progressState, null, 2)}
                        </pre>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Full Redux State */}
            <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">⚙️ Complete Redux State (All Slices)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, maxHeight: 600, overflow: 'auto' }}>
                        <pre style={{ fontSize: '10px', margin: 0 }}>
                            {JSON.stringify(fullReduxState, null, 2)}
                        </pre>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Available Redux State Keys */}
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        🗂️ Available Redux Slices
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.keys(fullReduxState).map(key => (
                            <Box
                                key={key}
                                sx={{
                                    backgroundColor: key === 'progress' ? 'primary.light' : 'grey.200',
                                    color: key === 'progress' ? 'white' : 'text.primary',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {key}
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Slide State Summary - NEW */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="secondary">
                        🎯 Slide State (Progress V2) Summary
                    </Typography>

                    {!slideState ? (
                        <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                            <Typography color="error" fontWeight="bold">
                                ❌ Slide state is undefined! Check rootReducer.js imports.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">Current Slide:</Typography>
                                <Typography variant="body2">ID: {slideState.currentSlide?.id || 'None'}</Typography>
                                <Typography variant="body2">Title: {slideState.currentSlide?.title || 'None'}</Typography>
                                <Typography variant="body2">Completed: {slideState.currentSlide?.isCompleted ? 'Yes' : 'No'}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" fontWeight="bold">Lesson Progress:</Typography>
                                <Typography variant="body2">Progress: {slideState.lessonProgress?.percentage || 0}%</Typography>
                                <Typography variant="body2">Completed: {slideState.lessonProgress?.completedSlides || 0}</Typography>
                                <Typography variant="body2">Total: {slideState.lessonProgress?.totalSlides || 0}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" fontWeight="bold">All Slides:</Typography>
                                <Typography variant="body2">Tracked Slides: {Object.keys(slideState.slides || {}).length}</Typography>
                                <Typography variant="body2">Completed: {Object.values(slideState.slides || {}).filter(s => s.completed).length}</Typography>
                                <Typography variant="body2">Visited: {Object.values(slideState.slides || {}).filter(s => s.visited).length}</Typography>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ReduxDebugger;
