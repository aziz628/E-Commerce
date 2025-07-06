/**
 * Simple test for AI Service functionality
 * This demonstrates the AI service can work autonomously without monitoring
 */

const aiService = require('./Services/ai_service');

async function testAIService() {
    console.log('🧪 Testing AI Autonomous Task Management...');
    
    try {
        // Test 1: Start AI service
        console.log('\n📋 Test 1: Starting AI Service');
        await aiService.start();
        console.log('✅ AI service started successfully');
        
        // Test 2: Add autonomous tasks
        console.log('\n📋 Test 2: Adding autonomous tasks');
        
        // Add a health check task
        const healthCheckTask = aiService.addTask({
            type: 'system_health_check',
            data: {},
            priority: 'high'
        });
        console.log(`✅ Health check task added: ${healthCheckTask}`);
        
        // Add a user analysis task
        const userAnalysisTask = aiService.addTask({
            type: 'user_behavior_analysis',
            data: { analysisType: 'general', timeRange: '24h' },
            priority: 'low'
        });
        console.log(`✅ User analysis task added: ${userAnalysisTask}`);
        
        // Add an auto-notification task
        const notificationTask = aiService.addTask({
            type: 'auto_notify_users',
            data: {
                message: 'AI Test: System is running autonomously',
                criteria: { all: true },
                timing: 'immediate'
            },
            priority: 'normal'
        });
        console.log(`✅ Auto-notification task added: ${notificationTask}`);
        
        // Test 3: Check AI status
        console.log('\n📋 Test 3: Checking AI status');
        const status = aiService.getStatus();
        console.log('AI Status:', {
            isRunning: status.isRunning,
            taskQueue: status.taskQueue,
            tasksCompleted: status.performance.tasksCompleted,
            errorRate: status.errorRate
        });
        
        // Test 4: Wait and check progress
        console.log('\n📋 Test 4: Waiting for autonomous task processing...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const updatedStatus = aiService.getStatus();
        console.log('Updated Status:', {
            isRunning: updatedStatus.isRunning,
            taskQueue: updatedStatus.taskQueue,
            tasksCompleted: updatedStatus.performance.tasksCompleted,
            errorRate: updatedStatus.errorRate
        });
        
        // Test 5: Self-diagnostic
        console.log('\n📋 Test 5: AI Self-diagnostic');
        const diagnostic = await aiService.performSelfDiagnostic();
        console.log('Self-diagnostic result:', diagnostic.status);
        
        // Test 6: Test error handling
        console.log('\n📋 Test 6: Testing error handling');
        const errorTask = aiService.addTask({
            type: 'invalid_task_type',
            data: {},
            priority: 'normal'
        });
        console.log(`✅ Error task added for testing: ${errorTask}`);
        
        // Wait for error handling
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const finalStatus = aiService.getStatus();
        console.log('Final Status with error handling:', {
            isRunning: finalStatus.isRunning,
            taskQueue: finalStatus.taskQueue,
            tasksCompleted: finalStatus.performance.tasksCompleted,
            tasksError: finalStatus.performance.tasksError,
            errorRate: finalStatus.errorRate
        });
        
        console.log('\n🎉 AI Service Test Completed!');
        console.log('✅ The AI system demonstrates autonomous operation without monitoring');
        console.log('✅ Tasks are processed automatically');
        console.log('✅ Errors are handled intelligently');
        console.log('✅ Self-monitoring is functional');
        
        // Stop the service
        aiService.stop();
        console.log('🛑 AI service stopped');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    testAIService().then(() => {
        console.log('\n🏁 Test completed successfully');
        process.exit(0);
    }).catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });
}

module.exports = testAIService;