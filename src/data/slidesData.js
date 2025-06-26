// Sample data for testing KidsSlideshow with imagePrompt
export const sampleSlidesData = {
    title: "Từ có 'em'",
    subjectGrade: "Lớp 1 - Tiếng Việt",
    slides: [
        {
            id: "slide_1",
            type: "title",
            title: "Từ có 'em'"
        },
        {
            id: "slide_2",
            type: "content",
            title: "Từ có 'em'",
            content: [
                "Hôm nay chúng ta sẽ học về những từ có chứa 'em'",
                "Ví dụ: gem (viên ngọc), stem (thân cây)"
            ],
            imagePrompt: "Images of a gem and a plant stem."
        },
        {
            id: "slide_3",
            type: "content",
            title: "Thêm ví dụ",
            content: [
                "Các từ khác có 'em': remember, September, November"
            ],
            imagePrompt: "Calendar showing September and November months with autumn leaves"
        }, {
            id: "slide_4",
            type: "exercise",
            title: "Bài tập",
            exerciseId: "ex_words_1",
            imagePrompt: "Children doing homework with pencils and books"
        },
        {
            id: "slide_5",
            type: "quiz",
            title: "Kiểm tra kiến thức",
            quizId: "quiz_words_1",
            imagePrompt: "Students taking a quiz in classroom"
        }
    ],
    exercises: [
        {
            id: "ex_words_1",
            questions: [
                "Viết một từ có chứa 'em'",
                "Stem có nghĩa là gì?"
            ],
            answers: [
                "gem",
                "thân cây"
            ]
        }],
    quizzes: [
        {
            id: "quiz_words_1",
            questions: [
                {
                    question: "'Gem' có nghĩa là gì?",
                    options: ["Viên ngọc", "Thân cây", "Tháng", "Ghi nhớ"],
                    correctOption: 0
                },
                {
                    question: "Từ nào có chứa 'em'?",
                    options: ["Cat", "Dog", "September", "House"],
                    correctOption: 2
                },
                {
                    question: "'Remember' có nghĩa là gì?",
                    options: ["Quên", "Ghi nhớ", "Chạy", "Ăn"],
                    correctOption: 1
                }
            ]
        }
    ]
};
