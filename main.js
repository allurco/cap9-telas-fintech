// main.js - Vida Rica Fintech App JavaScript
// ------------------------------------------
// This file centralizes all interactive logic for dashboard pages.
// It handles language switching, theme toggling, sidebar (burger menu) logic, and general UI behaviors.
// ------------------------------------------

// === Language Detection & Switching ===
function setLanguage(lang) {
    var enEls = document.querySelectorAll('.en');
    var ptEls = document.querySelectorAll('.pt');
    if (lang === 'pt') {
        enEls.forEach(el => el.style.display = 'none');
        ptEls.forEach(el => el.style.display = '');
    } else {
        enEls.forEach(el => el.style.display = '');
        ptEls.forEach(el => el.style.display = 'none');
    }
    localStorage.setItem('lang', lang);
}

// === Theme Toggling ===
function setTheme(theme) {
    var icon = document.getElementById('themeIcon');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (icon) icon.className = 'bi bi-sun';
    } else {
        document.body.classList.remove('light-mode');
        if (icon) icon.className = 'bi bi-moon';
    }
    localStorage.setItem('theme', theme);
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

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // On load, set language and theme
    var lang = localStorage.getItem('lang');
    if (!lang) {
        // Default to browser language or English
        lang = (navigator.language || navigator.userLanguage).startsWith('pt') ? 'pt' : 'en';
    }
    setLanguage(lang);
    
    // Apply saved theme or default to dark
    var theme = localStorage.getItem('theme') || 'dark';
    setTheme(theme);
    
    // Language switcher
    var langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function() {
            var newLang = localStorage.getItem('lang') === 'pt' ? 'en' : 'pt';
            setLanguage(newLang);
        });
    }
    
    // Theme toggler
    var themeToggler = document.getElementById('themeToggler');
    if (themeToggler) {
        themeToggler.addEventListener('click', function() {
            var newTheme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
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
