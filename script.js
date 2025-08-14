/**
 * Freie Rede Jetzt - Main JavaScript File
 * Minimal script for accessibility and responsive features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
    handleResponsiveFeatures();
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

// Add some basic Civist widget styling adjustments
window.addEventListener('load', function() {
    // Give Civist widgets time to load, then adjust styling
    setTimeout(function() {
        const widgets = document.querySelectorAll('.civist-petition-widget, .civist-support-widget');
        widgets.forEach(widget => {
            widget.style.opacity = '1';
        });
    }, 1000);
});