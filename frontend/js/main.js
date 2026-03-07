/* GROCIFY - Common JavaScript Utilities */

/**
 * Show a modal with the given ID
 * @param {string} modalId - The ID of the modal element
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Add animation class if needed
    }
}

/**
 * Hide a modal with the given ID
 * @param {string} modalId - The ID of the modal element
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // If there's a form inside, you might want to reset it on close
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Reset hidden IDs if any
        const hiddenId = modal.querySelector('input[type="hidden"]');
        if (hiddenId) hiddenId.value = '';
        
        // Reset modal title if changed
        const title = modal.querySelector('h2');
        if (title && title.id === 'modal-title') {
            title.innerText = 'Add New';
        }
    }
}

// Close modal if user clicks on the backdrop
window.onclick = function(event) {
    if (event.target.classList.contains('modal-backdrop')) {
        hideModal(event.target.id);
    }
};

/**
 * Format currency
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
    return '₹' + parseFloat(value).toFixed(2);
}

/**
 * Format date
 * @param {string} dateStr - The date string to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Handle sidebar active links on load
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href)) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
});
