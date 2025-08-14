/**
 * Freie Rede Jetzt - Main JavaScript File
 * Minimal script for accessibility and responsive features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
    handleResponsiveFeatures();
    checkCivistWidgets();
    initializePetitionForm();
});

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add focus management for skip link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Alt + H to go to homepage
        if (e.altKey && e.key === 'h') {
            window.location.href = './index.html';
        }
        // Alt + L to go to legal page
        if (e.altKey && e.key === 'l') {
            window.location.href = './rechtliches.html';
        }
    });
}

/**
 * Handle responsive behavior
 */
function handleResponsiveFeatures() {
    // Ensure iframes are responsive
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.style.maxWidth = '100%';
        
        // Add responsive class for mobile
        if (window.innerWidth <= 768) {
            iframe.parentElement.classList.add('mobile-widget');
        } else {
            iframe.parentElement.classList.remove('mobile-widget');
        }
    });
}

// Listen for resize events
window.addEventListener('resize', handleResponsiveFeatures);

/**
 * Check if Civist widgets load properly and show fallbacks if needed
 */
function checkCivistWidgets() {
    checkWidget('petition-iframe', 'fallback-form', 'petition');
    checkWidget('support-iframe', 'support-fallback', 'support');
}

function checkWidget(iframeId, fallbackId, type) {
    const iframe = document.getElementById(iframeId);
    const fallback = document.getElementById(fallbackId);
    
    if (!iframe || !fallback) return;
    
    let hasLoaded = false;
    let fallbackShown = false;
    let loadCheckAttempts = 0;
    
    // Function to show fallback
    function showFallback(reason) {
        if (fallbackShown) return;
        fallbackShown = true;
        console.log(`Civist ${type} widget failed: ${reason}`);
        
        iframe.style.display = 'none';
        fallback.style.display = 'block';
        
        // Add notice for petition widget
        if (type === 'petition') {
            const notice = document.createElement('div');
            notice.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 12px; margin-bottom: 16px; border-radius: 4px; font-size: 14px; text-align: center;';
            notice.innerHTML = '<strong>Hinweis:</strong> Das Petition-Widget konnte nicht geladen werden. Sie können das Backup-Formular verwenden.';
            fallback.insertBefore(notice, fallback.firstChild);
        }
    }
    
    // Listen for successful iframe load
    iframe.addEventListener('load', function() {
        hasLoaded = true;
        console.log(`Civist ${type} widget iframe loaded`);
        
        // Check if widget actually has content after a delay
        setTimeout(function() {
            checkWidgetContent();
        }, 3000);
    });
    
    // Listen for iframe load errors
    iframe.addEventListener('error', function() {
        showFallback('iframe error event');
    });
    
    // Check widget content periodically
    function checkWidgetContent() {
        loadCheckAttempts++;
        
        if (fallbackShown) return;
        
        try {
            // Check if iframe has reasonable dimensions
            const rect = iframe.getBoundingClientRect();
            const hasValidDimensions = rect.height > 50 && rect.width > 100;
            
            if (!hasValidDimensions) {
                if (loadCheckAttempts < 3) {
                    // Try again after delay
                    setTimeout(checkWidgetContent, 2000);
                    return;
                }
                showFallback('widget has invalid dimensions');
                return;
            }
            
            console.log(`Civist ${type} widget appears to be working (${rect.width}x${rect.height})`);
        } catch (e) {
            // Cross-origin restrictions are expected and normal
            console.log(`Civist ${type} widget loaded (cross-origin protected)`);
        }
    }
    
    // Ultimate timeout - show fallback if widget takes too long
    setTimeout(function() {
        if (!hasLoaded && !fallbackShown) {
            showFallback('timeout waiting for widget to load');
        }
    }, 10000); // 10 second timeout
}

/**
 * Initialize petition form functionality (for fallback form)
 */
function initializePetitionForm() {
    const form = document.querySelector('#fallback-form form');
    
    if (!form) return;
    
    // Add form submission handling
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('.submit-button');
        
        // Update submit button during submission
        if (submitBtn) {
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;
        }
        
        // Note: Form will be handled by Formspree
        console.log('Fallback petition form submitted');
    });
    
    // Add form validation
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });
    
    function validateField(e) {
        const field = e.target;
        
        // Simple validation
        if (field.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                field.style.borderColor = '#dc3545';
            } else {
                field.style.borderColor = '#28a745';
            }
        } else if (field.required && !field.value.trim()) {
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#28a745';
        }
    }
}


// Website fully loaded
window.addEventListener('load', function() {
    console.log('Freie Rede Jetzt website loaded successfully');
});