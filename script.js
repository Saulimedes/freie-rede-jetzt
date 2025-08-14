/**
 * Freie Rede Jetzt - Main JavaScript File
 * Handles form validation and petition interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePetitionForm();
    initializeAccessibility();
});

/**
 * Initialize the petition form with validation and submission handling
 */
function initializePetitionForm() {
    const form = document.getElementById('petition-form');
    const submitButton = document.querySelector('.submit-button');
    const inputs = form.querySelectorAll('input[required]');

    // Add event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
            checkFormValidity();
        });

        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('focus', function() {
            removeFieldError(this);
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });

    // Initial form validity check
    checkFormValidity();
}

/**
 * Validate individual form field
 * @param {HTMLInputElement} field - The input field to validate
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error state
    removeFieldError(field);

    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dieses Feld ist erforderlich.';
    }

    // Email specific validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        }
    }

    // Name fields validation (no numbers or special characters)
    if ((field.name === 'firstName' || field.name === 'lastName') && value) {
        const nameRegex = /^[a-zA-ZäöüßÄÖÜ\s\-']+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Bitte verwenden Sie nur Buchstaben für den Namen.';
        }
    }

    if (!isValid) {
        addFieldError(field, errorMessage);
    }

    return isValid;
}

/**
 * Add error styling and message to a field
 * @param {HTMLInputElement} field - The input field
 * @param {string} message - Error message to display
 */
function addFieldError(field, message) {
    field.classList.add('error');
    field.style.borderBottomColor = '#f44336';
    
    // Create or update error message
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#f44336';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        errorElement.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

/**
 * Remove error styling and message from a field
 * @param {HTMLInputElement} field - The input field
 */
function removeFieldError(field) {
    field.classList.remove('error');
    field.style.borderBottomColor = '';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Check overall form validity and enable/disable submit button
 */
function checkFormValidity() {
    const form = document.getElementById('petition-form');
    const submitButton = document.querySelector('.submit-button');
    const requiredFields = form.querySelectorAll('input[required]');
    
    let allValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        if (!value || field.classList.contains('error')) {
            allValid = false;
        }
    });
    
    // Update submit button state
    if (allValid) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = 'rgb(0, 110, 94)';
        submitButton.style.cursor = 'pointer';
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = 'rgba(0, 110, 94, 0.3)';
        submitButton.style.cursor = 'not-allowed';
    }
}

/**
 * Handle form submission
 */
function handleFormSubmission() {
    const form = document.getElementById('petition-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate all fields one final time
    const inputs = form.querySelectorAll('input[required]');
    let allValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });
    
    if (!allValid) {
        showNotification('Bitte korrigieren Sie die Fehler in den markierten Feldern.', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate form submission (in real implementation, this would send to server)
    setTimeout(() => {
        showLoadingState(false);
        
        // In a real implementation, you would send data to your server here
        console.log('Form data to be submitted:', data);
        
        // Show success message
        showNotification('Vielen Dank für Ihre Unterschrift! Ihre Stimme wurde erfolgreich registriert.', 'success');
        
        // Reset form
        form.reset();
        checkFormValidity();
        
        // Update petition counter (simulated)
        updatePetitionCounter();
        
    }, 2000);
}

/**
 * Show/hide loading state for form submission
 * @param {boolean} isLoading - Whether to show loading state
 */
function showLoadingState(isLoading) {
    const submitButton = document.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('span');
    
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
        buttonText.textContent = 'Wird gesendet...';
    } else {
        buttonText.textContent = 'Sign';
        checkFormValidity(); // This will re-enable button if form is valid
    }
}

/**
 * Show notification message to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Styling
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 20px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out'
    });
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

/**
 * Simulate updating the petition counter
 */
function updatePetitionCounter() {
    const counterElement = document.querySelector('.stats-number');
    if (counterElement) {
        const currentCount = parseInt(counterElement.textContent) || 387;
        const newCount = currentCount + 1;
        
        // Animate counter update
        animateNumber(counterElement, currentCount, newCount, 1000);
        
        // Update progress bar
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            const percentage = Math.min((newCount / 1000) * 100, 100);
            progressBar.style.width = percentage + '%';
        }
    }
}

/**
 * Animate number change
 * @param {HTMLElement} element - Element containing the number
 * @param {number} start - Starting number
 * @param {number} end - Ending number
 * @param {number} duration - Animation duration in milliseconds
 */
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = progress * progress * (3 - 2 * progress);
        
        const currentValue = Math.round(start + (difference * easedProgress));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

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
    
    // Add keyboard navigation for form
    const form = document.getElementById('petition-form');
    if (form) {
        form.addEventListener('keydown', function(e) {
            // Submit form with Ctrl+Enter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.requestSubmit();
            }
        });
    }
    
    // Add ARIA labels for progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-label', 'Petition progress');
        progressBar.setAttribute('aria-valuenow', '387');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '1000');
    }
}

/**
 * Handle responsive behavior
 */
function handleResponsiveFeatures() {
    // Add mobile-specific enhancements if needed
    if (window.innerWidth <= 768) {
        // Mobile-specific JavaScript can go here
        console.log('Mobile view detected');
    }
}

// Listen for resize events
window.addEventListener('resize', handleResponsiveFeatures);

// Initialize responsive features on load
handleResponsiveFeatures();