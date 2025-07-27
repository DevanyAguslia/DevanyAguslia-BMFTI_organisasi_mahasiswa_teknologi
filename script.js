// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const registerForm = document.getElementById('registerForm');
const successModal = document.getElementById('successModal');
const navLinks = document.querySelectorAll('.nav-link');
const statNumbers = document.querySelectorAll('.stat-number');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeNavigation();
    initializeScrollAnimations();
    initializeCountAnimation();
    initializeFormValidation();
    initializeScrollSpy();
    initializeRegistrationButtons();
    createToastContainer();
});

// Create Toast Container
function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }
}

// Toast Notification Function
function showToast(message, type = 'success', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Toast styles
    toast.style.cssText = `
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Add icon based on type
    const icon = document.createElement('i');
    icon.style.fontSize = '18px';

    switch (type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(messageSpan);

    const toastContainer = document.getElementById('toast-container');
    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Add click to dismiss
    toast.addEventListener('click', () => {
        removeToast(toast);
    });

    // Auto remove
    setTimeout(() => {
        removeToast(toast);
    }, duration);

    return toast;
}

function removeToast(toast) {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Initialize Registration Buttons
function initializeRegistrationButtons() {
    // No pop-up for "Daftar Sekarang" buttons - they should just scroll to form
    console.log('Daftar Sekarang buttons will only scroll to form');
}

function handleRegistrationButton(button) {
    // Skip form submit buttons
    if (button.type === 'submit') {
        return;
    }

    // Check if this button already has an event listener to avoid duplicates
    if (button.hasAttribute('data-registration-handled')) {
        return;
    }

    button.setAttribute('data-registration-handled', 'true');

    button.addEventListener('click', function (e) {
        try {
            // Always show pop-up notification
            showRegistrationSuccess();

            // If it's NOT a link to register section, prevent default
            if (this.getAttribute('href') !== '#register') {
                e.preventDefault();
            }
        } catch (error) {
            console.error('Error in registration button handler:', error);
        }
    });
}

// Show Registration Success Notification
function showRegistrationSuccess() {
    try {
        showToast("Pendaftaran berhasil! Terima kasih telah mendaftar.", 'success', 4000);
    } catch (error) {
        console.error('Error showing registration success:', error);
        // Fallback to simple alert if toast fails
        alert("Pendaftaran berhasil! Terima kasih telah mendaftar.");
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = getFromMemory('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    saveToMemory('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Memory storage functions (replacing localStorage)
const memoryStorage = {};

function saveToMemory(key, value) {
    memoryStorage[key] = value;
}

function getFromMemory(key) {
    return memoryStorage[key];
}

// Navigation Management
function initializeNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Scroll Spy for Navigation
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add scroll animation class to elements
    const animateElements = document.querySelectorAll('.stat-card, .member-card, .event-card, .about-text, .register-info');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Counter Animation
function initializeCountAnimation() {
    const observerOptions = {
        threshold: 0.5
    };

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(counter => {
        countObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, duration / steps);
}

// Form Validation and Submission
function initializeFormValidation() {
    if (!registerForm) return;

    registerForm.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const formInputs = registerForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Checkbox validation
    const interestCheckboxes = registerForm.querySelectorAll('input[name="interest"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateInterestField);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
        submitForm();
    }
}

function validateForm() {
    let isValid = true;
    const formData = new FormData(registerForm);

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'nim', 'major', 'semester', 'motivation'];

    requiredFields.forEach(fieldName => {
        const field = registerForm.querySelector(`[name="${fieldName}"]`);
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate interest checkboxes
    if (!validateInterestField()) {
        isValid = false;
    }

    // Validate terms checkbox
    const termsCheckbox = registerForm.querySelector('#terms');
    if (!termsCheckbox.checked) {
        showFieldError('terms', 'Anda harus menyetujui syarat dan ketentuan');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (!value) {
        showFieldError(fieldName, 'Field ini wajib diisi');
        return false;
    }

    // Specific validations
    switch (fieldName) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Format email tidak valid');
                isValid = false;
            }
            break;

        case 'phone':
            const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(fieldName, 'Format nomor telepon tidak valid');
                isValid = false;
            }
            break;

        case 'nim':
            if (value.length < 8) {
                showFieldError(fieldName, 'NIM harus minimal 8 karakter');
                isValid = false;
            }
            break;

        case 'motivation':
            if (value.length < 50) {
                showFieldError(fieldName, 'Motivasi harus minimal 50 karakter');
                isValid = false;
            }
            break;
    }

    return isValid;
}

function validateInterestField() {
    const checkboxes = registerForm.querySelectorAll('input[name="interest"]:checked');
    if (checkboxes.length === 0) {
        showFieldError('interest', 'Pilih minimal satu bidang minat');
        return false;
    }
    clearFieldError(registerForm.querySelector('input[name="interest"]'));
    return true;
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Add error styling to field
    const field = registerForm.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = 'var(--danger-color)';
    }
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    // Remove error styling
    field.style.borderColor = 'var(--border-color)';
}

function submitForm() {
    const submitBtn = registerForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Mengirim...';

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;

        // Reset form
        registerForm.reset();

        // Show modal if it exists (no toast for form submission)
        if (successModal) {
            showModal();
        }
    }, 2000);
}

// Modal Management
function showModal() {
    if (successModal) {
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (successModal) {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        if (email) {
            // Simulate API call
            const button = this.querySelector('button');
            const originalHTML = button.innerHTML;

            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalHTML;
                this.querySelector('input').value = '';

                // Show simple success notification
                showToast('Terima kasih! Anda telah berlangganan newsletter kami.', 'success', 4000);
            }, 1500);
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Optimization
const debouncedScroll = debounce(handleNavbarScroll, 10);
window.removeEventListener('scroll', handleNavbarScroll);
window.addEventListener('scroll', debouncedScroll);

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    showToast('Terjadi kesalahan. Silakan refresh halaman.', 'error', 5000);
});

// Accessibility Improvements
document.addEventListener('keydown', function (e) {
    // Close modal with Escape key
    if (e.key === 'Escape' && successModal && successModal.style.display === 'block') {
        closeModal();
    }

    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Focus trap for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to modal when shown
const originalShowModal = showModal;
showModal = function () {
    originalShowModal();
    if (successModal) {
        trapFocus(successModal);
        // Focus the OK button
        setTimeout(() => {
            const okButton = successModal.querySelector('button');
            if (okButton) okButton.focus();
        }, 100);
    }
};

// Lazy Loading for Images 
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}