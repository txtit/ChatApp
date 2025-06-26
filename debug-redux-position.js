// Test script for debugging Redux last position functionality
// Run this in browser console to test

console.log('🧪 Starting Redux Last Position Test...');

// Test 1: Check if Redux store exists
try {
    const store = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.store : null;
    if (store) {
        console.log('✅ Redux store found');
        const state = store.getState();
        console.log('📊 Current Redux state:', state);

        // Check progessV2 slice
        if (state.progessV2) {
            console.log('✅ progessV2 slice found');
            console.log('📊 Last slide positions:', state.progessV2.lastSlidePositions);
        } else {
            console.log('❌ progessV2 slice not found');
        }
    } else {
        console.log('❌ Redux store not found');
    }
} catch (error) {
    console.error('❌ Error accessing Redux store:', error);
}

// Test 2: Check localStorage
try {
    console.log('🔍 Checking localStorage...');
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
        const parsed = JSON.parse(persistRoot);
        console.log('✅ Redux persist data found');

        if (parsed.progessV2) {
            const progessV2 = JSON.parse(parsed.progessV2);
            console.log('📊 Persisted progessV2:', progessV2);
            console.log('📊 Persisted last positions:', progessV2.lastSlidePositions);
        } else {
            console.log('❌ progessV2 not found in persisted data');
        }
    } else {
        console.log('❌ No persist:root found in localStorage');
    }
} catch (error) {
    console.error('❌ Error checking localStorage:', error);
}

// Test 3: Manual dispatch test (if store available)
try {
    if (window.store) {
        console.log('🧪 Testing manual dispatch...');

        // Dispatch a test action
        window.store.dispatch({
            type: 'progessV2/setLastSlidePosition',
            payload: {
                lessonId: 'test-lesson-123',
                slideIndex: 5,
                slideId: 'test-slide-5'
            }
        });

        console.log('✅ Test dispatch completed');

        // Check if it was saved
        const newState = window.store.getState();
        console.log('📊 State after dispatch:', newState.progessV2?.lastSlidePositions);

    } else {
        console.log('⚠️ Window.store not available for manual testing');
    }
} catch (error) {
    console.error('❌ Error in manual dispatch test:', error);
}

console.log('🏁 Redux Last Position Test Complete');
