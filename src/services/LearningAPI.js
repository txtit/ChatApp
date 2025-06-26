/**
 * LearningAPI Service
 * Handles all API calls related to learning progress, sessions, and exercises
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const LEARNING_API_BASE = `${BASE_URL}/learning`;

class LearningAPI {
    /**
     * Helper method to make API requests with proper error handling
     */    static async makeRequest(endpoint, options = {}) {
        const url = `${LEARNING_API_BASE}${endpoint}`;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        // Add Authorization header if user is logged in
        const token = localStorage.getItem('authToken');
        if (token) {
            defaultHeaders.Authorization = `Bearer ${token}`;
        }

        const config = {
            headers: { ...defaultHeaders, ...options.headers },
            ...options,
        };

        try {
            console.log(`📡 LearningAPI Request: ${options.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body) : '');
            
            const response = await fetch(url, config);
            
            // Check if response is HTML (404/500 page) instead of JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error(`❌ Non-JSON response from ${url}:`, text.substring(0, 200));
                throw new Error(`Server returned ${response.status}: Expected JSON but got ${contentType || 'unknown content type'}`);
            }

            const data = await response.json();

            if (!response.ok) {
                console.error(`❌ API Error ${response.status}:`, data);
                throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
            }

            console.log(`✅ LearningAPI Response: ${url}`, data);
            return data;
        } catch (error) {
            console.error(`❌ LearningAPI Error: ${url}`, error);
            
            // If this is a network error, try to be more helpful
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error(`Network error: Cannot connect to backend server at ${url}. Make sure the server is running.`);
            }
            
            throw error;
        }
    }    /**
     * Initialize progress for a lesson (called when starting a lesson)
     */
    static async initializeProgress(lessonId, totalSlides, userId = null) {
        const requestUserId = userId || this.getCurrentUserId();
        const requestBody = {
            userId: requestUserId,
            totalSlides,
            lessonTitle: `Lesson ${lessonId}`
        };
        
        console.log('🔍 InitializeProgress Debug:', {
            lessonId,
            requestBody,
            userIdLength: requestUserId?.length,
            isValidObjectId: requestUserId?.length === 24
        });
        
        return this.makeRequest(`/lessons/${lessonId}/initialize`, {
            method: 'POST',
            body: JSON.stringify(requestBody)
        });
    }/**
     * Update slide position (called when navigating between slides)
     */    static async updateSlidePosition(lessonId, slideIndex, slideId, progress = null, userId = null, totalSlides = null) {
        const requestUserId = userId || this.getCurrentUserId();
        const requestBody = {
            userId: requestUserId,
            slideIndex,
            slideId,
            progress,
            totalSlides // Thêm totalSlides để backend có thể tự khởi tạo progress nếu cần
        };
        
        console.log('🔍 UpdateSlidePosition Debug:', {
            lessonId,
            requestBody,
            userIdLength: requestUserId?.length,
            isValidObjectId: requestUserId?.length === 24,
            totalSlides
        });
        
        return this.makeRequest(`/lessons/${lessonId}/slide-position`, {
            method: 'PUT',
            body: JSON.stringify(requestBody)
        });
    }/**
     * Start a learning session (called when beginning to learn)
     */
    static async startLearningSession(lessonId, sessionType = 'study', userId = null) {
        return this.makeRequest(`/lessons/${lessonId}/sessions/start`, {
            method: 'POST',
            body: JSON.stringify({
                userId: userId || this.getCurrentUserId(),
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            })
        });
    }

    /**
     * End a learning session (called when finishing/exiting lesson)
     */
    static async endLearningSession(sessionId, completionStatus = 'partial', finalSlideIndex = null) {
        return this.makeRequest(`/sessions/${sessionId}/end`, {
            method: 'PUT',
            body: JSON.stringify({
                exitReason: completionStatus,
                finalProgress: finalSlideIndex !== null ? Math.round(((finalSlideIndex + 1) / 100) * 100) : null
            })
        });
    }    /**
     * Submit exercise/quiz result (called after completing exercise or quiz)
     */
    static async submitExerciseResult(lessonId, slideId, exerciseType, score, answers = null, userId = null) {
        return this.makeRequest(`/lessons/${lessonId}/exercises/submit`, {
            method: 'POST',
            body: JSON.stringify({
                userId: userId || this.getCurrentUserId(),
                exerciseId: slideId,
                score,
                type: exerciseType,
                answers,
                submittedAt: new Date().toISOString()
            })
        });
    }    /**
     * Get user's overall progress (for dashboard)
     */
    static async getUserProgress(userId = null) {
        const userIdParam = userId || this.getCurrentUserId();
        return this.makeRequest(`/users/${userIdParam}/progress`);
    }

    /**
     * Get progress for a specific lesson
     */
    static async getLessonProgress(lessonId, userId = null) {
        const userIdParam = userId || this.getCurrentUserId();
        return this.makeRequest(`/users/${userIdParam}/lessons/${lessonId}/progress`);
    }

    /**
     * Get user dashboard data (overall stats, recent activity, etc.)
     */
    static async getUserDashboard(userId = null) {
        const userIdParam = userId || this.getCurrentUserId();
        return this.makeRequest(`/users/${userIdParam}/dashboard`);
    }    /**
     * Bulk update progress (for syncing multiple lessons)
     */
    static async bulkUpdateProgress(progressData, userId = null) {
        return this.makeRequest('/progress/bulk-update', {
            method: 'POST',
            body: JSON.stringify({
                userId: userId || this.getCurrentUserId(),
                progressUpdates: progressData
            })
        });
    }

    /**
     * Reset progress for a lesson (admin/development use)
     */
    static async resetLessonProgress(lessonId, userId = null) {
        const userIdParam = userId || this.getCurrentUserId();
        return this.makeRequest(`/users/${userIdParam}/lessons/${lessonId}/progress`, {
            method: 'DELETE'
        });
    }    /**
     * Health check for learning API
     */
    static async healthCheck() {
        return this.makeRequest('/health');
    }

    /**
     * Clear test data and reset userId (for debugging)
     */
    static clearTestData() {
        localStorage.removeItem('defaultUserId');
        localStorage.removeItem('user');
        console.log('🧹 Cleared test data - new userId will be generated');
    }

    /**
     * Get test info for debugging
     */
    static getTestInfo() {
        const userId = this.getCurrentUserId();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        return {
            userId,
            userIdLength: userId?.length,
            isValidObjectId: userId?.length === 24,
            storedUser: user,
            baseUrl: BASE_URL,
            apiBase: LEARNING_API_BASE
        };
    }    /**
     * Get current user ID (implement based on your auth system)
     */
    static getCurrentUserId() {
        // Check multiple possible sources for userId
        console.log('🔍 Checking userId sources...');
        
        // 1. Check localStorage 'user_id' (seems to be the real source)
        const userIdFromStorage = localStorage.getItem('user_id');
        if (userIdFromStorage && userIdFromStorage.length === 24) {
            console.log('🔐 Using userId from localStorage.user_id:', userIdFromStorage);
            return userIdFromStorage;
        }
        
        // 2. Check user object in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userIdFromUserObj = user.id || user._id || user.userId;
        if (userIdFromUserObj && userIdFromUserObj.length === 24) {
            console.log('🔐 Using userId from localStorage.user object:', userIdFromUserObj);
            return userIdFromUserObj;
        }
        
        // 3. Check if there's a logged in user ID in any other storage
        const possibleKeys = ['userId', 'user_id', 'currentUserId', 'authUserId'];
        for (const key of possibleKeys) {
            const id = localStorage.getItem(key);
            if (id && id.length === 24) {
                console.log(`🔐 Using userId from localStorage.${key}:`, id);
                return id;
            }
        }
        
        // 4. If existing defaultUserId is valid, use it
        const defaultUserId = localStorage.getItem('defaultUserId');
        if (defaultUserId && defaultUserId.length === 24) {
            console.log('🔐 Using existing defaultUserId:', defaultUserId);
            return defaultUserId;
        }
        
        // 5. Generate a new MongoDB ObjectId-like string for testing
        const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
        const randomBytes = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const newUserId = timestamp + randomBytes;
        
        localStorage.setItem('defaultUserId', newUserId);
        console.log('🔐 Generated new MongoDB-compatible userId for testing:', newUserId);
        
        // Debug: Show all localStorage contents
        console.log('🔍 All localStorage contents:', {
            user_id: localStorage.getItem('user_id'),
            user: localStorage.getItem('user'),
            userId: localStorage.getItem('userId'),
            currentUserId: localStorage.getItem('currentUserId'),
            defaultUserId: localStorage.getItem('defaultUserId')
        });
        
        return newUserId;
    }/**
     * Sync Redux progress with backend (utility method)
     */
    static async syncProgressWithBackend(lessonId, reduxProgressData, userId = null) {
        try {
            console.log('🔄 Syncing Redux progress with backend:', { lessonId, reduxProgressData });
            
            // Get current backend progress
            const backendProgress = await this.getLessonProgress(lessonId, userId);
              // Compare and update if needed
            if (!backendProgress.data || reduxProgressData.slideIndex > (backendProgress.data.currentSlideIndex || 0)) {
                await this.updateSlidePosition(
                    lessonId,
                    reduxProgressData.slideIndex,
                    reduxProgressData.slideId,
                    reduxProgressData.progress,
                    userId,
                    reduxProgressData.totalSlides // Pass totalSlides from Redux
                );
                console.log('✅ Progress synced successfully');
            } else {
                console.log('📊 Backend progress is already up to date');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error syncing progress with backend:', error);
            return false;
        }
    }

    /**
     * Debounced slide position update (to avoid spam when user navigates quickly)
     */    static debounceUpdateSlidePosition = (() => {
        let timeoutId;
        return async (lessonId, slideIndex, slideId, progress, userId, totalSlides = null, delay = 1000) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    await this.updateSlidePosition(lessonId, slideIndex, slideId, progress, userId, totalSlides);
                    console.log('✅ Debounced slide position update completed');
                } catch (error) {
                    console.error('❌ Debounced slide position update failed:', error);
                }
            }, delay);
        };
    })();
}

export default LearningAPI;
