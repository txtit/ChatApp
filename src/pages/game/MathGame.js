import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import useSound from "../../hooks/useSound";

// === BACKGROUND ANIMATION COMPONENTS ===

// Component mây bay
const CloudSVG = ({ size = 60, opacity = 0.7 }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
        <ellipse cx="70" cy="35" rx="25" ry="15" fill="#ffffff" opacity={opacity} />
        <ellipse cx="45" cy="30" rx="20" ry="12" fill="#ffffff" opacity={opacity} />
        <ellipse cx="25" cy="35" rx="15" ry="10" fill="#ffffff" opacity={opacity} />
        <ellipse cx="60" cy="25" rx="18" ry="8" fill="#ffffff" opacity={opacity} />
    </svg>
);

// Component chim bay
const BirdSVG = ({ size = 24 }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 40 24">
        <path d="M5 12 Q15 8 20 12 Q25 8 35 12" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M8 12 Q12 10 16 12" stroke="#333" strokeWidth="1.5" fill="none" />
        <path d="M24 12 Q28 10 32 12" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
);

// Component mặt trời
const SunSVG = ({ size = 80 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="20" fill="#ffd54f" />
        <g stroke="#ffd54f" strokeWidth="3" opacity="0.8">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <line
                    key={angle}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="25"
                    transform={`rotate(${angle} 50 50)`}
                />
            ))}
        </g>
    </svg>
);

// Component cây
const TreeSVG = ({ size = 60 }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 50 60">
        <rect x="23" y="40" width="4" height="20" fill="#8d6e63" />
        <ellipse cx="25" cy="35" rx="12" ry="15" fill="#4caf50" />
        <ellipse cx="25" cy="25" rx="8" ry="10" fill="#66bb6a" />
        <ellipse cx="25" cy="30" rx="6" ry="8" fill="#81c784" />
    </svg>
);

// Component hoa
const FlowerSVG = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" fill="#ffeb3b" />
        {[0, 60, 120, 180, 240, 300].map(angle => (
            <ellipse
                key={angle}
                cx="12"
                cy="7"
                rx="2"
                ry="4"
                fill="#e91e63"
                transform={`rotate(${angle} 12 12)`}
            />
        ))}
    </svg>
);

// Component bướm
const ButterflyIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2l-1 1v6l1 1 1-1V3l-1-1z" fill="#333" />
        <ellipse cx="9" cy="8" rx="3" ry="4" fill="#ff9800" />
        <ellipse cx="15" cy="8" rx="3" ry="4" fill="#ff9800" />
        <ellipse cx="9" cy="16" rx="2" ry="3" fill="#f44336" />
        <ellipse cx="15" cy="16" rx="2" ry="3" fill="#f44336" />
        <circle cx="7" cy="6" r="1" fill="#fff" />
        <circle cx="17" cy="6" r="1" fill="#fff" />
    </svg>
);



const ObstacleSVG = () => (
    <svg width="30" height="30" viewBox="0 0 30 30">
        <rect x="5" y="10" width="20" height="15" rx="4" fill="#ff7043" />
        <rect x="10" y="5" width="10" height="8" rx="2" fill="#ffa726" />
    </svg>
);



const questions = [
    { text: '5 + 7 = ?', answer: 12 },
    { text: '9 - 4 = ?', answer: 5 },
    { text: '3 × 6 = ?', answer: 18 },
    { text: '16 ÷ 4 = ?', answer: 4 },
    { text: '8 + 2 = ?', answer: 10 },
    { text: '7 × 2 = ?', answer: 14 },
    { text: '15 - 9 = ?', answer: 6 },
    { text: '6 × 6 = ?', answer: 36 },
    { text: '20 ÷ 5 = ?', answer: 4 },
    { text: '10 + 11 = ?', answer: 21 },
];

