import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeLesson } from '../redux/slices/progessV2';

/**
 * Hook to ensure Redux progress state is properly initialized
 * Use this at the top level of your app to prevent undefined state errors
 */
export const useProgressInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize basic lesson structure to prevent undefined errors
        dispatch(initializeLesson({
            totalSlides: 0,
            lessonId: 'app-init',
            lessonTitle: 'Application Initialized'
        }));
    }, [dispatch]);
};

export default useProgressInitializer;
