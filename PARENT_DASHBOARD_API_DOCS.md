# Parent Dashboard API Documentation

## Overview
This document describes the API endpoints for the Parent Dashboard functionality, allowing parents to monitor their children's learning progress, scores, activities, and achievements.

## Base URL
```
http://localhost:3000/api/parent
```

## Authentication
All endpoints require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get Children List
**GET** `/children`

Returns a list of all children associated with the authenticated parent.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "670ddbe80ef54ecd786783fe",
      "name": "Nguyễn Minh An",
      "avatar": "MA",
      "grade": "Lớp 5A",
      "age": 8,
      "role": "student",
      "lastActivity": "2024-06-25T10:00:00Z",
      "relationship": "parent",
      "permissions": {
        "viewProgress": true,
        "viewScores": true,
        "addScores": true,
        "setGoals": true,
        "viewActivities": true
      }
    }
  ]
}
```

### 2. Get Child Progress
**GET** `/children/:childId/progress`

Returns learning progress overview for a specific child.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudyTime": 145,
    "weeklyGoal": 180,
    "completedLessons": 12,
    "totalLessons": 15,
    "lastActivity": "2024-06-25T08:00:00Z",
    "currentStreak": 5,
    "totalLessonsCompleted": 24
  }
}
```

### 3. Get Child Scores
**GET** `/children/:childId/scores?subject=math&limit=5`

Returns scores for a specific child, optionally filtered by subject.

**Query Parameters:**
- `subject` (optional): Filter by subject (math, english, science, vietnamese)
- `limit` (optional): Number of recent scores to return (default: 5)

**Response (with subject):**
```json
{
  "success": true,
  "data": {
    "subject": "math",
    "scores": [9.5, 8.0, 7.5, 9.0, 8.5],
    "average": 8.5,
    "trend": "improving",
    "lastScore": 9.5,
    "lastAssessmentDate": "2024-06-25T08:00:00Z"
  }
}
```

**Response (all subjects):**
```json
{
  "success": true,
  "data": [
    {
      "subject": "math",
      "subjectName": "Toán học",
      "averageScore": 8.5,
      "totalAssessments": 15,
      "lastActivity": "2024-06-25T08:00:00Z"
    }
  ]
}
```

### 4. Add Child Score
**POST** `/children/:childId/scores`

Adds a new score for a child.

**Request Body:**
```json
{
  "subject": "math",
  "subjectName": "Toán học",
  "score": 9.5,
  "maxScore": 10,
  "assessmentType": "test",
  "notes": "Bài kiểm tra giữa kỳ"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "score_id",
    "userId": "child_id",
    "subject": "math",
    "score": 9.5,
    "createdAt": "2024-06-25T10:00:00Z"
  },
  "message": "Đã thêm điểm thành công"
}
```

### 5. Get Child Activities
**GET** `/children/:childId/activities?limit=20&page=1`

Returns learning activity history for a specific child.

**Query Parameters:**
- `limit` (optional): Number of activities per page (default: 20)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_id",
        "type": "test",
        "activity": "Hoàn thành bài kiểm tra Toán",
        "subject": "math",
        "subjectName": "Toán học",
        "score": 9.5,
        "maxScore": 10,
        "duration": 30,
        "timestamp": "2024-06-25T08:00:00Z",
        "lessonId": "lesson_id"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 6. Get Child Achievements
**GET** `/children/:childId/achievements`

Returns achievements earned by a specific child.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "math_excellence",
      "title": "Toán học xuất sắc",
      "description": "Đạt điểm trung bình trên 8.5 trong 5 bài kiểm tra liên tiếp",
      "icon": "🏆",
      "earnedDate": "2024-06-20T00:00:00Z",
      "category": "academic"
    }
  ]
}
```

### 7. Get Weekly Report
**GET** `/children/:childId/weekly-report`

Returns weekly learning report for a specific child.

**Response:**
```json
{
  "success": true,
  "data": {
    "weekStart": "2024-06-19",
    "weekEnd": "2024-06-25",
    "studyTimeTarget": 180,
    "studyTimeActual": 145,
    "studyTimePercentage": 80.6,
    "lessonsCompleted": 3,
    "averageScores": {
      "math": 8.5,
      "english": 8.2
    },
    "improvements": [
      "Điểm Toán tăng 0.3 so với tuần trước",
      "Hoàn thành đúng hạn 100% bài tập"
    ],
    "concerns": [
      "Thời gian học chưa đạt mục tiêu tuần"
    ]
  }
}
```

### 8. Get Dashboard Summary
**GET** `/dashboard/summary`

Returns overall dashboard summary for the parent.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalChildren": 2,
    "activeToday": 1,
    "weeklyStudyTime": 240,
    "averageProgress": 75.5,
    "recentAchievements": 3,
    "pendingAssignments": 2
  }
}
```

### 9. Get Available Subjects
**GET** `/children/:childId/subjects`

Returns list of available subjects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "math",
      "name": "Toán học",
      "color": "#FF6B6B"
    },
    {
      "id": "english",
      "name": "Tiếng Anh",
      "color": "#4ECDC4"
    }
  ]
}
```

### 10. Get Recent Activities (All Children)
**GET** `/activities/recent?limit=10`

Returns recent activities across all children of the parent.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "childId": "child_id",
      "childName": "Nguyễn Minh An",
      "activity": "Hoàn thành bài kiểm tra Toán",
      "score": 9.5,
      "subject": "Toán học",
      "timestamp": "2024-06-25T08:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Error Codes:
- `400` - Bad Request (Missing required fields)
- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (No permission to access resource)
- `404` - Not Found (Child or resource not found)
- `500` - Internal Server Error

## Assessment Types

Valid values for `assessmentType`:
- `test` - Bài kiểm tra
- `homework` - Bài tập về nhà
- `practice` - Luyện tập
- `game` - Trò chơi học tập
- `quiz` - Câu hỏi trắc nghiệm
- `exercise` - Bài tập
- `exam` - Thi cử

## Subject IDs

Valid subject IDs:
- `math` - Toán học
- `english` - Tiếng Anh
- `science` - Khoa học
- `vietnamese` - Tiếng Việt
- `history` - Lịch sử
- `geography` - Địa lý
- `art` - Mỹ thuật
- `music` - Âm nhạc
- `pe` - Thể dục

## Testing

### Running the Seed Script
To populate the database with sample data for testing:

```bash
cd chat-server
node scripts/seedParentDashboard.js
```

### Sample Parent Account
After seeding, you can use this account for testing:
- Email: `parent@example.com`
- Password: `password123`

### Sample Children
- Child 1: `child1@example.com` (Nguyễn Minh An, Lớp 3A)
- Child 2: `child2@example.com` (Trần Thị Bảo, Lớp 4B)

## Frontend Integration

Use the `ParentAPI` service class in your React components:

```javascript
import ParentAPI from '../services/ParentAPI';

// Get children
const children = await ParentAPI.getChildren();

// Get child progress
const progress = await ParentAPI.getChildProgress(childId);

// Add new score
await ParentAPI.addChildScore(childId, {
  subject: 'math',
  subjectName: 'Toán học',
  score: 9.5,
  assessmentType: 'test'
});
```
