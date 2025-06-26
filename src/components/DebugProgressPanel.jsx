import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllLessonsData,
  selectLessonProgress,
  selectCurrentSlide,
  selectLastSlidePositions,
  clearAllLessonsData,
  clearLessonData,
  resetProgress,
  initializeLesson,
  setCurrentSlide,
  setLastSlidePosition,
  markSlideCompleted
} from "../redux/slices/progessV2";

const DebugProgressPanel = () => {
  const dispatch = useDispatch();
  // Selectors để xem state hiện tại
  const allLessonsData = useSelector(selectAllLessonsData);
  const lessonProgress = useSelector(selectLessonProgress);
  const currentSlide = useSelector(selectCurrentSlide);
  const lastPositions = useSelector(selectLastSlidePositions);

  // Debug functions
  const handleClearAllLessons = () => {
    dispatch(clearAllLessonsData());
    console.log("🧹 Cleared all lessons data");
  };
  const handleClearLesson = lessonId => {
    dispatch(clearLessonData({ lessonId }));
    console.log(`🧹 Cleared lesson ${lessonId}`);
  };

  const handleResetProgress = () => {
    dispatch(resetProgress());
    console.log("🔄 Reset all progress");
  };

  // Test functions
  const handleTestInitLesson = () => {
    dispatch(
      initializeLesson({
        totalSlides: 5,
        lessonId: "683ab3a52651632e975a79c2",
        lessonTitle: "Test Lesson for Debugging"
      })
    );
    console.log("🧪 Initialized test lesson");
  };

  const handleTestSetSlide = () => {
    dispatch(
      setCurrentSlide({
        id: "slide-test-001",
        title: "Test Slide 1",
        content: "This is a test slide",
        type: "content",
        lessonId: "683ab3a52651632e975a79c2"
      })
    );
    console.log("🧪 Set test slide");
  };

  const handleTestLastPosition = () => {
    dispatch(
      setLastSlidePosition({
        lessonId: "683ab3a52651632e975a79c2",
        slideIndex: 2,
        slideId: "slide-test-003"
      })
    );
    console.log("🧪 Set test last position");
  };

  const handleTestMarkCompleted = () => {
    dispatch(
      markSlideCompleted({
        lessonId: "683ab3a52651632e975a79c2",
        slideId: "slide-test-001",
        score: 95
      })
    );
    console.log("🧪 Marked slide as completed");
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #007bff",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
        margin: "20px",
        fontFamily: "monospace"
      }}
    >
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>
        🔧 Redux Progress Debug Panel
      </h2>

      {/* Control Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "#28a745" }}>🧹 Clear Actions</h3>{" "}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={handleClearAllLessons}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffc107",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Clear All Lessons
          </button>
          <button
            onClick={() => handleClearLesson("683ab3a52651632e975a79c2")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#fd7e14",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Clear Test Lesson
          </button>
          <button
            onClick={handleResetProgress}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "white"
            }}
          >
            Reset All Progress
          </button>
        </div>
      </div>

      {/* Test Actions */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "#007bff" }}>🧪 Test Actions</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={handleTestInitLesson}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "white"
            }}
          >
            Init Test Lesson
          </button>
          <button
            onClick={handleTestSetSlide}
            style={{
              padding: "8px 16px",
              backgroundColor: "#17a2b8",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "white"
            }}
          >
            Set Test Slide
          </button>
          <button
            onClick={handleTestLastPosition}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6f42c1",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "white"
            }}
          >
            Set Last Position
          </button>
          <button
            onClick={handleTestMarkCompleted}
            style={{
              padding: "8px 16px",
              backgroundColor: "#20c997",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "white"
            }}
          >
            Mark Completed
          </button>
        </div>
      </div>

      {/* State Display */}
      <div>
        <h3 style={{ color: "#6c757d" }}>📊 Current State</h3>
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ color: "#007bff" }}>Current Slide:</h4>
          <pre
            style={{
              backgroundColor: "#e9ecef",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "12px",
              overflow: "auto"
            }}
          >
            {JSON.stringify(currentSlide, null, 2)}
          </pre>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ color: "#28a745" }}>Lesson Progress:</h4>
          <pre
            style={{
              backgroundColor: "#e9ecef",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "12px",
              overflow: "auto"
            }}
          >
            {JSON.stringify(lessonProgress, null, 2)}
          </pre>
        </div>{" "}
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ color: "#ffc107" }}>All Lessons Data:</h4>
          <pre
            style={{
              backgroundColor: "#e9ecef",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "12px",
              overflow: "auto",
              maxHeight: "200px"
            }}
          >
            {JSON.stringify(allLessonsData, null, 2)}
          </pre>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ color: "#6f42c1" }}>Last Positions:</h4>
          <pre
            style={{
              backgroundColor: "#e9ecef",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "12px",
              overflow: "auto"
            }}
          >
            {JSON.stringify(lastPositions, null, 2)}
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#d1ecf1",
          borderRadius: "4px",
          borderLeft: "4px solid #bee5eb"
        }}
      >
        <h4 style={{ color: "#0c5460" }}>📝 Instructions:</h4>{" "}
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#0c5460" }}>
          <li>Click "Clear All Lessons" để xóa hết dữ liệu lessons</li>
          <li>Click "Reset All Progress" để reset toàn bộ về ban đầu</li>
          <li>
            Sử dụng các "Test Actions" để tạo dữ liệu thử nghiệm với lesson ID:
            683ab3a52651632e975a79c2
          </li>
          <li>Quan sát "Current State" để xem thay đổi</li>
          <li>Check console.log để xem debug messages</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugProgressPanel;
