/**
 * ParentAPI Service
 * Handles all API calls related to parent dashboard functionality
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const PARENT_API_BASE = `${BASE_URL}/parent`;

class ParentAPI {
    /**
     * Helper method to make API requests with proper error handling
     */
    static async makeRequest(endpoint, options = {}) {
        const url = `${PARENT_API_BASE}${endpoint}`;
        
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
            console.log(`📡 ParentAPI Request: ${options.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body) : '');
            
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

            console.log(`✅ ParentAPI Response: ${url}`, data);
            return data;
        } catch (error) {
            console.error(`❌ ParentAPI Error: ${url}`, error);
            
            // If this is a network error, try to be more helpful
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error(`Network error: Cannot connect to backend server at ${url}. Make sure the server is running.`);
            }
            
            throw error;
        }
    }

    /**
     * Get list of children for the logged-in parent
     */
    static async getChildren() {
        return this.makeRequest('/children');
    }

    /**
     * Get progress overview for a specific child
     */
    static async getChildProgress(childId) {
        return this.makeRequest(`/children/${childId}/progress`);
    }

    /**
     * Get scores for a specific child and subject
     */
    static async getChildScores(childId, subject = null, limit = 5) {
        const queryParams = new URLSearchParams();
        if (subject) queryParams.append('subject', subject);
        if (limit) queryParams.append('limit', limit);
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.makeRequest(`/children/${childId}/scores${query}`);
    }

    /**
     * Add a new score for a child
     */
    static async addChildScore(childId, scoreData) {
        return this.makeRequest(`/children/${childId}/scores`, {
            method: 'POST',
            body: JSON.stringify(scoreData)
        });
    }

    /**
     * Get activity history for a specific child
     */
    static async getChildActivities(childId, options = {}) {
        const queryParams = new URLSearchParams();
        if (options.limit) queryParams.append('limit', options.limit);
        if (options.page) queryParams.append('page', options.page);
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.makeRequest(`/children/${childId}/activities${query}`);
    }

    /**
     * Get achievements for a specific child
     */
    static async getChildAchievements(childId) {
        return this.makeRequest(`/children/${childId}/achievements`);
    }

    /**
     * Get weekly report for a specific child
     */
    static async getWeeklyReport(childId) {
        return this.makeRequest(`/children/${childId}/weekly-report`);
    }

    /**
     * Get dashboard summary data
     */
    static async getDashboardSummary() {
        return this.makeRequest('/dashboard/summary');
    }

    /**
     * Get available subjects
     */
    static async getSubjects(childId) {
        return this.makeRequest(`/children/${childId}/subjects`);
    }

    /**
     * Get recent activities across all children
     */
    static async getRecentActivities(limit = 10) {
        return this.makeRequest(`/activities/recent?limit=${limit}`);
    }

    /**
     * Get goals for a specific child
     */
    static async getChildGoals(childId) {
        return this.makeRequest(`/children/${childId}/goals`);
    }

    /**
     * Update goals for a specific child
     */
    static async updateChildGoals(childId, goals) {
        return this.makeRequest(`/children/${childId}/goals`, {
            method: 'PUT',
            body: JSON.stringify(goals)
        });
    }

    /**
     * Get study time analytics for a specific child
     */
    static async getStudyTimeAnalytics(childId, period = 'week') {
        return this.makeRequest(`/children/${childId}/study-time?period=${period}`);
    }

    /**
     * Health check for parent API
     */
    static async healthCheck() {
        try {
            const response = await this.makeRequest('/dashboard/summary');
            return { status: 'ok', message: 'Parent API is working' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    /**
     * Utility method to format time duration
     */
    static formatDuration(milliseconds) {
        if (!milliseconds) return '0 phút';
        
        const minutes = Math.round(milliseconds / (1000 * 60));
        if (minutes < 60) {
            return `${minutes} phút`;
        }
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes === 0) {
            return `${hours} giờ`;
        }
        
        return `${hours} giờ ${remainingMinutes} phút`;
    }

    /**
     * Utility method to format relative time
     */
    static formatRelativeTime(date) {
        if (!date) return 'Chưa xác định';
        
        const now = new Date();
        const target = new Date(date);
        const diffMs = now - target;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMinutes < 1) return 'Vừa xong';
        if (diffMinutes < 60) return `${diffMinutes} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        
        return target.toLocaleDateString('vi-VN');
    }

    /**
     * Utility method to get score color based on value
     */
    static getScoreColor(score) {
        if (score >= 9) return 'success';
        if (score >= 7) return 'warning';
        return 'error';
    }

    /**
     * Utility method to get score level text
     */
    static getScoreLevel(score) {
        if (score >= 9) return 'Xuất sắc';
        if (score >= 8) return 'Giỏi';
        if (score >= 7) return 'Khá';
        if (score >= 6) return 'Trung bình';
        return 'Cần cải thiện';
    }

    /**
     * Utility method to calculate progress percentage
     */
    static calculateProgress(current, target) {
        if (!target || target === 0) return 0;
        return Math.min(100, Math.round((current / target) * 100));
    }

    /**
     * Get test/debug info
     */
    static getTestInfo() {
        return {
            baseUrl: BASE_URL,
            apiBase: PARENT_API_BASE,
            hasToken: !!localStorage.getItem('authToken'),
            timestamp: new Date().toISOString()
        };
    }
}

export default ParentAPI;
