/**
 * AI Dashboard JavaScript
 * Handles AI service management and monitoring
 */

let aiStatusInterval;
let metricsInterval;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start periodic updates
    startPeriodicUpdates();
});

/**
 * Initialize the AI dashboard
 */
async function initializeDashboard() {
    console.log('🤖 Initializing AI Dashboard...');
    
    // Initial data load
    await Promise.all([
        updateAIStatus(),
        updateMetrics(),
        updateErrorLogs()
    ]);
    
    console.log('✅ AI Dashboard initialized');
}

/**
 * Setup event listeners for AI controls
 */
function setupEventListeners() {
    // AI Control buttons
    document.getElementById('startAI').addEventListener('click', startAI);
    document.getElementById('stopAI').addEventListener('click', stopAI);
    document.getElementById('resetAI').addEventListener('click', resetAI);
    document.getElementById('healthCheck').addEventListener('click', triggerHealthCheck);
    document.getElementById('userAnalysis').addEventListener('click', triggerUserAnalysis);
    document.getElementById('refreshMetrics').addEventListener('click', refreshMetrics);
    
    // Forms
    document.getElementById('autoNotificationForm').addEventListener('submit', handleAutoNotification);
    document.getElementById('autoProductForm').addEventListener('submit', handleAutoProduct);
}

/**
 * Start AI service
 */
