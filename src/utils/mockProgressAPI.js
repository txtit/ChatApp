// Mock API cho progress endpoints
// Trong thực tế, bạn sẽ thay thế bằng actual API endpoints

// Mock database simulation
let progressDatabase = new Map();

export const progressAPI = {
    // Save progress to database
    saveProgress: async (progressData) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const key = `${progressData.userId}_${progressData.slideId}`;
            const savedData = {
                ...progressData,
                id: key,
                savedAt: new Date().toISOString(),
                version: (progressDatabase.get(key)?.version || 0) + 1
            };

            progressDatabase.set(key, savedData);

            console.log('Progress saved to mock DB:', savedData);
            return {
                success: true,
                data: savedData,
                message: 'Progress saved successfully'
            };
        } catch (error) {
            throw new Error('Failed to save progress: ' + error.message);
        }
    },

    // Load progress from database
    loadProgress: async (userId, slideId) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const key = `${userId}_${slideId}`;
            const data = progressDatabase.get(key);

            if (!data) {
                return {
                    success: false,
                    message: 'No progress found',
                    data: null
                };
            }

            console.log('Progress loaded from mock DB:', data);
            return {
                success: true,
                data: data,
                message: 'Progress loaded successfully'
            };
        } catch (error) {
            throw new Error('Failed to load progress: ' + error.message);
        }
    },

    // Get all progress for a user
    getUserProgress: async (userId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 400));

            const userProgress = [];
            for (let [key, value] of progressDatabase) {
                if (key.startsWith(userId + '_')) {
                    userProgress.push(value);
                }
            }

            return {
                success: true,
                data: userProgress,
                message: 'User progress retrieved successfully'
            };
        } catch (error) {
            throw new Error('Failed to get user progress: ' + error.message);
        }
    },

    // Delete progress
    deleteProgress: async (userId, slideId) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            const key = `${userId}_${slideId}`;
            const deleted = progressDatabase.delete(key);

            return {
                success: deleted,
                message: deleted ? 'Progress deleted successfully' : 'Progress not found'
            };
        } catch (error) {
            throw new Error('Failed to delete progress: ' + error.message);
        }
    },

    // Bulk save multiple progress records
    bulkSaveProgress: async (progressArray) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const results = [];
            for (const progressData of progressArray) {
                const result = await progressAPI.saveProgress(progressData);
                results.push(result);
            }

            return {
                success: true,
                data: results,
                message: `Bulk saved ${results.length} progress records`
            };
        } catch (error) {
            throw new Error('Failed to bulk save progress: ' + error.message);
        }
    }
};

// Export để sử dụng trong testing hoặc development
export const mockProgressDatabase = progressDatabase;
