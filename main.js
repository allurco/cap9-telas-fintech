// main.js - Vida Rica Fintech App JavaScript
// ------------------------------------------
// This file centralizes all interactive logic for dashboard pages.
// It handles language switching, theme toggling, sidebar (burger menu) logic, and general UI behaviors.
// Provides a global namespace (window.vidaRica) for core functions
// ------------------------------------------

// Create global namespace for Vida Rica functions
window.vidaRica = {};

// === Language Detection & Switching ===
window.vidaRica.setLanguage = function(lang) {
    // Validate the language code
    if (lang !== 'en' && lang !== 'pt') {
        console.error('Invalid language code. Supported languages are: en, pt');
        return;
    }
    
    // Store the language preference
    localStorage.setItem('lang', lang);
    
    // If we have the new translation system available, use it
    if (typeof window.vidaRica.applyTranslations === 'function') {
        window.vidaRica.applyTranslations(lang);
    } else if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    } else {
        // Legacy fallback using class-based approach
        var enEls = document.querySelectorAll('.en');
        var ptEls = document.querySelectorAll('.pt');
        if (lang === 'pt') {
            enEls.forEach(el => el.style.display = 'none');
            ptEls.forEach(el => el.style.display = '');
        } else {
            enEls.forEach(el => el.style.display = '');
            ptEls.forEach(el => el.style.display = 'none');
        }
    }
    
    // Trigger a custom event that other parts of the app can listen for
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
};

// Legacy function for backward compatibility
function setLanguage(lang) {
    window.vidaRica.setLanguage(lang);
}

// === Theme Toggling ===
window.vidaRica.setTheme = function(theme) {
    // Update body class
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    // Update all theme icons in the application
    const themeIcons = document.querySelectorAll('[id^="themeIcon"]');
    themeIcons.forEach(icon => {
        if (theme === 'light') {
            icon.className = 'bi bi-sun';
        } else {
            icon.className = 'bi bi-moon';
        }
    });
    
    // Store preference
    localStorage.setItem('theme', theme);
};

// Legacy function for backward compatibility
function setTheme(theme) {
    window.vidaRica.setTheme(theme);
}

// === Sidebar (Burger Menu) Logic ===
function openSidebar() {
    document.querySelector('.sidebar').classList.add('open');
    document.querySelector('.sidebar-overlay').classList.add('active');
    document.querySelector('.burger-menu').classList.add('open');
    document.body.classList.add('no-scroll');
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('active');
    document.querySelector('.burger-menu').classList.remove('open');
    document.body.classList.remove('no-scroll');
}

// Responsive: Close sidebar if resizing to desktop
window.addEventListener('resize', function() {
    if(window.innerWidth > 767) closeSidebar();
});

// Add the translation functionality to the global namespace
if (typeof applyTranslations === 'function') {
    window.vidaRica.applyTranslations = applyTranslations;
} else {
    // Create a basic implementation if the function doesn't exist
    window.vidaRica.applyTranslations = function(lang) {
        const enEls = document.querySelectorAll('.en');
        const ptEls = document.querySelectorAll('.pt');
        
        if (lang === 'pt') {
            enEls.forEach(el => el.style.display = 'none');
            ptEls.forEach(el => el.style.display = '');
        } else {
            enEls.forEach(el => el.style.display = '');
            ptEls.forEach(el => el.style.display = 'none');
        }
    };
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // On load, set language and theme
    var lang = localStorage.getItem('lang');
    if (!lang) {
        // Default to browser language or English
        lang = (navigator.language || navigator.userLanguage).startsWith('pt') ? 'pt' : 'en';
    }
    window.vidaRica.setLanguage(lang);
    
    // Apply saved theme or default to dark
    var theme = localStorage.getItem('theme') || 'dark';
    window.vidaRica.setTheme(theme);
    
    // Language switcher
    var langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function() {
            var newLang = localStorage.getItem('lang') === 'pt' ? 'en' : 'pt';
            setLanguage(newLang);
        });
    }
    
    // Theme toggler - handle both theme toggle buttons in the app
    function setupThemeTogglers() {
        // Check for both possible theme toggle button IDs
        const themeTogglers = [
            document.getElementById('themeToggler'),
            document.getElementById('themeToggleBtn')
        ];
        
        // Add click listeners to any theme toggle buttons found
        themeTogglers.forEach(toggler => {
            if (toggler) {
                toggler.addEventListener('click', function() {
                    var newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
                    setTheme(newTheme);
                });
            }
        });
        
        // Also handle legacy theme toggle in the sidebar menu if it exists
        const themeToggleMenuItems = document.querySelectorAll('.theme-toggle button');
        themeToggleMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                var newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
            });
        });
    }
    
    // Set up all theme togglers
    setupThemeTogglers();
    
    // Mobile menu toggle - attach event listeners to all burger menu buttons
    const burgerMenuButtons = document.querySelectorAll('.burger-menu');
    if (burgerMenuButtons.length > 0) {
        burgerMenuButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        });
    }

    // Format currency inputs if any exist on the page
    const currencyInputs = document.querySelectorAll('input[data-type="currency"]');
    if (currencyInputs.length > 0) {
        currencyInputs.forEach(input => {
            input.addEventListener('input', function() {
                formatCurrency(this);
            });
            
            input.addEventListener('blur', function() {
                formatCurrency(this, 'blur');
            });
        });
    }
});

// Format Currency function - for any currency input fields
function formatCurrency(input, blur) {
    // Get input value
    let inputVal = input.value.replace(/[^\d]/g, '');
    
    // If there's a value
    if (inputVal) {
        // Convert to number and divide by 100 for decimal places
        let formattedVal = (parseInt(inputVal) / 100).toFixed(2);
        
        // Format with Brazilian currency symbol and thousands separators
        formattedVal = formattedVal.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        // Add R$ on blur
        if (blur) formattedVal = 'R$ ' + formattedVal;
        
        // Update the input
        input.value = formattedVal;
    }
}