async function startAI() {
    const button = document.getElementById('startAI');
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<div class="loading"></div> Starting...';
        button.disabled = true;
        
        const response = await fetch('/ai/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('AI service started successfully!', 'success');
            await updateAIStatus();
        } else {
            showAlert(data.error || 'Failed to start AI service', 'danger');
        }
    } catch (error) {
        console.error('Error starting AI:', error);
        showAlert('Error starting AI service', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Stop AI service
 */
async function stopAI() {
    const button = document.getElementById('stopAI');
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<div class="loading"></div> Stopping...';
        button.disabled = true;
        
        const response = await fetch('/ai/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('AI service stopped successfully!', 'warning');
            await updateAIStatus();
        } else {
            showAlert(data.error || 'Failed to stop AI service', 'danger');
        }
    } catch (error) {
        console.error('Error stopping AI:', error);
        showAlert('Error stopping AI service', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Reset AI service
 */
async function resetAI() {
    if (!confirm('Are you sure you want to perform an emergency reset? This will clear all tasks and restart the AI service.')) {
        return;
    }
    
    const button = document.getElementById('resetAI');
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<div class="loading"></div> Resetting...';
        button.disabled = true;
        
        const response = await fetch('/ai/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('AI service reset successfully!', 'info');
            await Promise.all([
                updateAIStatus(),
                updateMetrics(),
                updateErrorLogs()
            ]);
        } else {
            showAlert(data.error || 'Failed to reset AI service', 'danger');
        }
    } catch (error) {
        console.error('Error resetting AI:', error);
        showAlert('Error resetting AI service', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Trigger health check
 */
async function triggerHealthCheck() {
    const button = document.getElementById('healthCheck');
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<div class="loading"></div> Checking...';
        button.disabled = true;
        
        const response = await fetch('/ai/health-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Health check queued successfully!', 'info');
        } else {
            showAlert(data.error || 'Failed to queue health check', 'danger');
        }
    } catch (error) {
        console.error('Error triggering health check:', error);
        showAlert('Error triggering health check', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Trigger user analysis
 */
async function triggerUserAnalysis() {
    const button = document.getElementById('userAnalysis');
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<div class="loading"></div> Analyzing...';
        button.disabled = true;
        
        const response = await fetch('/ai/user-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('User analysis queued successfully!', 'info');
        } else {
            showAlert(data.error || 'Failed to queue user analysis', 'danger');
        }
    } catch (error) {
        console.error('Error triggering user analysis:', error);
        showAlert('Error triggering user analysis', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Handle autonomous notification form
 */
async function handleAutoNotification(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const message = formData.get('message');
    const timing = formData.get('timing');
    
    if (!message.trim()) {
        showAlert('Please enter a message', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/ai/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                message: message,
                timing: timing,
                criteria: { all: true }
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Autonomous notification queued successfully!', 'success');
            e.target.reset();
        } else {
            showAlert(data.error || 'Failed to queue notification', 'danger');
        }
    } catch (error) {
        console.error('Error queuing notification:', error);
        showAlert('Error queuing notification', 'danger');
    }
}

/**
 * Handle auto product management form
 */
async function handleAutoProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const action = formData.get('action');
    const productDataStr = formData.get('productData');
    
    let productData = {};
    if (productDataStr.trim()) {
        try {
            productData = JSON.parse(productDataStr);
        } catch (error) {
            showAlert('Invalid JSON in product data', 'warning');
            return;
        }
    }
    
    try {
        const response = await fetch('/ai/product-management', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                action: action,
                productData: productData,
                criteria: {}
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Product management task queued successfully!', 'success');
            e.target.reset();
        } else {
            showAlert(data.error || 'Failed to queue product management task', 'danger');
        }
    } catch (error) {
        console.error('Error queuing product management:', error);
        showAlert('Error queuing product management task', 'danger');
    }
}

/**
 * Update AI status display
 */
async function updateAIStatus() {
    try {
        const response = await fetch('/ai/status', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const statusElement = document.getElementById('aiStatus');
            const statusCard = statusElement.closest('.card');
            
            if (data.isRunning) {
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Running';
                statusCard.classList.remove('ai-stopped');
                statusCard.classList.add('ai-running');
            } else {
                statusElement.innerHTML = '<i class="fas fa-times-circle"></i> Stopped';
                statusCard.classList.remove('ai-running');
                statusCard.classList.add('ai-stopped');
            }
            
            // Update basic metrics
            document.getElementById('tasksCompleted').textContent = data.performance.tasksCompleted;
            document.getElementById('avgResponseTime').textContent = Math.round(data.performance.averageResponseTime) + 'ms';
            document.getElementById('errorRate').textContent = (data.errorRate * 100).toFixed(1) + '%';
            
        } else {
            console.error('Failed to get AI status:', data);
        }
    } catch (error) {
        console.error('Error updating AI status:', error);
        document.getElementById('aiStatus').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
    }
}

/**
 * Update metrics display
 */
async function updateMetrics() {
    try {
        const response = await fetch('/ai/metrics', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('taskQueue').textContent = data.queueSize;
            document.getElementById('errorRateDetailed').textContent = (data.errorRate * 100).toFixed(1) + '%';
            document.getElementById('uptime').textContent = formatUptime(data.uptime);
        } else {
            console.error('Failed to get metrics:', data);
        }
    } catch (error) {
        console.error('Error updating metrics:', error);
    }
}

/**
 * Update error logs display
 */
async function updateErrorLogs() {
    try {
        const response = await fetch('/ai/error-logs?limit=10', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const errorLogsContainer = document.getElementById('errorLogs');
            
            if (data.errorLogs.length === 0) {
                errorLogsContainer.innerHTML = '<p class="text-muted">No error logs available</p>';
            } else {
                let html = '<table class="table table-striped"><thead><tr><th>Time</th><th>Context</th><th>Error</th></tr></thead><tbody>';
                
                data.errorLogs.forEach(log => {
                    html += `<tr>
                        <td>${new Date(log.timestamp).toLocaleString()}</td>
                        <td><span class="badge bg-secondary">${log.context}</span></td>
                        <td>${log.error}</td>
                    </tr>`;
                });
                
                html += '</tbody></table>';
                errorLogsContainer.innerHTML = html;
            }
        } else {
            console.error('Failed to get error logs:', data);
        }
    } catch (error) {
        console.error('Error updating error logs:', error);
    }
}

/**
 * Refresh all metrics
 */
async function refreshMetrics() {
    const button = document.getElementById('refreshMetrics');
    const originalText = button.innerHTML;
    
    try {
        button.innerHTML = '<div class="loading"></div> Refreshing...';
        button.disabled = true;
        
        await Promise.all([
            updateAIStatus(),
            updateMetrics(),
            updateErrorLogs()
        ]);
        
        showAlert('Metrics refreshed successfully!', 'success');
    } catch (error) {
        console.error('Error refreshing metrics:', error);
        showAlert('Error refreshing metrics', 'danger');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

/**
 * Start periodic updates
 */
function startPeriodicUpdates() {
    // Update AI status every 5 seconds
    aiStatusInterval = setInterval(updateAIStatus, 5000);
    
    // Update metrics every 10 seconds
    metricsInterval = setInterval(updateMetrics, 10000);
}

/**
 * Stop periodic updates
 */
function stopPeriodicUpdates() {
    if (aiStatusInterval) {
        clearInterval(aiStatusInterval);
    }
    if (metricsInterval) {
        clearInterval(metricsInterval);
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * Format uptime for display
 */
function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopPeriodicUpdates();
});