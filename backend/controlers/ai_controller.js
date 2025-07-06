const aiService = require("../Services/ai_service");

/**
 * AI Controller for handling AI-related HTTP requests
 * Provides endpoints for AI autonomous task management
 */

/**
 * Start the AI service
 */
async function startAI(req, res) {
    try {
        await aiService.start();
        res.status(200).json({ 
            message: "AI service started successfully",
            status: aiService.getStatus()
        });
    } catch (error) {
        console.error("Error starting AI service:", error);
        res.status(500).json({ 
            error: "Failed to start AI service",
            details: error.message 
        });
    }
}

/**
 * Stop the AI service
 */
async function stopAI(req, res) {
    try {
        aiService.stop();
        res.status(200).json({ 
            message: "AI service stopped successfully"
        });
    } catch (error) {
        console.error("Error stopping AI service:", error);
        res.status(500).json({ 
            error: "Failed to stop AI service",
            details: error.message 
        });
    }
}

/**
 * Get AI service status
 */
async function getAIStatus(req, res) {
    try {
        const status = aiService.getStatus();
        res.status(200).json(status);
    } catch (error) {
        console.error("Error getting AI status:", error);
        res.status(500).json({ 
            error: "Failed to get AI status",
            details: error.message 
        });
    }
}

/**
 * Add a task to the AI service
 */
async function addAITask(req, res) {
    try {
        const { type, data, priority } = req.body;
        
        if (!type) {
            return res.status(400).json({ 
                error: "Task type is required"
            });
        }

        const taskId = aiService.addTask({
            type,
            data: data || {},
            priority: priority || 'normal'
        });

        res.status(201).json({
            message: "Task added to AI queue",
            taskId,
            type,
            priority: priority || 'normal'
        });
    } catch (error) {
        console.error("Error adding AI task:", error);
        res.status(500).json({ 
            error: "Failed to add AI task",
            details: error.message 
        });
    }
}

/**
 * Trigger autonomous user notification
 */
async function triggerAutoNotification(req, res) {
    try {
        const { message, criteria, timing } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: "Message is required"
            });
        }

        const taskId = aiService.addTask({
            type: 'auto_notify_users',
            data: {
                message,
                criteria: criteria || { all: true },
                timing: timing || 'immediate'
            },
            priority: 'high'
        });

        res.status(201).json({
            message: "Autonomous notification task queued",
            taskId,
            notification: message
        });
    } catch (error) {
        console.error("Error triggering auto notification:", error);
        res.status(500).json({ 
            error: "Failed to trigger autonomous notification",
            details: error.message 
        });
    }
}

/**
 * Trigger autonomous product management
 */
async function triggerAutoProductManagement(req, res) {
    try {
        const { action, productData, criteria } = req.body;
        
        if (!action) {
            return res.status(400).json({ 
                error: "Action is required"
            });
        }

        const taskId = aiService.addTask({
            type: 'auto_product_management',
            data: {
                action,
                productData: productData || {},
                criteria: criteria || {}
            },
            priority: 'normal'
        });

        res.status(201).json({
            message: "Autonomous product management task queued",
            taskId,
            action
        });
    } catch (error) {
        console.error("Error triggering auto product management:", error);
        res.status(500).json({ 
            error: "Failed to trigger autonomous product management",
            details: error.message 
        });
    }
}

/**
 * Trigger system health check
 */
async function triggerHealthCheck(req, res) {
    try {
        const taskId = aiService.addTask({
            type: 'system_health_check',
            data: {},
            priority: 'high'
        });

        res.status(201).json({
            message: "System health check task queued",
            taskId
        });
    } catch (error) {
        console.error("Error triggering health check:", error);
        res.status(500).json({ 
            error: "Failed to trigger system health check",
            details: error.message 
        });
    }
}

/**
 * Trigger user behavior analysis
 */
async function triggerUserAnalysis(req, res) {
    try {
        const { analysisType, timeRange, criteria } = req.body;
        
        const taskId = aiService.addTask({
            type: 'user_behavior_analysis',
            data: {
                analysisType: analysisType || 'general',
                timeRange: timeRange || '24h',
                criteria: criteria || {}
            },
            priority: 'low'
        });

        res.status(201).json({
            message: "User behavior analysis task queued",
            taskId,
            analysisType: analysisType || 'general'
        });
    } catch (error) {
        console.error("Error triggering user analysis:", error);
        res.status(500).json({ 
            error: "Failed to trigger user behavior analysis",
            details: error.message 
        });
    }
}

/**
 * Get AI performance metrics
 */
async function getAIMetrics(req, res) {
    try {
        const status = aiService.getStatus();
        
        const metrics = {
            uptime: status.uptime,
            performance: status.performance,
            errorRate: status.errorRate,
            queueSize: status.taskQueue,
            isRunning: status.isRunning,
            timestamp: Date.now()
        };

        res.status(200).json(metrics);
    } catch (error) {
        console.error("Error getting AI metrics:", error);
        res.status(500).json({ 
            error: "Failed to get AI metrics",
            details: error.message 
        });
    }
}

/**
 * Configure AI settings
 */
async function configureAI(req, res) {
    try {
        const { maxRetries, retryDelay, healthCheckInterval, errorThreshold } = req.body;
        
        // Update AI configuration
        if (maxRetries !== undefined) aiService.config.maxRetries = maxRetries;
        if (retryDelay !== undefined) aiService.config.retryDelay = retryDelay;
        if (healthCheckInterval !== undefined) aiService.config.healthCheckInterval = healthCheckInterval;
        if (errorThreshold !== undefined) aiService.config.errorThreshold = errorThreshold;

        res.status(200).json({
            message: "AI configuration updated",
            config: aiService.config
        });
    } catch (error) {
        console.error("Error configuring AI:", error);
        res.status(500).json({ 
            error: "Failed to configure AI",
            details: error.message 
        });
    }
}

/**
 * Get AI error logs
 */
async function getAIErrorLogs(req, res) {
    try {
        const { limit = 50 } = req.query;
        
        const errorLogs = aiService.errorLog.slice(-limit);
        
        res.status(200).json({
            errorLogs,
            totalErrors: aiService.errorLog.length,
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error("Error getting AI error logs:", error);
        res.status(500).json({ 
            error: "Failed to get AI error logs",
            details: error.message 
        });
    }
}

/**
 * Emergency AI reset
 */
async function emergencyReset(req, res) {
    try {
        aiService.stop();
        
        // Clear task queue and error logs
        aiService.taskQueue = [];
        aiService.errorLog = [];
        
        // Reset performance metrics
        aiService.performance = {
            tasksCompleted: 0,
            tasksError: 0,
            averageResponseTime: 0,
            uptime: Date.now()
        };
        
        await aiService.start();
        
        res.status(200).json({
            message: "AI service emergency reset completed",
            status: aiService.getStatus()
        });
    } catch (error) {
        console.error("Error during emergency reset:", error);
        res.status(500).json({ 
            error: "Failed to perform emergency reset",
            details: error.message 
        });
    }
}

module.exports = {
    startAI,
    stopAI,
    getAIStatus,
    addAITask,
    triggerAutoNotification,
    triggerAutoProductManagement,
    triggerHealthCheck,
    triggerUserAnalysis,
    getAIMetrics,
    configureAI,
    getAIErrorLogs,
    emergencyReset
};