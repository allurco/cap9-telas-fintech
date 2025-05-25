// settings.js - Vida Rica Settings Page
// ------------------------------------------
// This file handles settings-specific functionality
// without sharing methods with main.js
// ------------------------------------------

// DOM Elements
const languageEnRadio = document.getElementById('language-en');
const languagePtRadio = document.getElementById('language-pt');
const themeDarkRadio = document.getElementById('theme-dark');
const themeLightRadio = document.getElementById('theme-light');
const saveSettingsBtn = document.getElementById('save-settings');

// === Settings Management - Page Specific ===
function loadSettingsPagePreferences() {
    // Load language preference
    const currentLang = localStorage.getItem('lang') || 'en';
    if (currentLang === 'pt') {
        languagePtRadio.checked = true;
    } else {
        languageEnRadio.checked = true;
    }
    
    // Load theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        themeLightRadio.checked = true;
    } else {
        themeDarkRadio.checked = true;
    }
}

// Save settings to localStorage
function saveSettingsPreferences() {
    // Save language preference
    const selectedLang = document.querySelector('input[name="language"]:checked').value;
    localStorage.setItem('lang', selectedLang);
    
    // Save theme preference
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    localStorage.setItem('theme', selectedTheme);
    
    // Use window global functions from main.js
    if (typeof window.vidaRica !== 'undefined') {
        window.vidaRica.setLanguage(selectedLang);
        window.vidaRica.setTheme(selectedTheme);
    }
    
    // Show confirmation message
    showSettingsSavedMessage();
}

// Display a success message when settings are saved
function showSettingsSavedMessage() {
    // Create message element
    const messageContainer = document.createElement('div');
    messageContainer.className = 'alert alert-success mt-3 fade show';
    messageContainer.setAttribute('role', 'alert');
    
    // Set message content based on language
    const currentLang = localStorage.getItem('lang') || 'en';
    let messageText = 'Preferences saved successfully!';
    if (typeof getTranslation === 'function') {
        messageText = getTranslation(currentLang, 'settings.preferencesSuccessfullySaved');
    } else if (currentLang === 'pt') {
        messageText = 'Preferências salvas com sucesso!';
    }
    
    messageContainer.innerHTML = `<i class="bi bi-check-circle me-2"></i>${messageText}`;
    
    // Add to DOM
    const settingsContainer = document.querySelector('.settings-container');
    settingsContainer.prepend(messageContainer);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        messageContainer.classList.add('fade');
        setTimeout(() => messageContainer.remove(), 300);
    }, 3000);
}

// Preview language change without saving
function previewLanguage(lang) {
    if (typeof window.vidaRica !== 'undefined' && typeof window.vidaRica.applyTranslations === 'function') {
        window.vidaRica.applyTranslations(lang);
    } else if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    }
}

// Preview theme change without saving
function previewTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    // Load settings form with current preferences
    loadSettingsPagePreferences();
    
    // Set up the save button
    saveSettingsBtn.addEventListener('click', saveSettingsPreferences);
    
    // Add event listeners for radio buttons to preview language
    languageEnRadio.addEventListener('change', function() {
        if (this.checked) {
            previewLanguage('en');
        }
    });
    
    languagePtRadio.addEventListener('change', function() {
        if (this.checked) {
            previewLanguage('pt');
        }
    });
    
    // Add event listeners for theme preview
    themeDarkRadio.addEventListener('change', function() {
        if (this.checked) {
            previewTheme('dark');
        }
    });
    
    themeLightRadio.addEventListener('change', function() {
        if (this.checked) {
            previewTheme('light');
        }
    });
});