// Hòn đá đẹp làm chướng ngại vật
const RockSVG = () => (
    <svg width="60" height="60" viewBox="0 0 60 60">
        <ellipse cx="30" cy="45" rx="26" ry="12" fill="#b0a18f" />
        <ellipse cx="30" cy="38" rx="20" ry="10" fill="#d6c7b0" />
        <ellipse cx="18" cy="44" rx="7" ry="4" fill="#a08c6d" opacity="0.7" />
        <ellipse cx="42" cy="46" rx="8" ry="3" fill="#8d7b5a" opacity="0.5" />
        <ellipse cx="35" cy="36" rx="4" ry="2" fill="#fff" opacity="0.2" />
        <ellipse cx="25" cy="40" rx="3" ry="1.5" fill="#fff" opacity="0.15" />
        <ellipse cx="30" cy="50" rx="18" ry="4" fill="#7a6a53" opacity="0.3" />
        <ellipse cx="50" cy="42" rx="3" ry="1.5" fill="#fff" opacity="0.12" />
    </svg>
);

const MathGame = () => {    // Sound hook for managing audio
    const { preloadAudio, playSound, stopSound, setVolume, playBackgroundMusic } = useSound(); const [gameStarted, setGameStarted] = useState(false); // Trạng thái game đã bắt đầu chưa
    const [carX, setCarX] = useState(80); // Bắt đầu từ 80px bên trái - xe chỉ chạy thẳng
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [questionResult, setQuestionResult] = useState(null); // true/false/null
    const [timeLeft, setTimeLeft] = useState(15); // Thời gian còn lại cho câu hỏi (15 giây)
    const timerRef = useRef(null); // Ref cho timer
    const requestRef = useRef();
    const [isMoving, setIsMoving] = useState(true); // kiểm soát animation
    const [backgroundX, setBackgroundX] = useState(0); const backgroundRef = useRef(0);
    const [isPassing, setIsPassing] = useState(false); // trạng thái vượt chướng ngại vật    // Preload all audio files when component mounts
    useEffect(() => {
        preloadAudio('background', require('../../assets/sound/background.mp3'));
        preloadAudio('correct', require('../../assets/sound/correct.mp3'));
        preloadAudio('wrong', require('../../assets/sound/wrong.mp3'));
        preloadAudio('crash', require('../../assets/sound/crash.mp3'));

        // Don't start background music automatically, wait for game to start
        // Cleanup: stop all sounds when component unmounts
        return () => {
            stopSound('background');
        };
    }, [preloadAudio, stopSound]);

    // Timer đếm ngược cho câu hỏi
    useEffect(() => {
        if (showQuestion && timeLeft > 0 && questionResult === null) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && showQuestion && questionResult === null) {
            // Hết thời gian - tự động trả lời sai
            handleTimeOut();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [showQuestion, timeLeft, questionResult]);

    // Xử lý khi hết thời gian
    const handleTimeOut = () => {
        setScore((s) => Math.max(0, s - 3)); // Trừ 3 điểm
        setQuestionResult(false);
        playSound('wrong');
        setTimeout(() => {
            setShowQuestion(false);
            setUserAnswer('');
            setQuestionResult(null);
            setTimeLeft(15); // Reset timer cho câu tiếp theo
            setCurrentQuestion((q) => q + 1);
            setPipes(prev => {
                const newPipes = [...prev];
                newPipes.shift();
                newPipes.push({ x: 1200, gapY: 120 + Math.random() * 200, hasTriggered: false });
                return newPipes;
            });
            setIsMoving(true);
        }, 1500);
    };

    // Animation cho hàng cây chạy
    useEffect(() => {
        // Hàng cây dừng khi gameOver hoặc showQuestion hoặc !isMoving hoặc chưa bắt đầu
        if (gameOver || showQuestion || !isMoving || !gameStarted) return;
        let running = true;
        function animateBg() {
            if (!running) return;
            backgroundRef.current -= 2;
            if (backgroundRef.current <= -800) backgroundRef.current = 0;
            setBackgroundX(backgroundRef.current);
            requestAnimationFrame(animateBg);
        }
        requestAnimationFrame(animateBg);
        return () => { running = false; };
    }, [gameOver, showQuestion, isMoving, gameStarted]);// Flappy Bird style: obstacle là cột, random chiều cao, có khoảng trống cho xe đi qua
    const [pipes, setPipes] = useState([
        { x: 900, gapY: 120 + Math.random() * 200, hasTriggered: false }
    ]);
    const pipeWidth = 60;
    const gapHeight = 140;
    const carWidth = 80;
    const carHeight = 40;
    const groundY = 80;    // Animation loop: pipes di chuyển sang trái, collision detection đơn giản và chính xác
    useEffect(() => {
        if (gameOver || showQuestion || !gameStarted) return;

        const animate = () => {
            setPipes((prevPipes) => {
                let newPipes = prevPipes.map(pipe => ({
                    ...pipe,
                    x: pipe.x - 4
                }));                // Tạo pipe mới khi pipe cũ ra khỏi màn hình
                if (newPipes[0].x < -pipeWidth) {
                    newPipes.shift();
                    newPipes.push({ x: 1200, gapY: 120 + Math.random() * 200, hasTriggered: false });
                }                // Collision detection: trigger when obstacle is approaching car's head
                const pipe = newPipes[0];
                const carFrontX = carX + carWidth;  // Front of the car (head)

                const pipeLeft = pipe.x;

                // Trigger collision when pipe is approaching the car's head (within detection distance)
                const detectionDistance = 150; // Distance ahead of car to trigger collision
                const isApproaching = pipeLeft <= carFrontX + detectionDistance && pipeLeft > carFrontX - 10;

                // Xe luôn va chạm vì không thể nhảy
                const isCollidingY = true;

                // Console log để debug
                if (isApproaching && isCollidingY && !showQuestion && !pipe.hasTriggered) {
                    // Mark this pipe as triggered
                    newPipes[0] = { ...pipe, hasTriggered: true };
                    // Reset timer khi bắt đầu câu hỏi mới
                    setTimeLeft(15);
                    setIsMoving(false);
                    setShowQuestion(true);
                    return newPipes; // Dừng animation tại đây
                }

                return newPipes;
            });

            if (!showQuestion) {
                requestRef.current = requestAnimationFrame(animate);
            }
        }; requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameOver, showQuestion, isMoving, gameStarted]);    // Khi trả lời câu hỏi
    const handleAnswer = () => {
        // Clear timer khi trả lời
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (parseInt(userAnswer) === questions[currentQuestion].answer) {
            // Trả lời đúng: cộng điểm và vượt qua chướng ngại vật
            setScore((s) => s + 5);
            setQuestionResult(true);
            // Play correct answer sound
            playSound('correct');
            setTimeout(() => {
                setShowQuestion(false);
                setUserAnswer('');
                setQuestionResult(null);
                setTimeLeft(15); // Reset timer cho câu tiếp theo
                setCurrentQuestion((q) => q + 1);
                // Xe vượt qua chướng ngại vật - xóa pipe hiện tại và tạo pipe mới
                setPipes(prev => {
                    const newPipes = [...prev];
                    newPipes.shift(); // Xóa pipe hiện tại
                    newPipes.push({ x: 1200, gapY: 120 + Math.random() * 200, hasTriggered: false });
                    return newPipes;
                });
                setIsMoving(true); // Tiếp tục game
            }, 1500);
        } else {
            // Trả lời sai: mất điểm và va chạm với chướng ngại vật
            setScore((s) => Math.max(0, s - 3)); // Trừ 3 điểm, không xuống dưới 0
            setQuestionResult(false);
            // Play wrong answer sound
            playSound('wrong');
            setTimeout(() => {
                setShowQuestion(false);
                setUserAnswer('');
                setQuestionResult(null);
                setTimeLeft(15); // Reset timer cho câu tiếp theo
                setCurrentQuestion((q) => q + 1);
                // Xe va chạm - vẫn xóa pipe để tiếp tục nhưng không được điểm
                setPipes(prev => {
                    const newPipes = [...prev];
                    newPipes.shift(); // Xóa pipe hiện tại
                    newPipes.push({ x: 1200, gapY: 120 + Math.random() * 200, hasTriggered: false });
                    return newPipes;
                });
                setIsMoving(true); // Tiếp tục game
            }, 1500);
        }
    };

    // Bắt đầu game
    const handleStartGame = () => {
        setGameStarted(true);
        setIsMoving(true);
        // Start background music when game starts
        setTimeout(() => {
            playBackgroundMusic('background');
        }, 500);
    };    // Chơi lại
    const handleRestart = () => {
        setGameStarted(false); // Reset về trạng thái chưa bắt đầu
        setCarX(80);
        setScore(0);
        setGameOver(false);
        setCurrentQuestion(0);
        setShowQuestion(false);
        setUserAnswer('');
        setQuestionResult(null);
        setIsMoving(false); // Dừng animation cho đến khi nhấn start
        setPipes([{ x: 900, gapY: 120 + Math.random() * 200, hasTriggered: false }]);
        setBackgroundX(0);
        backgroundRef.current = 0;

        // Stop background music
        stopSound('background');
    };// Kết thúc game khi hết câu hỏi
    useEffect(() => {
        if (currentQuestion >= questions.length) {
            setGameOver(true);
            setIsMoving(false);
            // Stop background music when game completes
            stopSound('background');
            // Play victory sound (using correct sound for completion)
            playSound('correct');
        }
    }, [currentQuestion, stopSound, playSound]); return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #FFE4B5 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                // CSS Animations
                '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0px)' }
                },
                '@keyframes drift': {
                    '0%': { transform: 'translateX(-100px)' },
                    '100%': { transform: 'translateX(100vw)' }
                },
                '@keyframes fly': {
                    '0%': { transform: 'translateX(-50px) translateY(0px)' },
                    '25%': { transform: 'translateX(25vw) translateY(-10px)' },
                    '50%': { transform: 'translateX(50vw) translateY(-5px)' },
                    '75%': { transform: 'translateX(75vw) translateY(-15px)' },
                    '100%': { transform: 'translateX(100vw) translateY(0px)' }
                },
                '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' }
                },
                '@keyframes sway': {
                    '0%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                    '100%': { transform: 'rotate(-5deg)' }
                }
            }}
        >
            {/* Animated Clouds - Drifting across screen */}
            <Box
                sx={{
                    position: "absolute",
                    top: 50,
                    left: 0,
                    animation: 'drift 25s linear infinite',
                    animationDelay: '0s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <img
                    src={require("../../assets/Images/cloud.png")}
                    alt="Background"
                    style={{ width: '38%', height: '38%', objectFit: 'cover' }}
                />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 120,
                    left: 0,
                    animation: 'drift 30s linear infinite',
                    animationDelay: '-5s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <img
                    src={require("../../assets/Images/cloud.png")}
                    alt="Background"
                    style={{ width: '28%', height: '38%', objectFit: 'cover' }}
                />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 200,
                    left: 0,
                    animation: 'drift 35s linear infinite',
                    animationDelay: '-10s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <img
                    src={require("../../assets/Images/cloud.png")}
                    alt="Background"
                    style={{ width: '28%', height: '18%', objectFit: 'cover' }}
                />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 80,
                    left: 0,
                    animation: 'drift 28s linear infinite',
                    animationDelay: '-15s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <img
                    src={require("../../assets/Images/cloud.png")}
                    alt="Background"
                    style={{ width: '26%', height: '10%', objectFit: 'cover' }}
                />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 180,
                    left: 0,
                    animation: 'drift 32s linear infinite',
                    animationDelay: '-20s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <img
                    src={require("../../assets/Images/cloud.png")}
                    alt="Background"
                    style={{ width: '15%', height: '25%', objectFit: 'cover' }}
                />
            </Box>

            {/* Animated Birds - Flying across screen */}
            <Box
                sx={{
                    position: "absolute",
                    top: 80,
                    left: 0,
                    animation: 'fly 18s linear infinite',
                    animationDelay: '0s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <BirdSVG size={30} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 150,
                    left: 0,
                    animation: 'fly 22s linear infinite',
                    animationDelay: '-8s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <BirdSVG size={25} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 250,
                    left: 0,
                    animation: 'fly 20s linear infinite',
                    animationDelay: '-12s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <BirdSVG size={28} />
            </Box>

            {/* Rotating Sun */}
            <Box
                sx={{
                    position: "absolute",
                    top: 30,
                    right: 50,
                    animation: 'rotate 15s linear infinite',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <SunSVG size={100} />
            </Box>

            {/* Swaying Trees at bottom */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 30,
                    animation: 'sway 4s ease-in-out infinite',
                    animationDelay: '0s',
                    transformOrigin: 'bottom center',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <TreeSVG size={70} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 15,
                    right: 40,
                    animation: 'sway 3.5s ease-in-out infinite',
                    animationDelay: '-1s',
                    transformOrigin: 'bottom center',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <TreeSVG size={80} />
            </Box>

            {/* Pulsing Flowers scattered at bottom */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 45,
                    left: 150,
                    animation: 'pulse 3s ease-in-out infinite',
                    animationDelay: '0s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={24} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 35,
                    left: 280,
                    animation: 'pulse 3.5s ease-in-out infinite',
                    animationDelay: '-1s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={20} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 50,
                    right: 200,
                    animation: 'pulse 2.8s ease-in-out infinite',
                    animationDelay: '-2s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={22} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 30,
                    right: 150,
                    animation: 'pulse 3.2s ease-in-out infinite',
                    animationDelay: '-1.5s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={18} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 40,
                    left: '50%',
                    animation: 'pulse 2.9s ease-in-out infinite',
                    animationDelay: '-0.5s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={25} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 55,
                    left: '35%',
                    animation: 'pulse 3.3s ease-in-out infinite',
                    animationDelay: '-2.5s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={21} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 25,
                    right: '35%',
                    animation: 'pulse 3.7s ease-in-out infinite',
                    animationDelay: '-1.8s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={19} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 48,
                    right: '65%',
                    animation: 'pulse 2.7s ease-in-out infinite',
                    animationDelay: '-3s',
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <FlowerSVG size={23} />
            </Box>

            {/* Flying Butterflies */}
            <Box
                sx={{
                    position: "absolute",
                    top: 180,
                    right: 100,
                    animation: 'float 4s ease-in-out infinite',
                    animationDelay: '0s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <ButterflyIcon size={32} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 120,
                    right: 250,
                    animation: 'float 3.5s ease-in-out infinite',
                    animationDelay: '-1s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <ButterflyIcon size={28} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 300,
                    right: 180,
                    animation: 'float 4.2s ease-in-out infinite',
                    animationDelay: '-2s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <ButterflyIcon size={30} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 220,
                    left: 200,
                    animation: 'float 3.8s ease-in-out infinite',
                    animationDelay: '-1.5s',
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            >
                <ButterflyIcon size={26} />
            </Box>

            {/* Game Container */}
            <Box
                sx={{
                    width: 800,
                    height: 520,
                    bgcolor: "#e3f2fd",
                    borderRadius: 6,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 10px 25px rgba(25,118,210,0.3)',
                    position: "relative",
                    overflow: "hidden",
                    border: "6px solid #1976d2",
                    zIndex: 10,
                    backdropFilter: 'blur(10px)',
                    background: 'linear-gradient(145deg, #e3f2fd 0%, #f8f9fa 100%)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(25,118,210,0.05) 0%, rgba(255,255,255,0.1) 100%)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }
                }}
            >
                {/* Đường */}
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        bottom: 60,
                        width: "100%",
                        height: 18,
                        bgcolor: "#757575",
                        borderRadius: 2
                    }}
                />
                {/* Hàng cây background */}
                <Box
                    sx={{
                        position: "absolute",
                        left: backgroundX,
                        bottom: 35,
                        width: 850,
                        height: 480,
                        zIndex: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={require("../../assets/Images/road2.png")}
                        alt="Background"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>
                {/* Lặp lại background để không bị trống khi cuộn */}
                <Box
                    sx={{
                        position: "absolute",
                        left: backgroundX + 800,
                        bottom: 36,
                        width: 850,
                        height: 480,
                        zIndex: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={require("../../assets/Images/road2.png")}
                        alt="Background"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>            {/* Xe ô tô */}
                <Box
                    sx={{
                        position: "absolute",
                        left: carX,
                        bottom: 60, // Xe luôn ở trên mặt đất, không nhảy
                        transition: "left 0.016s linear",
                        zIndex: 2,
                    }}
                >
                    <img src={require("../../assets/Images/cappy2.png")} alt="Car" width={220} height={100} />
                </Box>
                {/* Chướng ngại vật kiểu Flappy Bird */}
                {pipes.map((pipe, idx) => (
                    <React.Fragment key={idx}>
                        {/* Cột dưới (hòn đá dưới) */}
                        <Box key={"bot" + idx}
                            sx={{
                                position: "absolute",
                                left: pipe.x,
                                bottom: 64,
                                width: pipeWidth,
                                height: pipe.gapY,
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <RockSVG />
                        </Box>

                    </React.Fragment>
                ))}
                {/* Điểm số */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 18,
                        left: 40,
                        bgcolor: "#fffde7",
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        fontWeight: "bold",
                        color: "#1976d2",
                        fontSize: 28,
                        boxShadow: 2,
                    }}            >
                    Điểm: {score}
                </Box>            {/* Hướng dẫn chơi */}
                {!gameOver && !showQuestion && gameStarted && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 18,
                            right: 40,
                            bgcolor: "rgba(255,255,255,0.9)",
                            px: 2,
                            py: 1,
                            borderRadius: 3,
                            fontSize: 16,
                            color: "#1976d2",
                            fontWeight: "bold",
                            boxShadow: 2,
                            textAlign: "center",
                        }}
                    >
                        🚗 Xe tự động chạy<br />
                        📚 Trả lời đúng để vượt qua chướng ngại vật
                    </Box>
                )}

                {/* Màn hình bắt đầu */}
                {!gameStarted && !gameOver && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(227, 242, 253, 0.95)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 30,
                        }}
                    >
                        <Typography variant="h2" color="primary" fontWeight="bold" mb={2}>
                            🏎️ Math Racing Game
                        </Typography>
                        <Typography variant="h5" color="textSecondary" mb={1} textAlign="center">
                            Trả lời đúng câu hỏi toán để vượt qua chướng ngại vật!
                        </Typography>
                        <Typography variant="h6" color="textSecondary" mb={4} textAlign="center">
                            ✅ Đúng: +5 điểm | ❌ Sai: -3 điểm
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleStartGame}
                            sx={{
                                borderRadius: 4,
                                fontWeight: "bold",
                                fontSize: 32,
                                px: 6,
                                py: 3,
                                boxShadow: 4,
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.2s'
                                }
                            }}
                        >
                            🚀 Bắt đầu chơi!
                        </Button>
                    </Box>
                )}

                {/* Hiện câu hỏi thử thách khi tới chướng ngại vật */}
                {showQuestion && currentQuestion < questions.length && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 40,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 420,
                            zIndex: 10,
                            bgcolor: "rgba(255,255,255,0.98)",
                            p: 4,
                            borderRadius: 4,
                            textAlign: "center",
                            boxShadow: 6,
                        }}
                    >                    <Typography variant="h5" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold', fontSize: 32 }}>
                            Thử thách! (Câu {currentQuestion + 1}/{questions.length})
                        </Typography>

                        {/* Timer Display */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 15,
                                bgcolor: timeLeft <= 5 ? '#ff5722' : '#1976d2',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 3,
                                fontWeight: 'bold',
                                fontSize: 20,
                                minWidth: 60,
                                textAlign: 'center',
                                boxShadow: 3,
                                animation: timeLeft <= 5 ? 'pulse 1s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { transform: 'scale(1)' },
                                    '50%': { transform: 'scale(1.1)' },
                                    '100%': { transform: 'scale(1)' }
                                }
                            }}
                        >
                            ⏰ {timeLeft}s
                        </Box>                    <Typography variant="h4" sx={{ mb: 2, color: '#388e3c', fontWeight: 'bold' }}>
                            {questions[currentQuestion].text}
                        </Typography>

                        {/* Progress Bar for Timer */}
                        <Box
                            sx={{
                                width: '100%',
                                height: 8,
                                bgcolor: '#e0e0e0',
                                borderRadius: 4,
                                mb: 3,
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${(timeLeft / 15) * 100}%`,
                                    height: '100%',
                                    bgcolor: timeLeft <= 5 ? '#ff5722' : timeLeft <= 10 ? '#ff9800' : '#4caf50',
                                    borderRadius: 4,
                                    transition: 'all 0.3s ease',
                                    animation: timeLeft <= 3 ? 'flash 0.5s infinite alternate' : 'none',
                                    '@keyframes flash': {
                                        '0%': { opacity: 1 },
                                        '100%': { opacity: 0.5 }
                                    }
                                }}
                            />
                        </Box>
                        <input
                            type="number"
                            value={userAnswer}
                            onChange={e => setUserAnswer(e.target.value)}
                            style={{ fontSize: 28, padding: 12, borderRadius: 10, border: '2px solid #1976d2', marginBottom: 18, width: 180, textAlign: 'center' }}
                            disabled={questionResult !== null}
                        />
                        <br />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAnswer}
                            disabled={userAnswer === '' || questionResult !== null}
                            sx={{ mt: 2, fontWeight: 'bold', borderRadius: 3, fontSize: 22, px: 4, py: 1.5 }}
                        >
                            Trả lời
                        </Button>                    {questionResult === true && (
                            <Typography sx={{ mt: 3, color: 'green', fontWeight: 'bold', fontSize: 22 }}>
                                🎉 Chính xác! +5 điểm - Xe vượt qua an toàn!
                            </Typography>
                        )}
                        {questionResult === false && (
                            <Typography sx={{ mt: 3, color: 'red', fontWeight: 'bold', fontSize: 22 }}>
                                💥 Sai rồi! -3 điểm - Xe va chạm chướng ngại vật!
                            </Typography>
                        )}
                    </Box>
                )}            {/* Game Over */}
                {gameOver && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 80,
                            left: 0,
                            width: "100%",
                            textAlign: "center",
                            zIndex: 20,
                        }}
                    >
                        <Typography variant="h4" color="primary" fontWeight="bold" mb={1}>
                            🏁 Hoàn thành!
                        </Typography>
                        <Typography variant="h5" color="textPrimary" fontWeight="bold" mb={1}>
                            Tổng điểm: {score}/{questions.length * 5}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" mb={3}>
                            {score >= questions.length * 3 ? "🌟 Xuất sắc!" : score >= questions.length * 2 ? "👍 Tốt lắm!" : "💪 Cố gắng thêm nhé!"}
                        </Typography>                    <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleRestart}
                            sx={{ borderRadius: 4, fontWeight: "bold", fontSize: 24, px: 4, py: 1.5 }}
                        >                        🔄 Chơi lại
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>);
};

export default MathGame;