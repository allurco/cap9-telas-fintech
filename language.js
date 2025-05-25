// language.js - Vida Rica Language Management
// ------------------------------------------
// This file handles language switching functionality
// using the translations defined in translations.js
// ------------------------------------------

// Function to set the application language
function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'pt') {
        console.error('Invalid language code. Supported languages are: en, pt');
        return;
    }
    
    // Store the language preference
    localStorage.setItem('lang', lang);
    
    // Apply translations
    applyTranslations(lang);
    
    // Trigger a custom event that other parts of the app can listen for
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
}

// Function to apply translations to the page
function applyTranslations(lang) {
    // First, hide all language-specific elements
    document.querySelectorAll('.en, .pt').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show only the elements for the selected language
    document.querySelectorAll('.' + lang).forEach(el => {
        el.style.display = '';
    });
    
    // Apply translations to elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(lang, key);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Apply translations to placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(lang, key);
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });
    
    // Apply translations to aria-labels
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        const translation = getTranslation(lang, key);
        if (translation) {
            element.setAttribute('aria-label', translation);
        }
    });
    
    // Apply translations to titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = getTranslation(lang, key);
        if (translation) {
            element.setAttribute('title', translation);
        }
    });
    
    // Update document language attribute for accessibility
    document.documentElement.setAttribute('lang', lang);
}

// Function to get current language
function getCurrentLanguage() {
    return localStorage.getItem('lang') || 'en';
}

// Helper function to get a translation using the dot notation path
function getTranslation(lang, keyPath) {
    // Check if translations object is available
    if (typeof translations === 'undefined') {
        console.error('Translations object is not defined. Make sure translations.js is loaded before language.js');
        return keyPath;
    }
    
    const keys = keyPath.split('.');
    let result = translations[lang];
    
    for (const key of keys) {
        if (result && result[key] !== undefined) {
            result = result[key];
        } else {
            console.warn(`Translation not found for key: ${keyPath} in language: ${lang}`);
            return keyPath; // Return the key path if translation not found
        }
    }
    
    return result;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('lang') || 'en';
    applyTranslations(savedLanguage);
});

// Add functions to the global Vida Rica namespace
if (typeof window.vidaRica !== 'undefined') {
    window.vidaRica.applyTranslations = applyTranslations;
    window.vidaRica.getCurrentLanguage = getCurrentLanguage;
}

// Export functions for use in other files (if using in Node.js environment)
if (typeof module !== 'undefined') {
    module.exports = {
        setLanguage,
        getCurrentLanguage,
        applyTranslations
    };
}
