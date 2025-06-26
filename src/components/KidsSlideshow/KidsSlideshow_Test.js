import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/Store';
import KidsSlideshow from './KidsSlideshow';

// Simple test data
const testData = {
    title: "Test Quiz và Exercise",
    subjectGrade: "Lớp 3 - Test",
    slides: [
        {
            id: "slide_1",
            title: "Quiz Test",
            description: "Test quiz slide",
            type: "quiz",
            questions: [
                {
                    question: "2 + 2 = ?",
                    options: ["3", "4", "5", "6"],
                    correctOption: 1,
                    explanation: "2 + 2 = 4"
                }
            ]
        },
        {
            id: "slide_2", 
            title: "Exercise Test",
            description: "Test exercise slide",
            type: "exercise",
            questions: [
                {
                    question: "3 + 3 = ?",
                    correctAnswer: "6",
                    type: "number",
                    hint: "Cộng 3 với 3",
                    explanation: "3 + 3 = 6"
                }
            ]
        }
    ]
};

const KidsSlideshow_Test = () => {
    return (
        <Provider store={store}>
            <div style={{ padding: '20px' }}>
                <h2>Test KidsSlideshow Quiz & Exercise</h2>
                <KidsSlideshow data={testData} />
            </div>
        </Provider>
    );
};

export default KidsSlideshow_Test;
