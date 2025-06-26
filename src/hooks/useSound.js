import { useRef, useCallback } from 'react';

const useSound = () => {
    const audioRefs = useRef({});

    // Preload audio files
    const preloadAudio = useCallback((soundName, src) => {
        if (!audioRefs.current[soundName]) {
            const audio = new Audio(src);
            audio.preload = 'auto';
            audio.volume = 0.7; // Default volume
            audioRefs.current[soundName] = audio;
        }
    }, []);

    // Play sound
    const playSound = useCallback((soundName) => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.currentTime = 0; // Reset to beginning
            audio.play().catch(error => {
                console.warn(`Could not play sound ${soundName}:`, error);
            });
        }
    }, []);

    // Stop sound
    const stopSound = useCallback((soundName) => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    // Set volume for a specific sound
    const setVolume = useCallback((soundName, volume) => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume));
        }
    }, []);

    // Play background music with loop
    const playBackgroundMusic = useCallback((soundName) => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            audio.loop = true;
            audio.volume = 0.3; // Lower volume for background music
            audio.play().catch(error => {
                console.warn(`Could not play background music ${soundName}:`, error);
            });
        }
    }, []);

    return {
        preloadAudio,
        playSound,
        stopSound,
        setVolume,
        playBackgroundMusic
    };
};

export default useSound;
