/**
 * Test Authentication Utility
 * Script để test đăng nhập và lấy token cho Parent Dashboard
 */

const BASE_URL = 'http://localhost:3000';

// Function to simulate login and get token
export const testLogin = async () => {
    try {
        // Thử đăng nhập với user mẫu
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'parent@example.com',
                password: 'password123'
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();
        console.log('✅ Login successful:', loginData);

        // Lưu token vào localStorage
        if (loginData.token) {
            localStorage.setItem('authToken', loginData.token);
            console.log('✅ Token saved to localStorage');
            return loginData.token;
        } else if (loginData.accessToken) {
            localStorage.setItem('accessToken', loginData.accessToken);
            console.log('✅ Access token saved to localStorage');
            return loginData.accessToken;
        } else {
            throw new Error('No token in response');
        }

    } catch (error) {
        console.error('❌ Login error:', error);
        return null;
    }
};

// Function to create a test token manually (for development)
export const createTestToken = () => {
    // Tạo token giả cho mục đích test
    const testToken = 'test-token-' + Date.now();
    localStorage.setItem('authToken', testToken);
    console.log('🔧 Test token created:', testToken);
    return testToken;
};

// Function to check if user is authenticated
export const checkAuth = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    console.log('🔍 Current token:', token ? '✅ Token exists' : '❌ No token');
    return !!token;
};

// Function to clear auth
export const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    console.log('🗑️ Auth cleared');
};

// Browser console helper functions
if (typeof window !== 'undefined') {
    window.testAuth = {
        login: testLogin,
        createTestToken,
        checkAuth,
        clearAuth
    };
    console.log('🛠️ Test auth utilities available in window.testAuth');
}
