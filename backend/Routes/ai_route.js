const express = require('express');
const router = express.Router();
const aiController = require('../controlers/ai_controller');
const { isAdmin } = require('../middlewares/middlewares');

// Apply admin middleware to all AI routes
router.use(isAdmin);

// AI Service Management
router.post('/start', aiController.startAI);
router.post('/stop', aiController.stopAI);
router.get('/status', aiController.getAIStatus);
router.post('/reset', aiController.emergencyReset);

// AI Task Management
router.post('/task', aiController.addAITask);
router.post('/notify', aiController.triggerAutoNotification);
router.post('/product-management', aiController.triggerAutoProductManagement);
router.post('/health-check', aiController.triggerHealthCheck);
router.post('/user-analysis', aiController.triggerUserAnalysis);

// AI Monitoring and Analytics
router.get('/metrics', aiController.getAIMetrics);
router.get('/error-logs', aiController.getAIErrorLogs);
router.post('/configure', aiController.configureAI);

module.exports = router;