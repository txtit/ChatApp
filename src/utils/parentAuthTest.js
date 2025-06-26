/**
 * Parent Dashboard Authentication Test Script
 * 
 * Chạy script này trong browser console để test các trường hợp xác thực khác nhau
 */

console.log('🧪 Parent Dashboard Auth Test Suite');

// Test utilities
const ParentAuthTest = {
    
    // Test Case 1: User chưa đăng nhập hoàn toàn
    testNotLoggedIn() {
        console.log('📝 Test Case 1: User chưa đăng nhập hoàn toàn');
        
        // Clear tất cả auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('parentToken');
        localStorage.removeItem('isLoggin');
        localStorage.removeItem('user_id');
        
        // Clear Redux store (sẽ cần dispatch logout action)
        console.log('✅ Cleared all auth data');
        console.log('👉 Refresh trang để thấy UI "Cần đăng nhập với quyền phụ huynh"');
    },
    
    // Test Case 2: User đã login với role khác (student/admin)
    testLoggedInOtherRole() {
        console.log('📝 Test Case 2: User đã login với role khác');
        
        // Simulate user đã login với role khác
        localStorage.setItem('isLoggin', 'true');
        localStorage.setItem('user_id', 'student-123');
        
        // Nhưng không có parent token
        localStorage.removeItem('authToken');
        localStorage.removeItem('parentToken');
        
        // Sẽ cần simulate Redux state isLoggedIn = true
        console.log('✅ Simulated logged in user without parent token');
        console.log('👉 Bạn cần dispatch login action để set Redux isLoggedIn = true');
        console.log('👉 Sau đó refresh trang để thấy UI "Chuyển đổi tài khoản"');
    },
    
    // Test Case 3: User có parent token hợp lệ
    testValidParentAuth() {
        console.log('📝 Test Case 3: User có parent token hợp lệ');
        
        // Create valid parent token
        const token = 'test-token-' + Date.now();
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggin', 'true');
        localStorage.setItem('user_id', 'parent-123');
        
        console.log('✅ Created valid parent token:', token);
        console.log('👉 Refresh trang để thấy Parent Dashboard hoạt động');
    },
    
    // Test Case 4: User có parent token hết hạn/invalid
    testInvalidParentToken() {
        console.log('📝 Test Case 4: User có parent token hết hạn');
        
        // Set invalid token
        localStorage.setItem('authToken', 'invalid-token-12345');
        localStorage.setItem('isLoggin', 'true');
        localStorage.setItem('user_id', 'parent-123');
        
        console.log('✅ Set invalid parent token');
        console.log('👉 Refresh trang → API call sẽ fail 401 → UI "Token hết hạn"');
    },
    
    // Utility: Reset to clean state
    reset() {
        console.log('🧹 Resetting to clean state...');
        localStorage.clear();
        console.log('✅ LocalStorage cleared');
        console.log('👉 Refresh trang để thấy trạng thái clean');
    },
    
    // Utility: Check current auth state
    checkCurrentState() {
        console.log('🔍 Current Auth State:');
        console.log('- authToken:', localStorage.getItem('authToken') || 'None');
        console.log('- isLoggin:', localStorage.getItem('isLoggin') || 'None');
        console.log('- user_id:', localStorage.getItem('user_id') || 'None');
        
        // Try to check Redux state if available
        if (window.store && window.store.getState) {
            const authState = window.store.getState().auth;
            console.log('- Redux isLoggedIn:', authState?.isLoggedIn || 'Unknown');
            console.log('- Redux token:', authState?.token ? 'Present' : 'None');
        } else {
            console.log('- Redux state: Not accessible');
        }
    },
    
    // Run all test cases in sequence (với delay)
    async runAllTests() {
        console.log('🚀 Running All Test Cases...');
        
        console.log('\n=== Test 1: Not Logged In ===');
        this.testNotLoggedIn();
        
        await this.delay(2000);
        
        console.log('\n=== Test 2: Logged In Other Role ===');
        this.testLoggedInOtherRole();
        
        await this.delay(2000);
        
        console.log('\n=== Test 3: Valid Parent Auth ===');
        this.testValidParentAuth();
        
        await this.delay(2000);
        
        console.log('\n=== Test 4: Invalid Parent Token ===');
        this.testInvalidParentToken();
        
        console.log('\n✅ All tests completed. Refresh trang để thấy từng trường hợp.');
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Export to global scope
window.ParentAuthTest = ParentAuthTest;

console.log('✅ Test suite loaded!');
console.log('📖 Available commands:');
console.log('  ParentAuthTest.testNotLoggedIn()      - Test user chưa login');
console.log('  ParentAuthTest.testLoggedInOtherRole() - Test user login role khác');
console.log('  ParentAuthTest.testValidParentAuth()   - Test parent token hợp lệ');
console.log('  ParentAuthTest.testInvalidParentToken() - Test token hết hạn');
console.log('  ParentAuthTest.checkCurrentState()     - Kiểm tra state hiện tại');
console.log('  ParentAuthTest.reset()                 - Reset về trạng thái clean');
console.log('  ParentAuthTest.runAllTests()           - Chạy tất cả test');

// Quick start
console.log('\n🎯 Quick Start:');
console.log('1. ParentAuthTest.checkCurrentState() - Xem state hiện tại');
console.log('2. ParentAuthTest.testValidParentAuth() - Tạo token test');
console.log('3. Refresh trang để thấy dashboard hoạt động!');
