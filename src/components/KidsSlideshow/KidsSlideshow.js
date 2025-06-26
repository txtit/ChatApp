import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    useTheme,
    Alert,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Chip,
    IconButton,
    Card,
    CardContent,
    Divider,
    Stack,
    Badge,
    Fab,
    Zoom,
    LinearProgress,
    Tooltip,
} from '@mui/material';
import {
    ArrowBack,
    ArrowForward,
    Fullscreen,
    School,
    Star,
    EmojiEvents,
    Image,
    AutoAwesome,
    PlayArrow,
    Pause,
    SkipNext,
    SkipPrevious,
    Palette,
    LightbulbOutlined,
    TrendingUp,
    CheckCircle,
    Home,
    Bookmark,
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { useProgressV2 } from '../../hooks/useProgressV2';
import QuizSlide from './QuizSlide';
import ExerciseSlide from './ExerciseSlide';
import LearningAPI from '../../services/LearningAPI';

// CSS animations for beautiful effects
const keyframes = `
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInFromRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes completionPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;

// Inject CSS animations
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
}

const KidsSlideshow = ({ data }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();    // Redux progress hooks - using useProgressV2 for progress tracking
    const {
        currentSlide: reduxCurrentSlide,
        setSlide,
        updateField,
        markComplete,
        addAttempt,
        initLesson,
        lessonProgress,
        saveLastSlidePosition,
        clearLastPosition,
        getLastSlidePosition,
        allLessonsData,
        getLessonProgressPercentage,
        isLessonCompleted,
        getLessonScore,
        getLastSlidePositionForLesson,
        forceUpdateProgress
    } = useProgressV2();

    // Debug Redux hooks
    console.log('🔧 Redux Progress Hooks Debug:', {
        hasGetLastSlidePosition: typeof getLastSlidePosition === 'function',
        hasSaveLastSlidePosition: typeof saveLastSlidePosition === 'function',
        lessonProgress: lessonProgress,
        reduxCurrentSlide: reduxCurrentSlide
    });    // Local state for UI and interactive features
    const [slideIndex, setSlideIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    // Learning session state for API integration
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isBackendInitialized, setIsBackendInitialized] = useState(false);

    // ✅ Use useMemo to prevent infinite re-renders
    const lessonId = useMemo(() => {
        const pathname = window.location.pathname;
        const pathSegments = pathname.split('/').filter(segment => segment);
        return pathSegments[pathSegments.length - 1];
    }, []);

    const [processedSlideData, setProcessedSlideData] = useState(null);// Extract data from props
    const { slides, exercises, quizzes, title, subjectGrade } = data || {};
    const currentLessonId = lessonId;
    const currentUserId = localStorage.getItem('userId') || 'unknown_user'; // Fallback to 'unknown_user' if not set
    console.log(data, '🔍 KidsSlideshow Data:');
    console.log('🔍 KidsSlideshow LessonId:', currentLessonId);
    console.log(exercises, '🔍 KidsSlideshow Exercises:');

    // Calculate total slides and current slide data
    const totalSlides = slides?.length || 0;
    const currentSlideData = slides?.[slideIndex];

    // Use processed data for rendering, fallback to original
    const slideDataForRender = processedSlideData || currentSlideData;// Debug logs
    console.log('🎯 KidsSlideshow Redux Integration:', {
        slideIndex,
        totalSlides,
        reduxCurrentSlide: reduxCurrentSlide?.id,
        lessonProgress: lessonProgress?.percentage || 0
    });    // Debug current slide data
    console.log('🔍 Current Slide Data (original):', currentSlideData);
    console.log('� Processed Slide Data (for render):', slideDataForRender);
    console.log('�📋 Current Slide Debug:', {
        slideIndex,
        currentSlideType: slideDataForRender?.type,
        currentSlideId: slideDataForRender?.id,
        hasQuestions: !!(slideDataForRender?.questions?.length),
        hasAnswers: !!(slideDataForRender?.answers?.length),
        exercisesCount: exercises?.length || 0,
        quizzesCount: quizzes?.length || 0
    });    // Initialize lesson progress when component mounts
    useEffect(() => {
        if (slides && slides.length > 0 && data?.id) {
            console.log('🔄 Initializing lesson with', slides.length, 'slides');

            // Initialize Redux lesson progress
            initLesson({
                totalSlides: slides.length,
                lessonId: data.id,
                lessonTitle: title || 'Bài học tương tác'
            });            // Initialize backend progress and start session
            const initializeBackendProgress = async () => {
                try {
                    // Health check first
                    console.log('🏥 Checking backend health...');
                    await LearningAPI.healthCheck();
                    console.log('✅ Backend health check passed');

                    console.log('🚀 Initializing backend progress for lesson:', data.id);

                    // Initialize progress in backend FIRST
                    const initResponse = await LearningAPI.initializeProgress(data.id, slides.length);
                    console.log('✅ Backend progress initialized:', initResponse);

                    // Mark backend as initialized so slide sync can start
                    setIsBackendInitialized(true);
                    console.log('🎯 Backend initialized - slide sync enabled');

                    // Start learning session
                    const sessionResponse = await LearningAPI.startLearningSession(data.id, 'study');
                    console.log('✅ Learning session started:', sessionResponse);

                    if (sessionResponse.success && sessionResponse.data.sessionId) {
                        setCurrentSessionId(sessionResponse.data.sessionId);
                        setIsSessionActive(true);
                        console.log('📝 Session ID stored:', sessionResponse.data.sessionId);
                    }

                } catch (error) {
                    console.error('❌ Error initializing backend progress/session:', error);
                    // Continue without backend integration if API fails
                    console.log('⚠️ Continuing with Redux-only mode');
                    setIsBackendInitialized(false);
                }
            };

            initializeBackendProgress();

            // Calculate initial progress based on current slide
            const initialProgress = Math.round(((slideIndex + 1) / slides.length) * 100);
            console.log('📊 Initial progress calculated:', {
                currentSlide: slideIndex,
                totalSlides: slides.length,
                initialProgress: initialProgress + '%'
            });

            // Update initial progress in Redux
            updateField('currentSlideIndex', slideIndex);
            updateField('progress', initialProgress);
        }
    }, [slides?.length, data?.id, title, initLesson, slideIndex, updateField]);// Initialize slide position from URL parameter if available
    useEffect(() => {
        const slideIndexParam = searchParams.get('slideIndex');
        if (slideIndexParam && slides && slides.length > 0) {
            const parsedIndex = parseInt(slideIndexParam, 10);
            if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < slides.length) {
                console.log('🎯 Setting initial slide index from URL:', parsedIndex);
                setSlideIndex(parsedIndex);
            }
        }
    }, [searchParams, slides]);    // Restore last slide position when component mounts
    useEffect(() => {
        // Only restore position if not overridden by URL parameter
        const slideIndexParam = searchParams.get('slideIndex');

        if (!slideIndexParam && currentLessonId && slides && slides.length > 0) {
            console.log('🔄 Attempting to restore last slide position...');
            console.log('🔄 Lesson ID:', currentLessonId);
            console.log('🔄 Total slides:', slides.length);

            try {
                const lastPosition = getLastSlidePosition(currentLessonId);
                console.log('🔄 Retrieved last position:', lastPosition);

                if (lastPosition && typeof lastPosition === 'object') {
                    const { slideIndex: lastSlideIndex, slideId } = lastPosition;
                    console.log('🔄 Last position details:', { lastSlideIndex, slideId });

                    if (typeof lastSlideIndex === 'number' &&
                        lastSlideIndex >= 0 &&
                        lastSlideIndex < slides.length) {

                        console.log('🎯 Restoring last slide position:', lastSlideIndex);
                        setSlideIndex(lastSlideIndex);

                        // Add a small delay to ensure the slide is properly set
                        setTimeout(() => {
                            console.log('✅ Last position restored successfully');
                        }, 100);
                    } else {
                        console.log('⚠️ Invalid last slide index:', lastSlideIndex, 'Total slides:', slides.length);
                    }
                } else {
                    console.log('🆕 No valid last position found, starting from slide 0');
                }
            } catch (error) {
                console.error('❌ Error restoring last slide position:', error);
                console.log('🆕 Fallback to slide 0');
            }
        } else {
            if (slideIndexParam) {
                console.log('🔄 URL parameter overriding last position');
            } else if (!currentLessonId) {
                console.log('🔄 No lesson ID available for position restore');
            } else if (!slides || slides.length === 0) {
                console.log('🔄 No slides available for position restore');
            }
        }
    }, [currentLessonId, slides?.length, searchParams]); // Remove getLastSlidePosition from deps

    // Update Redux slide data when slideIndex changes
    useEffect(() => {
        if (currentSlideData) {
            console.log('🔄 Updating Redux slide:', currentSlideData.id || `slide_${slideIndex}`);
            setShowResults(false);
            // Merge quiz/exercise data into slide if needed
            const mergedSlideData = { ...currentSlideData };            // Handle exercise data merging
            if (currentSlideData.type === 'exercise' && exercises?.length > 0) {
                let exerciseData = null;

                console.log('🔍 Looking for exercise data for slide:', currentSlideData.id);
                console.log('🔍 Available exercises:', exercises.map(ex => ({ id: ex.id, title: ex.title })));
                console.log('🔍 Current slide index:', slideIndex);

                // NEW: Count total exercise slides in the lesson
                const exerciseSlides = slides?.filter(slide => slide.type === 'exercise') || [];
                const totalExerciseSlides = exerciseSlides.length;
                console.log('📊 Total exercise slides in lesson:', totalExerciseSlides);
                console.log('📊 Total exercises available:', exercises.length);

                // If there's only 1 exercise slide, aggregate ALL exercises into this slide
                if (totalExerciseSlides === 1 && exercises.length > 1) {
                    console.log('🔄 AGGREGATING ALL EXERCISES - Only 1 exercise slide found, merging all exercises');

                    // Combine all exercises into one
                    const allQuestions = [];
                    const allAnswers = [];
                    const allContent = [];
                    const exerciseTitles = [];

                    exercises.forEach((exercise, index) => {
                        console.log(`🔄 Processing exercise ${index + 1}:`, exercise.title);

                        // Add exercise title as a separator
                        if (exercise.title) {
                            exerciseTitles.push(exercise.title);
                        }

                        // Merge questions
                        if (exercise.questions && Array.isArray(exercise.questions)) {
                            allQuestions.push(...exercise.questions);
                        }

                        // Merge answers
                        if (exercise.answers && Array.isArray(exercise.answers)) {
                            allAnswers.push(...exercise.answers);
                        }

                        // Merge content
                        if (exercise.content && Array.isArray(exercise.content)) {
                            allContent.push(...exercise.content);
                        } else if (exercise.answers && Array.isArray(exercise.answers)) {
                            allContent.push(...exercise.answers);
                        }
                    });

                    // Create aggregated exercise data
                    exerciseData = {
                        id: 'aggregated_exercises',
                        title: exerciseTitles.length > 0 ? exerciseTitles.join(' + ') : 'Tổng hợp bài tập',
                        description: `Tổng hợp ${exercises.length} bài tập`,
                        questions: allQuestions,
                        answers: allAnswers,
                        content: allContent.length > 0 ? allContent : allAnswers,
                        type: 'aggregated',
                        originalExercises: exercises // Keep reference to original exercises
                    };

                    console.log('✅ AGGREGATED EXERCISE DATA CREATED:', {
                        totalExercises: exercises.length,
                        totalQuestions: allQuestions.length,
                        totalAnswers: allAnswers.length,
                        totalContent: allContent.length,
                        title: exerciseData.title
                    });
                } else {
                    console.log('🔍 Normal exercise matching - Multiple slides or single exercise');

                    // Method 1: Find by exerciseId first
                    if (currentSlideData.exerciseId) {
                        console.log('🔍 Searching for exerciseId:', currentSlideData.exerciseId);
                        console.log('🔍 Available exercise IDs:', exercises.map(ex => ex.id));

                        // Try exact match first
                        exerciseData = exercises.find(ex => ex.id === currentSlideData.exerciseId);

                        // If not found, try partial matching with the middle part (lesson ID)
                        if (!exerciseData) {
                            const slideExerciseId = currentSlideData.exerciseId;
                            const lessonId = '683ab3a52651632e975a79c2'; // Extract lesson ID part

                            // Look for exercise that contains the lesson ID
                            exerciseData = exercises.find(ex => ex.id.includes(lessonId));

                            if (exerciseData) {
                                console.log('🔍 Found by lesson ID match:', exerciseData.id);
                            } else {
                                // Try matching by the number at the end
                                const slideNumMatch = slideExerciseId.match(/_(\d+)$/);
                                if (slideNumMatch) {
                                    const slideNum = slideNumMatch[1];
                                    exerciseData = exercises.find(ex => ex.id.endsWith(`_${slideNum}`));
                                    console.log('🔍 Found by end number match:', exerciseData?.id || 'NOT FOUND');
                                }
                            }
                        }

                        console.log('🔍 Found by exerciseId:', exerciseData?.id || 'NOT FOUND');

                        if (exerciseData) {
                            console.log('✅ Exercise found by ID:', {
                                id: exerciseData.id,
                                title: exerciseData.title,
                                questionsCount: exerciseData.questions?.length || 0
                            });
                        } else {
                            console.log('❌ No exercise found with ID:', currentSlideData.exerciseId);
                        }
                    }

                    // Method 2: Count exercise slides to map to exercise array
                    if (!exerciseData) {
                        let exerciseSlideIndex = 0;

                        // Count how many exercise slides we've seen up to current slide
                        for (let i = 0; i < slideIndex; i++) {
                            if (slides?.[i]?.type === 'exercise') {
                                exerciseSlideIndex++;
                            }
                        }

                        // Map to exercise array (0-based)
                        if (exercises[exerciseSlideIndex]) {
                            exerciseData = exercises[exerciseSlideIndex];
                            console.log('🔍 Found by exercise slide count:', exerciseData?.id, 'at exercise index:', exerciseSlideIndex);
                        }
                    }

                    // Method 3: Extract slide number and match by pattern
                    if (!exerciseData) {
                        const slideIdParts = currentSlideData.id?.split('_') || [];
                        const slideNumber = slideIdParts[slideIdParts.length - 1];
                        const slideNum = parseInt(slideNumber);

                        console.log('🔍 Slide ID parts:', slideIdParts);
                        console.log('🔍 Slide number extracted:', slideNumber, 'parsed:', slideNum);

                        if (!isNaN(slideNum)) {
                            // Try multiple pattern matching approaches
                            const lessonId = '683ab3a52651632e975a79c2';

                            // Pattern 1: exact pattern match like "ex_683ab3a52651632e975a79c2_3"
                            let expectedExerciseId = `ex_${lessonId}_${slideNum}`;
                            exerciseData = exercises.find(ex => ex.id === expectedExerciseId);

                            if (!exerciseData) {
                                // Pattern 2: without "ex_" prefix like "683ab3a52651632e975a79c2_3"
                                expectedExerciseId = `${lessonId}_${slideNum}`;
                                exerciseData = exercises.find(ex => ex.id === expectedExerciseId);
                            }

                            if (!exerciseData) {
                                // Pattern 3: any exercise that ends with the slide number
                                exerciseData = exercises.find(ex => ex.id.endsWith(`_${slideNum}`));
                            }

                            if (!exerciseData) {
                                // Pattern 4: any exercise that contains the lesson ID
                                exerciseData = exercises.find(ex => ex.id.includes(lessonId));
                            }

                            if (exerciseData) {
                                console.log('🔍 Found by pattern matching:', exerciseData?.id);
                            } else {
                                // Fallback: direct mapping by index
                                const exerciseIndex = (slideNum - 1) % exercises.length;
                                exerciseData = exercises[exerciseIndex];
                                console.log('🔍 Found by slide number mapping:', exerciseData?.id, 'at index:', exerciseIndex);
                            }
                        }
                    }

                    // Method 4: Simple sequential fallback based on slideIndex
                    if (!exerciseData) {
                        const exerciseIndex = slideIndex % exercises.length;
                        exerciseData = exercises[exerciseIndex];
                        console.log('🔍 Using sequential fallback:', exerciseData?.id, 'at index:', exerciseIndex);
                    }
                }

                // Continue with merging logic after finding exercise data
                if (exerciseData) {
                    console.log('🔀 MERGING EXERCISE DATA - START');
                    console.log('🔀 Exercise data to merge:', {
                        id: exerciseData.id,
                        title: exerciseData.title,
                        description: exerciseData.description,
                        questionsCount: exerciseData.questions?.length || 0,
                        answersCount: exerciseData.answers?.length || 0
                    });
                    console.log('📝 Exercise questions BEFORE merge:', exerciseData.questions);
                    console.log('📝 Exercise answers BEFORE merge:', exerciseData.answers);
                    console.log('📝 Slide data BEFORE merge:', mergedSlideData);

                    // Ensure we have proper data structure
                    const exerciseContent = exerciseData.content || exerciseData.answers || [];
                    const exerciseQuestions = exerciseData.questions || [];
                    const exerciseAnswers = exerciseData.answers || [];

                    // Check if it's a fill-in-the-blank exercise based on content
                    const isFillInBlank = exerciseData.type === 'fill-in-blank' ||
                        exerciseData.title?.toLowerCase().includes('fill') ||
                        exerciseData.title?.toLowerCase().includes('blank') ||
                        exerciseData.title?.toLowerCase().includes('word building') ||
                        exerciseQuestions.some(q => typeof q === 'string' && q.includes('_'));

                    // Merge all exercise data into slide
                    Object.assign(mergedSlideData, {
                        exerciseId: exerciseData.id,
                        questions: exerciseQuestions, // Always ensure this is an array
                        answers: exerciseAnswers, // Always ensure this is an array
                        content: exerciseContent.length > 0 ? exerciseContent : mergedSlideData.content || [],
                        description: exerciseData.description || mergedSlideData.description || 'Bài tập tương tác trên lớp',
                        title: exerciseData.title || mergedSlideData.title,
                        imagePrompt: exerciseData.imagePrompt || mergedSlideData.imagePrompt,
                        exerciseType: isFillInBlank ? 'fill-in-blank' : 'practice',
                        // Copy all original exercise data for reference
                        originalExercise: exerciseData
                    });

                    console.log('📝 Slide data AFTER merge:', mergedSlideData);
                    console.log('✅ MERGED EXERCISE DATA - COMPLETE:', {
                        exerciseId: mergedSlideData.exerciseId,
                        title: mergedSlideData.title,
                        description: mergedSlideData.description,
                        questionsCount: mergedSlideData.questions?.length || 0,
                        answersCount: mergedSlideData.answers?.length || 0,
                        contentCount: mergedSlideData.content?.length || 0,
                        exerciseType: mergedSlideData.exerciseType,
                        hasOriginalExercise: !!mergedSlideData.originalExercise
                    });
                    console.log('🔀 MERGING EXERCISE DATA - END');
                } else {
                    console.log('❌ No exercise data found for slide:', currentSlideData.id);
                    console.log('📋 Available exercises:', exercises?.map(ex => ex.id) || []);
                    console.log('📋 Current slide index:', slideIndex);
                    console.log('📋 Total slides:', slides?.length);

                    // Enhanced fallback: add sample content for demo
                    const fallbackContent = mergedSlideData.content?.length > 0 ? mergedSlideData.content : [
                        'Đây là bài tập thực hành được thiết kế để học sinh tương tác trực tiếp với giáo viên',
                        'Hãy làm theo hướng dẫn của giáo viên để hoàn thành bài tập này'
                    ];

                    // Add sample questions if title suggests it's a fill-in-the-blank exercise
                    if (currentSlideData.title?.toLowerCase().includes('fill in') ||
                        currentSlideData.title?.toLowerCase().includes('blanks') ||
                        currentSlideData.title?.toLowerCase().includes('practice')) {

                        console.log('🔧 Adding sample fill-in-the-blank questions for:', currentSlideData.title);
                        mergedSlideData.questions = [
                            "h_m (What you eat for lunch)",
                            "j_m (Sweet spread for bread)",
                            "r_m (Male sheep)"
                        ];
                        mergedSlideData.answers = ["ham", "jam", "ram"];
                        mergedSlideData.exerciseType = 'fill-in-blank';
                    }

                    // Update merged data with fallback
                    Object.assign(mergedSlideData, {
                        content: fallbackContent,
                        description: mergedSlideData.description || 'Bài tập tương tác trên lớp - làm theo hướng dẫn của giáo viên',
                        exerciseId: mergedSlideData.exerciseId || currentSlideData.id || `exercise_${slideIndex}`,
                        exerciseType: mergedSlideData.exerciseType || 'practice'
                    }); console.log('🔧 Applied fallback exercise content:', {
                        contentLength: mergedSlideData.content?.length,
                        hasQuestions: !!(mergedSlideData.questions?.length),
                        exerciseType: mergedSlideData.exerciseType
                    });
                }

                // Final safety check: ensure questions and answers are always arrays for exercise slides
                if (currentSlideData.type === 'exercise') {
                    mergedSlideData.questions = Array.isArray(mergedSlideData.questions) ? mergedSlideData.questions : [];
                    mergedSlideData.answers = Array.isArray(mergedSlideData.answers) ? mergedSlideData.answers : [];

                    console.log('🎯 FINAL EXERCISE DATA VERIFICATION:', {
                        slideIndex,
                        slideType: mergedSlideData.slideType,
                        title: mergedSlideData.title,
                        questionsCount: mergedSlideData.questions?.length || 0,
                        answersCount: mergedSlideData.answers?.length || 0,
                        hasQuestions: Array.isArray(mergedSlideData.questions) && mergedSlideData.questions.length > 0,
                        hasAnswers: Array.isArray(mergedSlideData.answers) && mergedSlideData.answers.length > 0,
                        exerciseId: mergedSlideData.exerciseId,
                        questionsArray: mergedSlideData.questions,
                        answersArray: mergedSlideData.answers
                    });
                }
            }            // Handle quiz data merging
            if (currentSlideData.type === 'quiz' && quizzes?.length > 0) {
                let quizData = null;

                console.log('🔍 Looking for quiz data for slide:', currentSlideData.id);
                console.log('🔍 Available quizzes:', quizzes.map(q => ({ id: q.id, title: q.title })));

                // NEW: Count total quiz slides in the lesson
                const quizSlides = slides?.filter(slide => slide.type === 'quiz') || [];
                const totalQuizSlides = quizSlides.length;
                console.log('📊 Total quiz slides in lesson:', totalQuizSlides);
                console.log('📊 Total quizzes available:', quizzes.length);

                // If there's only 1 quiz slide, aggregate ALL quizzes into this slide
                if (totalQuizSlides === 1 && quizzes.length > 1) {
                    console.log('🔄 AGGREGATING ALL QUIZZES - Only 1 quiz slide found, merging all quizzes');

                    // Combine all quizzes into one questions array
                    const allQuestions = [];
                    const quizTitles = [];

                    quizzes.forEach((quiz, index) => {
                        console.log(`🔄 Processing quiz ${index + 1}:`, quiz.title);

                        // Add quiz title for reference
                        if (quiz.title) {
                            quizTitles.push(quiz.title);
                        }

                        // Convert each quiz to question format and add to array
                        const questionObj = {
                            question: quiz.question || `Câu hỏi ${index + 1}`,
                            options: quiz.options || [],
                            correctAnswer: quiz.correctOption || quiz.correctAnswer,
                            type: 'multipleChoice',
                            quizId: quiz.id,
                            quizTitle: quiz.title
                        };

                        allQuestions.push(questionObj);
                    });

                    // Create aggregated quiz data
                    quizData = {
                        id: 'aggregated_quizzes',
                        title: quizTitles.length > 0 ? `Tổng hợp: ${quizTitles.join(' + ')}` : 'Tổng hợp trắc nghiệm',
                        description: `Tổng hợp ${quizzes.length} câu hỏi trắc nghiệm`,
                        questions: allQuestions,
                        type: 'aggregated',
                        originalQuizzes: quizzes // Keep reference to original quizzes
                    };

                    console.log('✅ AGGREGATED QUIZ DATA CREATED:', {
                        totalQuizzes: quizzes.length,
                        totalQuestions: allQuestions.length,
                        title: quizData.title
                    });

                    // Merge aggregated data into slide
                    Object.assign(mergedSlideData, {
                        questions: quizData.questions,
                        description: quizData.description,
                        title: quizData.title,
                        quizType: 'aggregated',
                        originalQuizzes: quizData.originalQuizzes
                    });

                } else {
                    console.log('🔍 Normal quiz matching - Multiple slides or single quiz');

                    // Find by quizId first
                    if (currentSlideData.quizId) {
                        quizData = quizzes.find(quiz => quiz.id === currentSlideData.quizId);
                        console.log('🔍 Found by quizId:', quizData?.id);
                    }

                    // Fallback: pattern matching with slide index
                    if (!quizData) {
                        // Extract slide number from slide id (e.g., slide_..._15 -> index 14 for 0-based)
                        const slideIdParts = currentSlideData.id?.split('_') || [];
                        const slideNumber = slideIdParts[slideIdParts.length - 1];
                        const slideIndexInData = parseInt(slideNumber) - 1; // Convert to 0-based index

                        // Try to find quiz by index or partial matching
                        if (!isNaN(slideIndexInData) && quizzes[slideIndexInData % quizzes.length]) {
                            quizData = quizzes[slideIndexInData % quizzes.length];
                            console.log('🔍 Found by index pattern:', quizData?.id);
                        }
                    }

                    // Fallback: first quiz
                    if (!quizData && quizzes.length > 0) {
                        quizData = quizzes[0];
                        console.log('🔍 Using first quiz:', quizData?.id);
                    }

                    if (quizData) {
                        console.log('🔀 Merging quiz data:', quizData.id);
                        console.log('❓ Quiz questions:', quizData.questions?.length || 0);

                        // Convert single quiz object to questions array format
                        const questionsArray = [{
                            question: quizData.question,
                            options: quizData.options,
                            correctAnswer: quizData.correctOption || quizData.correctAnswer,
                            type: 'multipleChoice',
                            quizId: quizData.id,
                            quizTitle: quizData.title
                        }];

                        Object.assign(mergedSlideData, {
                            questions: questionsArray,
                            description: quizData.description || mergedSlideData.description,
                            title: quizData.title || mergedSlideData.title,
                            quizType: 'single'
                        });
                    } else {
                        console.log('❌ No quiz data found for slide:', currentSlideData.id);
                        console.log('📋 Available quizzes:', quizzes?.map(q => q.id) || []);
                    }
                }

                // Final safety check: ensure questions is always an array for quiz slides
                if (currentSlideData.type === 'quiz') {
                    mergedSlideData.questions = Array.isArray(mergedSlideData.questions) ? mergedSlideData.questions : [];

                    console.log('🎯 FINAL QUIZ DATA VERIFICATION:', {
                        slideIndex,
                        slideType: mergedSlideData.type,
                        title: mergedSlideData.title,
                        questionsCount: mergedSlideData.questions?.length || 0,
                        hasQuestions: Array.isArray(mergedSlideData.questions) && mergedSlideData.questions.length > 0,
                        quizType: mergedSlideData.quizType,
                        questionsArray: mergedSlideData.questions
                    });
                }
            }
            // If it's exercise/quiz type but no external data, ensure it still renders as exercise/quiz
            if (currentSlideData.type === 'exercise') {
                // Ensure exercise slide always has minimum content to render
                if (!mergedSlideData.questions?.length && !mergedSlideData.content?.length) {
                    console.log('⚠️ Exercise slide with no questions or content - adding comprehensive fallback');
                    mergedSlideData.description = mergedSlideData.description || 'Đây là bài tập thực hành. Hãy làm theo hướng dẫn của giáo viên.';
                    mergedSlideData.content = [
                        '📚 Bài tập tương tác trên lớp',
                        '👨‍🏫 Hãy làm theo hướng dẫn của giáo viên để hoàn thành bài tập',
                        '✨ Đây là bài tập được thiết kế để học sinh tương tác trực tiếp với giáo viên'
                    ];
                    mergedSlideData.exerciseId = mergedSlideData.exerciseId || currentSlideData.id;
                    mergedSlideData.exerciseType = mergedSlideData.exerciseType || 'practice';
                }

                console.log('📝 Final exercise slide data:', {
                    hasQuestions: !!(mergedSlideData.questions?.length),
                    hasContent: !!(mergedSlideData.content?.length),
                    exerciseType: mergedSlideData.exerciseType,
                    exerciseId: mergedSlideData.exerciseId
                });
            } if (currentSlideData.type === 'quiz' && !mergedSlideData.questions?.length) {
                console.log('⚠️ Quiz slide with no questions - will show generic quiz interface');
                mergedSlideData.description = mergedSlideData.description || 'Đây là câu hỏi trắc nghiệm. Hãy làm theo hướng dẫn của giáo viên.';
                mergedSlideData.questions = []; // Ensure it's an array
                mergedSlideData.quizType = 'fallback';
            }// Update Redux with merged slide data
            setSlide({
                id: mergedSlideData.id || `slide_${slideIndex}`,
                title: mergedSlideData.title || `Slide ${slideIndex + 1}`,
                content: mergedSlideData.content,
                type: mergedSlideData.type || 'content',
            });

            // ✅ Save merged data to state for rendering
            setProcessedSlideData(mergedSlideData);

            console.log('✅ PROCESSED SLIDE DATA UPDATED:', {
                slideIndex,
                slideType: mergedSlideData.type,
                title: mergedSlideData.title,
                questionsCount: mergedSlideData.questions?.length || 0,
                answersCount: mergedSlideData.answers?.length || 0,
                hasQuestions: Array.isArray(mergedSlideData.questions) && mergedSlideData.questions.length > 0,
                hasAnswers: Array.isArray(mergedSlideData.answers) && mergedSlideData.answers.length > 0
            });
        }
    }, [slideIndex, currentSlideData, setSlide, exercises, quizzes]);    // Save slide position to Redux and sync with backend whenever slideIndex changes
    useEffect(() => {
        if (currentLessonId && slideIndex >= 0) {
            console.log('💾 Attempting to save slide position and sync with backend...');
            console.log('💾 Parameters:', {
                currentLessonId,
                slideIndex,
                slideId: currentSlideData?.id || `slide_${slideIndex}`,
                saveFunction: typeof saveLastSlidePosition
            });

            try {
                // Save position for all slides, including the first one
                // This ensures we can restore position even if user leaves on slide 0
                saveLastSlidePosition(currentLessonId, slideIndex, currentSlideData?.id || `slide_${slideIndex}`);
                console.log('✅ Successfully saved slide position:', {
                    lessonId: currentLessonId,
                    slideIndex,
                    slideId: currentSlideData?.id || `slide_${slideIndex}`
                });

                // Sync with backend using debounced API call
                const syncWithBackend = async () => {
                    try {
                        const progress = totalSlides > 0 ? Math.round(((slideIndex + 1) / totalSlides) * 100) : 0;

                        console.log('🔄 Syncing slide position with backend (debounced):', {
                            lessonId: currentLessonId,
                            slideIndex,
                            slideId: currentSlideData?.id || `slide_${slideIndex}`,
                            progress
                        });
                        // Use debounced update to avoid spam when user navigates quickly
                        LearningAPI.debounceUpdateSlidePosition(
                            currentLessonId,
                            slideIndex,
                            currentSlideData?.id || `slide_${slideIndex}`,
                            progress,
                            null, // userId - will use getCurrentUserId
                            totalSlides, // totalSlides for auto-initialize
                            1500  // 1.5 second debounce delay
                        );

                    } catch (error) {
                        console.error('❌ Error syncing slide position with backend:', error);
                    }
                };

                syncWithBackend();

                // Verify save by immediately checking
                setTimeout(() => {
                    try {
                        const saved = getLastSlidePosition(currentLessonId);
                        console.log('🔍 Verification - Position after save:', saved);
                    } catch (verifyError) {
                        console.error('❌ Error verifying saved position:', verifyError);
                    }
                }, 50);
            } catch (error) {
                console.error('❌ Error saving slide position:', error);
            }
        } else {
            console.log('⚠️ Cannot save slide position - missing requirements:', {
                hasLessonId: !!currentLessonId,
                slideIndex,
                slideIndexValid: slideIndex >= 0
            });
        }
    }, [currentLessonId, slideIndex, currentSlideData?.id, totalSlides]); // Remove saveLastSlidePosition, getLastSlidePosition from deps    // Save position when component unmounts (user exits) and end session
    useEffect(() => {
        return () => {
            if (currentLessonId && slideIndex >= 0) {
                console.log('🚪 Component unmounting - saving final position and ending session:', { currentLessonId, slideIndex });
                try {
                    saveLastSlidePosition(currentLessonId, slideIndex, currentSlideData?.id || `slide_${slideIndex}`);
                    console.log('✅ Final position saved on exit');

                    // End learning session if active
                    if (isSessionActive && currentSessionId) {
                        const endSession = async () => {
                            try {
                                const completionStatus = slideIndex >= totalSlides - 1 ? 'completed' : 'partial';
                                await LearningAPI.endLearningSession(currentSessionId, completionStatus, slideIndex);
                                console.log('✅ Learning session ended on component unmount');
                            } catch (error) {
                                console.error('❌ Error ending session on unmount:', error);
                            }
                        };
                        endSession();
                    }
                } catch (error) {
                    console.error('❌ Error saving final position on exit:', error);
                }
            }
        };
    }, [currentLessonId, slideIndex, currentSlideData?.id, saveLastSlidePosition, isSessionActive, currentSessionId, totalSlides]);

    // Update progress immediately when slideIndex changes
    useEffect(() => {
        if (currentLessonId && totalSlides > 0) {
            const newProgress = Math.round(((slideIndex + 1) / totalSlides) * 100);
            console.log('📊 Updating progress in real-time:', {
                slideIndex,
                totalSlides,
                newProgress: newProgress + '%'
            });

            // Update Redux state immediately
            updateField('currentSlideIndex', slideIndex);
            updateField('progress', newProgress);
        }
    }, [slideIndex, totalSlides, currentLessonId, updateField]);    // Handle navigation to next slide
    const handleNextSlide = useCallback(() => {
        // Mark content slides as completed with full score
        if (slideDataForRender?.type === 'content') {
            console.log('🏁 Completing content slide with 100% score');
            markComplete(100);
        }

        // Navigate to next slide
        if (slideIndex < totalSlides - 1) {
            const nextSlideIndex = slideIndex + 1;
            setSlideIndex(nextSlideIndex);
            setShowResults(false);

            // Immediately save the new position and update progress
            if (currentLessonId) {
                console.log('📈 Moving to next slide - updating progress and position');

                // Save the new slide position
                const nextSlideId = slides?.[nextSlideIndex]?.id || `slide_${nextSlideIndex}`;
                saveLastSlidePosition(currentLessonId, nextSlideIndex, nextSlideId);

                // Force update progress to ensure immediate Redux state update
                forceUpdateProgress(currentLessonId, nextSlideIndex);

                // Calculate and log new progress
                const newProgress = Math.round(((nextSlideIndex + 1) / totalSlides) * 100);
                console.log('📊 Progress updated:', {
                    previousSlide: slideIndex,
                    newSlide: nextSlideIndex,
                    totalSlides,
                    newProgress: newProgress + '%'
                });

                // Force Redux state update for immediate UI refresh
                updateField('currentSlideIndex', nextSlideIndex);
                updateField('progress', newProgress);
            }
        } else {
            // Reached the end of the lesson - clear last slide position and show completion
            if (currentLessonId) {
                clearLastPosition(currentLessonId);
                console.log('🎯 Lesson completed - cleared last slide position');

                // End learning session
                const endSession = async () => {
                    try {
                        if (isSessionActive && currentSessionId) {
                            await LearningAPI.endLearningSession(currentSessionId, 'completed', totalSlides - 1);
                            console.log('✅ Learning session ended - lesson completed');
                            setIsSessionActive(false);
                            setCurrentSessionId(null);
                        }
                    } catch (error) {
                        console.error('❌ Error ending session on lesson completion:', error);
                    }
                };

                endSession();

                // Show confetti for completion
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);

                // Mark lesson as fully completed with 100% progress
                markComplete(100);
                updateField('progress', 100);

                // Force final progress update
                forceUpdateProgress(currentLessonId, totalSlides - 1);

                console.log('🎉 Lesson 100% complete!');

                // Optional: Navigate back to learning hub after a delay
                setTimeout(() => {
                    navigate('/learning');
                }, 3000);
            }
        }
    }, [slideIndex, totalSlides, slideDataForRender?.type, markComplete, clearLastPosition, currentLessonId, slides, saveLastSlidePosition, updateField, navigate, forceUpdateProgress, isSessionActive, currentSessionId]);    // Handle navigation to previous slide
    const handlePrevSlide = useCallback(() => {
        if (slideIndex > 0) {
            const prevSlideIndex = slideIndex - 1;
            setSlideIndex(prevSlideIndex);
            setShowResults(false);

            // Immediately save the new position and update progress
            if (currentLessonId) {
                console.log('📉 Moving to previous slide - updating progress and position');

                // Save the new slide position
                const prevSlideId = slides?.[prevSlideIndex]?.id || `slide_${prevSlideIndex}`;
                saveLastSlidePosition(currentLessonId, prevSlideIndex, prevSlideId);

                // Force update progress to ensure immediate Redux state update
                forceUpdateProgress(currentLessonId, prevSlideIndex);

                // Calculate and log new progress
                const newProgress = Math.round(((prevSlideIndex + 1) / totalSlides) * 100);
                console.log('📊 Progress updated (going back):', {
                    previousSlide: slideIndex,
                    newSlide: prevSlideIndex,
                    totalSlides,
                    newProgress: newProgress + '%'
                });

                // Force Redux state update for immediate UI refresh
                updateField('currentSlideIndex', prevSlideIndex);
                updateField('progress', newProgress);
            }
        }
    }, [slideIndex, currentLessonId, slides, saveLastSlidePosition, updateField, totalSlides, forceUpdateProgress]);    // Handle quiz answer checking
    const handleCheckQuizAnswers = useCallback((answers) => {
        console.log('🧪 Checking quiz answers:', answers);

        // Track attempt
        addAttempt();

        // Calculate score
        let correct = 0;
        const totalQuestions = slideDataForRender.questions?.length || 0;

        slideDataForRender.questions?.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                correct++;
            }
        });

        // Convert to percentage
        const percentScore = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

        console.log(`🧪 Quiz Results: ${correct}/${totalQuestions} = ${percentScore}%`);

        // Update Redux with score
        updateField('score', percentScore);

        // Mark as completed if passing score (70%)
        if (percentScore >= 70) {
            console.log('🏁 Quiz passed! Marking as complete');
            markComplete(percentScore);
        }

        // Submit quiz result to backend
        const submitQuizResult = async () => {
            try {
                console.log('📤 Submitting quiz result to backend:', {
                    lessonId: currentLessonId,
                    slideId: slideDataForRender?.id || `slide_${slideIndex}`,
                    score: percentScore,
                    answers
                });

                await LearningAPI.submitExerciseResult(
                    currentLessonId,
                    slideDataForRender?.id || `slide_${slideIndex}`,
                    'quiz',
                    percentScore,
                    answers
                );

                console.log('✅ Quiz result submitted successfully');
            } catch (error) {
                console.error('❌ Error submitting quiz result:', error);
            }
        };

        submitQuizResult();

        // Show confetti for perfect score
        if (percentScore === 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        setShowResults(true);
    }, [slideDataForRender?.questions, slideDataForRender?.id, addAttempt, updateField, markComplete, currentLessonId, slideIndex]);    // Handle exercise completion
    const handleExerciseComplete = useCallback((score) => {
        console.log('📝 Exercise completed with score:', score);

        // Track attempt
        addAttempt();

        // Update Redux with score
        updateField('score', score);

        // Mark as completed if passing score (70%)
        if (score >= 70) {
            console.log('🏁 Exercise passed! Marking as complete');
            markComplete(score);
        }

        // Submit exercise result to backend
        const submitExerciseResult = async () => {
            try {
                console.log('📤 Submitting exercise result to backend:', {
                    lessonId: currentLessonId,
                    slideId: slideDataForRender?.id || `slide_${slideIndex}`,
                    score: score
                });

                await LearningAPI.submitExerciseResult(
                    currentLessonId,
                    slideDataForRender?.id || `slide_${slideIndex}`,
                    'exercise',
                    score,
                    null // No specific answers for exercise
                );

                console.log('✅ Exercise result submitted successfully');
            } catch (error) {
                console.error('❌ Error submitting exercise result:', error);
            }
        };

        submitExerciseResult();

        // Show confetti for perfect score
        if (score === 100) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        setShowResults(true);
    }, [slideDataForRender?.id, addAttempt, updateField, markComplete, currentLessonId, slideIndex]);

    // Helper functions for UI
    const goFullScreen = useCallback(() => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    }, []);    // Progress bar component
    const ProgressBar = () => {
        const lastPosition = currentLessonId ? getLastSlidePosition(currentLessonId) : null;

        // Calculate real-time progress based on current slide
        const realTimeProgress = totalSlides > 0 ? Math.round(((slideIndex + 1) / totalSlides) * 100) : 0;

        // Use Redux progress if available, otherwise use real-time calculation
        const displayProgress = currentLessonProgress > 0 ? currentLessonProgress : realTimeProgress;

        return (
            <Card sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: '1px solid rgba(124, 67, 189, 0.1)'
            }}>
                <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            Tiến độ bài học
                        </Typography>
                        <Box sx={{ ml: 'auto' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {displayProgress}%
                            </Typography>
                        </Box>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={displayProgress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(124, 67, 189, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, #7c43bd, #667eea)',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Đã hoàn thành: {slideIndex + 1}/{totalSlides} slides
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {title || 'Bài học tương tác'}
                        </Typography>
                    </Box>

                    {/* Debug info for progress calculation */}
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="info.main">
                            📊 Progress: Redux={currentLessonProgress}% | Real-time={realTimeProgress}% | Display={displayProgress}%
                        </Typography>
                    </Box>

                    {/* Debug info for last position */}
                    {lastPosition && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255, 193, 7, 0.1)', borderRadius: 1 }}>
                            <Typography variant="caption" color="warning.main">
                                🔄 Last Position: Slide {lastPosition.slideIndex + 1}
                                {lastPosition.slideId && ` (${lastPosition.slideId})`}
                                {lastPosition.timestamp && ` - ${new Date(lastPosition.timestamp).toLocaleTimeString()}`}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };// Render slide content tùy theo loại với giao diện đẹp
    const renderSlideContent = () => {
        if (!slideDataForRender) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Không có dữ liệu slide</Typography>
                </Paper>
            );
        }

        // Ô hình ảnh đẹp mắt
        const imageBox = (
            <Card sx={{
                width: 320,
                ml: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
                overflow: 'visible',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
                    borderRadius: 4,
                    zIndex: -1,
                    animation: 'gradient 6s ease infinite',
                    backgroundSize: '400% 400%'
                }
            }}>
                <CardContent sx={{ p: 3, color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Palette sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>
                            Tạo Hình Ảnh
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            height: 180,
                            borderRadius: 3,
                            background: imageUrl ? 'transparent' : 'rgba(255,255,255,0.1)',
                            border: imageUrl ? 'none' : '2px dashed rgba(255,255,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Generated image"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}
                            />
                        ) : (
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <LightbulbOutlined sx={{ fontSize: 40, mb: 1, opacity: 0.7 }} />
                                <Typography sx={{ fontSize: 12, mb: 1, fontWeight: 'bold' }}>
                                    Gợi ý hình ảnh:
                                </Typography>
                                <Typography sx={{
                                    fontSize: 11,
                                    fontStyle: 'italic',
                                    opacity: 0.8,
                                    lineHeight: 1.3,
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '8px',
                                    borderRadius: 2
                                }}>
                                    {slideDataForRender?.imagePrompt || "Nhập mô tả để tạo hình ảnh..."}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Stack spacing={1}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Nhập mô tả để tạo hình ảnh..."
                            value={imagePrompt}
                            onChange={e => setImagePrompt(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: 2,
                                    '&:hover': {
                                        background: 'rgba(255,255,255,1)'
                                    }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesome />}
                            onClick={() => {
                                setImageUrl(imagePrompt ? `https://dummyimage.com/280x180/7c43bd/fff&text=${encodeURIComponent(imagePrompt)}` : "");
                            }}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                fontWeight: 'bold',
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: 14,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(238, 90, 36, 0.4)'
                                }
                            }}
                        >
                            Tạo Hình Ảnh
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        );

        // Title slide với thiết kế hiện đại
        if (slideDataForRender.type === 'title') {
            return (
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch', minHeight: 500 }}>
                    <Card
                        elevation={12}
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                animation: 'shimmer 3s ease-in-out infinite'
                            }
                        }}
                    >
                        <CardContent sx={{
                            textAlign: 'center',
                            color: 'white',
                            position: 'relative',
                            zIndex: 1,
                            p: 4
                        }}>
                            <Zoom in={true} timeout={1000}>
                                <Box sx={{ mb: 3 }}>
                                    <School sx={{
                                        fontSize: 100,
                                        mb: 2,
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                    }} />
                                </Box>
                            </Zoom>

                            <Typography variant="h3" component="h1" sx={{
                                fontWeight: 900,
                                textAlign: 'center',
                                mb: 3,
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                lineHeight: 1.2
                            }}>
                                {slideDataForRender.title}
                            </Typography>

                            <Typography variant="h6"
                                sx={{
                                    opacity: 0.9,
                                    textAlign: 'center',
                                    fontWeight: 400,
                                    mb: 3,
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '12px 24px',
                                    borderRadius: 3,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                {subjectGrade}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                                <Chip
                                    icon={<Star />}
                                    label="Bắt đầu học"
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        padding: '8px 16px',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.3)'
                                        }
                                    }}
                                />
                                <Chip
                                    icon={<EmojiEvents />}
                                    label={`${totalSlides} slides`}
                                    sx={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        padding: '8px 16px'
                                    }}
                                />                            </Box>
                        </CardContent>
                    </Card>
                    {imageBox}
                </Box>
            );
        }        // Quiz slide - using merged data
        if (slideDataForRender.type === 'quiz') {
            console.log('🧪 Rendering quiz slide with questions:', slideDataForRender.questions?.length || 0);
            console.log('🧪 Quiz slide data:', {
                id: slideDataForRender.id,
                type: slideDataForRender.type,
                questionsCount: slideDataForRender.questions?.length || 0,
                hasQuestions: !!slideDataForRender.questions?.length,
                quizType: slideDataForRender.quizType,
                isAggregated: slideDataForRender.quizType === 'aggregated'
            });

            return (
                <QuizSlide
                    data={slideDataForRender}
                    onSubmit={handleCheckQuizAnswers}
                    showResults={showResults}
                />
            );
        }// Exercise slide - using merged data
        if (slideDataForRender.type === 'exercise') {
            console.log('🎯 About to render ExerciseSlide with data:', {
                id: slideDataForRender.id,
                type: slideDataForRender.type,
                title: slideDataForRender.title,
                description: slideDataForRender.description,
                questionsCount: slideDataForRender.questions?.length || 0,
                hasQuestions: !!slideDataForRender.questions?.length,
                contentCount: slideDataForRender.content?.length || 0,
                hasContent: !!slideDataForRender.content?.length,
                exerciseId: slideDataForRender.exerciseId,
                exerciseType: slideDataForRender.exerciseType,
                originalExercise: slideDataForRender.originalExercise?.id || 'none'
            });

            console.log('📝 Full slideDataForRender for exercise:', slideDataForRender);
            console.log('📋 Exercise questions detail:', slideDataForRender.questions);
            console.log('💡 Exercise answers detail:', slideDataForRender.answers);

            return (
                <ExerciseSlide
                    data={slideDataForRender}
                    onComplete={handleExerciseComplete} showResults={showResults}
                />
            );
        }

        // Content slide với giao diện đẹp
        return (
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    minHeight: 400,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    borderRadius: '20px',
                    mt: 2
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Nội dung slide bên trái */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" component="h2"
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.primary.dark,
                                mb: 3,
                            }}>
                            {slideDataForRender.title}
                        </Typography>

                        {slideDataForRender.content && (
                            <Box sx={{ mb: 3 }}>
                                {Array.isArray(slideDataForRender.content) ? (
                                    slideDataForRender.content.map((item, index) => (
                                        <Typography
                                            key={index}
                                            variant="body1"
                                            sx={{
                                                mb: 2,
                                                fontSize: '1.2rem',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {typeof item === 'string' ? item : JSON.stringify(item)}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '1.2rem',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {slideDataForRender.content}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Ô hình ảnh bên phải */}                    {imageBox}
                </Box>
            </Paper>
        );
    };

    //    // Debug: Periodic check of last position status (only in development)
    useEffect(() => {
        if (currentLessonId && process.env.NODE_ENV === 'development') {
            const checkPosition = () => {
                try {
                    const lastPosition = getLastSlidePosition(currentLessonId);
                    console.log('📊 Current position status:', {
                        lessonId: currentLessonId,
                        currentSlideIndex: slideIndex,
                        savedPosition: lastPosition,
                        isPositionValid: lastPosition && typeof lastPosition.slideIndex === 'number',
                        slideIndexMatch: lastPosition?.slideIndex === slideIndex
                    });
                } catch (error) {
                    console.error('❌ Error checking position status:', error);
                }
            };

            // Initial check
            checkPosition();

            // Periodic check every 10 seconds for debugging (reduced frequency)
            const interval = setInterval(checkPosition, 10000); return () => clearInterval(interval);
        }
    }, [currentLessonId]); // Remove slideIndex, getLastSlidePosition from deps to prevent frequent updates    // Get lesson progress data from Redux
    const currentLessonProgress = getLessonProgressPercentage(currentLessonId);
    const isCurrentLessonCompleted = isLessonCompleted(currentLessonId);
    const currentLessonScore = getLessonScore(currentLessonId);
    const lastSlidePosition = getLastSlidePositionForLesson(currentLessonId);

    // Debug lesson progress
    console.log('📊 Lesson Progress Debug:', {
        currentLessonId,
        currentLessonProgress,
        isCurrentLessonCompleted,
        currentLessonScore,
        lastSlidePosition,
        allLessonsData: Object.keys(allLessonsData)
    });

    // Get lesson status text
    const getLessonStatusText = () => {
        if (!currentLessonId) return 'Chưa bắt đầu';

        if (isCurrentLessonCompleted) {
            return currentLessonScore !== null ? `Hoàn thành (${currentLessonScore}%)` : 'Hoàn thành';
        }

        if (currentLessonProgress >= 75) return 'Gần hoàn thành';
        if (currentLessonProgress >= 50) return 'Đang học';
        if (currentLessonProgress >= 25) return 'Đã bắt đầu';
        if (currentLessonProgress > 0) return 'Đã xem';
        return 'Chưa bắt đầu';
    };

    // Handle go back to learning hub
    const handleBackToHub = () => {
        navigate('/app');
    };    // Handle continue from last position
    const handleContinueFromLast = () => {
        if (lastSlidePosition && lastSlidePosition.slideIndex > 0) {
            const targetSlideIndex = lastSlidePosition.slideIndex;
            setSlideIndex(targetSlideIndex);

            // Update progress when continuing from saved position
            if (currentLessonId) {
                console.log('🔄 Continuing from last position - updating progress');

                // Calculate progress based on target slide
                const newProgress = Math.round(((targetSlideIndex + 1) / totalSlides) * 100);
                console.log('📊 Progress restored:', {
                    targetSlide: targetSlideIndex,
                    totalSlides,
                    restoredProgress: newProgress + '%'
                });

                // Update Redux state
                updateField('currentSlideIndex', targetSlideIndex);
                updateField('progress', newProgress);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            {/* Progress Header with Vietnamese UI */}
            <Card sx={{
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                overflow: 'visible'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Tooltip title="Quay về Thư viện học tập">
                                <IconButton
                                    onClick={handleBackToHub}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                    }}
                                >
                                    <Home />
                                </IconButton>
                            </Tooltip>
                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {title || 'Bài học tương tác'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {subjectGrade || 'Học tập với niềm vui'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                                icon={isCurrentLessonCompleted ? <CheckCircle /> : <TrendingUp />}
                                label={getLessonStatusText()}
                                sx={{
                                    bgcolor: isCurrentLessonCompleted ? 'rgba(76,175,80,0.9)' : 'rgba(255,193,7,0.9)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />

                            {lastSlidePosition && lastSlidePosition.slideIndex > 0 && !isCurrentLessonCompleted && (
                                <Tooltip title={`Tiếp tục từ slide ${lastSlidePosition.slideIndex + 1}`}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Bookmark />}
                                        onClick={handleContinueFromLast}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                            borderRadius: '20px'
                                        }}
                                    >
                                        Tiếp tục
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>                {/* Progress Bar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: 'white', minWidth: 60 }}>
                            {(() => {
                                // Calculate real-time progress
                                const realTimeProgress = totalSlides > 0 ? Math.round(((slideIndex + 1) / totalSlides) * 100) : 0;
                                // Use Redux progress if available, otherwise use real-time calculation
                                const displayProgress = currentLessonProgress > 0 ? currentLessonProgress : realTimeProgress;
                                return displayProgress;
                            })()}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(() => {
                                // Calculate real-time progress
                                const realTimeProgress = totalSlides > 0 ? Math.round(((slideIndex + 1) / totalSlides) * 100) : 0;
                                // Use Redux progress if available, otherwise use real-time calculation
                                return currentLessonProgress > 0 ? currentLessonProgress : realTimeProgress;
                            })()}
                            sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    borderRadius: 4
                                }
                            }}
                        />
                        <Typography variant="body2" sx={{ color: 'white', minWidth: 80 }}>
                            Slide {slideIndex + 1}/{totalSlides}
                        </Typography>
                    </Box>

                    {/* Additional progress info */}
                    {currentLessonScore !== null && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Chip
                                icon={<Star />}
                                label={`Điểm số: ${currentLessonScore}%`}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255,215,0,0.9)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    )}
                </CardContent>        </Card>

            {/* Completion Alert */}
            {isCurrentLessonCompleted && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        border: '2px solid rgba(76, 175, 80, 0.3)'
                    }}
                    icon={<CheckCircle />}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                🎉 Chúc mừng! Bạn đã hoàn thành bài học!
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {currentLessonScore !== null && `Điểm số của bạn: ${currentLessonScore}%`}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleBackToHub}
                            startIcon={<Home />}
                            sx={{ ml: 2 }}
                        >
                            Về thư viện
                        </Button>
                    </Box>
                </Alert>
            )}

            {/* Progress bar */}
            <ProgressBar />

            {/* Slide header with image generation */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                px: 2
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: '#7c43bd',
                    fontFamily: 'Comic Sans MS, cursive'
                }}>
                    Slide {slideIndex + 1} / {totalSlides}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Nhập mô tả để tạo hình ảnh..."
                        value={imagePrompt}
                        onChange={e => setImagePrompt(e.target.value)}
                        sx={{ bgcolor: '#fff', borderRadius: 1, minWidth: 220 }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ fontWeight: 'bold', fontFamily: 'Comic Sans MS, cursive', px: 2, py: 1 }}
                        onClick={() => {
                            setImageUrl(imagePrompt ? `https://dummyimage.com/400x200/7c43bd/fff&text=${encodeURIComponent(imagePrompt)}` : "");
                        }}
                    >
                        Tạo hình ảnh
                    </Button>
                </Box>
            </Box>

            {/* Main slide content */}
            <Box sx={{
                bgcolor: 'white',
                p: 3,
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                position: 'relative',
                mt: 2,
                animation: 'fadeInUp 0.6s ease-out',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(124, 67, 189, 0.1)'
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #7c43bd, #667eea)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textShadow: 'none'
                    }}
                >
                    {title || "Bài học tương tác"}
                </Typography>

                {/* Display generated image if available */}
                {imageUrl && (
                    <Box sx={{
                        mb: 3,
                        textAlign: 'center',
                        animation: 'fadeInUp 0.8s ease-out'
                    }}>
                        <img
                            src={imageUrl}
                            alt="Generated content"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                border: '3px solid rgba(124, 67, 189, 0.2)'
                            }}
                        />
                    </Box>
                )}

                {/* Render slide content */}
                {renderSlideContent()}
            </Box>            {/* Navigation buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(124, 67, 189, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
                border: '1px solid rgba(124, 67, 189, 0.1)'
            }}>
                <Button
                    onClick={handlePrevSlide}
                    disabled={slideIndex === 0}
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        border: '2px solid',
                        borderColor: slideIndex === 0 ? 'rgba(0,0,0,0.12)' : '#7c43bd',
                        color: slideIndex === 0 ? 'rgba(0,0,0,0.26)' : '#7c43bd',
                        '&:hover': {
                            background: slideIndex === 0 ? 'transparent' : 'rgba(124, 67, 189, 0.1)',
                            transform: slideIndex === 0 ? 'none' : 'translateY(-2px)',
                            boxShadow: slideIndex === 0 ? 'none' : '0 4px 12px rgba(124, 67, 189, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Trước
                </Button>

                {/* Debug buttons for testing last position */}            <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                            const position = currentLessonId ? getLastSlidePosition(currentLessonId) : null;
                            console.log('🔍 Manual check - Last position:', position);
                            alert(`Last Position: ${position ? `Slide ${position.slideIndex + 1}` : 'None'}`);
                        }}
                        sx={{ fontSize: '10px', py: 0.5, px: 1 }}
                    >
                        Check Position
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => {
                            if (currentLessonId) {
                                saveLastSlidePosition(currentLessonId, slideIndex, currentSlideData?.id || `slide_${slideIndex}`);
                                console.log('💾 Manual save - Position saved');
                                alert(`Position saved: Slide ${slideIndex + 1}`);
                            }
                        }}
                        sx={{ fontSize: '10px', py: 0.5, px: 1 }}
                    >
                        Save Position
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={async () => {
                            try {
                                const progress = Math.round(((slideIndex + 1) / totalSlides) * 100);
                                await LearningAPI.updateSlidePosition(currentLessonId, slideIndex, currentSlideData?.id || `slide_${slideIndex}`, progress, currentUserId, totalSlides);
                                alert(`API sync success: Slide ${slideIndex + 1}, Progress ${progress}%`);
                            } catch (error) {
                                alert(`API sync failed: ${error.message}`);
                            }
                        }}
                        sx={{ fontSize: '10px', py: 0.5, px: 1 }}
                    >
                        API Sync
                    </Button>
                    <Chip
                        label={isSessionActive ? `Session: ${currentSessionId?.slice(-6) || 'None'}` : 'No Session'}
                        size="small"
                        color={isSessionActive ? 'success' : 'default'}
                        sx={{ fontSize: '9px', height: 20 }}
                    />
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #7c43bd, #667eea)',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(124, 67, 189, 0.3)'
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {slideIndex + 1} / {totalSlides}
                    </Typography>
                </Box>

                <Button
                    onClick={handleNextSlide}
                    disabled={slideIndex === totalSlides - 1}
                    endIcon={<ArrowForward />}
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        background: slideIndex === totalSlides - 1
                            ? 'rgba(0,0,0,0.12)'
                            : 'linear-gradient(135deg, #7c43bd, #667eea)',
                        '&:hover': {
                            background: slideIndex === totalSlides - 1
                                ? 'rgba(0,0,0,0.12)'
                                : 'linear-gradient(135deg, #667eea, #7c43bd)',
                            transform: slideIndex === totalSlides - 1 ? 'none' : 'translateY(-2px)',
                            boxShadow: slideIndex === totalSlides - 1
                                ? 'none'
                                : '0 6px 16px rgba(124, 67, 189, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Tiếp
                </Button>
            </Box>

            {/* Action buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: 2
            }}>
                <Fab
                    onClick={goFullScreen}
                    color="primary"
                    title="Toàn màn hình"
                    sx={{
                        background: 'linear-gradient(135deg, #7c43bd, #667eea)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #667eea, #7c43bd)',
                            transform: 'scale(1.1)',
                            boxShadow: '0 8px 20px rgba(124, 67, 189, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Fullscreen />
                </Fab>        </Box>
        </Container>
    );
};

export default KidsSlideshow;
