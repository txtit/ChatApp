// Sample data for KidsSlideshow with QuizSlide and ExerciseSlide

export const sampleSlideData = {
  title: "Toán học vui cho trẻ em",
  subjectGrade: "Lớp 3 - Toán học",
  slides: [
    // Content slide
    {
      id: "slide_1",
      title: "Chào mừng đến với bài học toán",
      content: "Hôm nay chúng ta sẽ học về phép cộng và phép trừ. Hãy cùng bắt đầu nhé!",
      type: "content"
    },
    
    // Quiz slide
    {
      id: "slide_2",
      title: "Câu hỏi trắc nghiệm về phép cộng",
      description: "Hãy chọn đáp án đúng cho mỗi câu hỏi",
      type: "quiz",
      timeLimit: 5,
      questions: [
        {
          question: "5 + 3 = ?",
          options: ["6", "7", "8", "9"],
          correctOption: 2, // Index của đáp án đúng (8)
          explanation: "5 + 3 = 8. Khi cộng 5 với 3, ta được kết quả là 8."
        },
        {
          question: "10 + 7 = ?",
          options: ["15", "16", "17", "18"],
          correctOption: 2, // Index của đáp án đúng (17)
          explanation: "10 + 7 = 17. Cộng 10 với 7 ta được 17."
        },
        {
          question: "Nếu bạn có 4 quả táo và mẹ cho thêm 3 quả, bạn có tất cả bao nhiêu quả?",
          options: ["6 quả", "7 quả", "8 quả", "5 quả"],
          correctOption: 1, // Index của đáp án đúng (7 quả)
          explanation: "4 + 3 = 7. Bạn sẽ có tổng cộng 7 quả táo."
        }
      ]
    },
    
    // Exercise slide
    {
      id: "slide_3",
      title: "Bài tập phép trừ",
      description: "Hãy giải các bài tập sau và điền đáp án vào ô trống",
      type: "exercise",
      timeLimit: 10,
      difficulty: "Dễ",
      questions: [
        {
          question: "15 - 8 = ?",
          inputLabel: "Nhập kết quả",
          placeholder: "Ví dụ: 7",
          correctAnswer: "7",
          type: "number",
          hint: "Hãy đếm ngược từ 15, bớt đi 8 số",
          explanation: "15 - 8 = 7. Khi trừ 8 từ 15, ta được 7."
        },
        {
          question: "Lan có 12 cái kẹo. Lan đã ăn 5 cái. Hỏi Lan còn lại bao nhiêu cái kẹo?",
          inputLabel: "Số kẹo còn lại",
          placeholder: "Nhập số kẹo",
          correctAnswer: ["7", "7 cái", "7 kẹo"],
          type: "text",
          hint: "Dùng phép trừ: 12 - 5 = ?",
          explanation: "12 - 5 = 7. Lan còn lại 7 cái kẹo."
        },
        {
          question: "20 - 12 = ?",
          inputLabel: "Kết quả",
          placeholder: "Nhập đáp án",
          correctAnswer: "8",
          type: "number",
          hint: "Thử tính 20 - 10 trước, rồi trừ tiếp 2",
          explanation: "20 - 12 = 8. Ta có thể tính 20 - 10 = 10, rồi 10 - 2 = 8."
        }
      ]
    },
    
    // Another content slide
    {
      id: "slide_4",
      title: "Tuyệt vời!",
      content: "Bạn đã hoàn thành bài học rất tốt! Hãy tiếp tục luyện tập để giỏi toán hơn nhé!",
      type: "content"
    },
    
    // Advanced quiz
    {
      id: "slide_5",
      title: "Câu hỏi nâng cao",
      description: "Thử sức với những câu hỏi khó hơn",
      type: "quiz",
      timeLimit: 8,
      questions: [
        {
          question: "Nếu 5 + ? = 12, thì dấu ? là số nào?",
          options: ["5", "6", "7", "8"],
          correctOption: 2, // Index của đáp án đúng (7)
          explanation: "12 - 5 = 7. Vậy dấu ? là số 7."
        },
        {
          question: "Trong phép tính 15 - 8 + 3, kết quả là bao nhiêu?",
          options: ["8", "9", "10", "11"],
          correctOption: 2, // Index của đáp án đúng (10)
          explanation: "Tính từ trái sang phải: 15 - 8 = 7, rồi 7 + 3 = 10."
        }
      ]
    },
    
    // Mixed exercise
    {
      id: "slide_6",
      title: "Bài tập tổng hợp",
      description: "Kết hợp cả phép cộng và phép trừ",
      type: "exercise",
      timeLimit: 15,
      difficulty: "Trung bình",
      questions: [
        {
          question: "8 + 4 - 3 = ?",
          inputLabel: "Kết quả cuối cùng",
          placeholder: "Tính từng bước",
          correctAnswer: "9",
          type: "number",
          hint: "Tính từ trái sang phải: 8 + 4 trước, rồi trừ 3",
          explanation: "8 + 4 = 12, rồi 12 - 3 = 9."
        },
        {
          question: "Một lớp học có 25 học sinh. Hôm nay vắng 4 em, còn lại bao nhiêu em đi học?",
          inputLabel: "Số học sinh đi học",
          placeholder: "Nhập số học sinh",
          correctAnswer: ["21", "21 em", "21 học sinh"],
          type: "text",
          multiline: false,
          hint: "Dùng phép trừ để tìm số học sinh còn lại",
          explanation: "25 - 4 = 21. Có 21 em đi học."
        }
      ]
    }
  ]
};

export default sampleSlideData;
