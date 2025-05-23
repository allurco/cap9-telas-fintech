// main.js - Vida Rica Fintech App JavaScript
// ------------------------------------------
// This file centralizes all interactive logic for dashboard and conscious spending pages.
// It handles language switching, theme toggling, sidebar (burger menu) logic, and inline editing.
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

// === Theme Toggle Button Event ===
document.addEventListener('DOMContentLoaded', function() {
    var themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.onclick = function() {
            var isLight = document.body.classList.contains('light-mode');
            setTheme(isLight ? 'dark' : 'light');
        };
    }

    // On load, set language and theme
    var lang = localStorage.getItem('lang');
    if (!lang) {
        var navLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
        lang = navLang && navLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
        localStorage.setItem('lang', lang);
    }
    setLanguage(lang);
    var theme = localStorage.getItem('theme') || 'dark';
    setTheme(theme);

    // === Inline Editing (for conscious spending) ===
    window.toggleEdit = function(btn) {
        var parent = btn.closest('.row');
        var valueSpan = parent.querySelector('.cs-edit-value');
        var input = parent.querySelector('.edit-input');
        var saveBtn = parent.querySelector('.cs-edit-btn');
        valueSpan.classList.toggle('d-none');
        input.classList.toggle('d-none');
        btn.classList.toggle('d-none');
        if (saveBtn) saveBtn.classList.toggle('d-none');
        if (!input.classList.contains('d-none')) {
            input.value = valueSpan.textContent.trim();
            input.focus();
        }
    };
    window.saveEdit = function(btn) {
        var parent = btn.closest('.row');
        var valueSpan = parent.querySelector('.cs-edit-value');
        var input = parent.querySelector('.edit-input');
        var editBtn = parent.querySelector('.cs-info');
        valueSpan.textContent = input.value;
        valueSpan.classList.remove('d-none');
        input.classList.add('d-none');
        btn.classList.add('d-none');
        if (editBtn) editBtn.classList.remove('d-none');
    };

    // === Bootstrap Tooltips (if needed) ===
    if (window.bootstrap) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
        tooltipTriggerList.forEach(function (el) {
            new bootstrap.Tooltip(el);
        });
    }
});
