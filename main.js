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
    loadFinancialData();

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
        // Find the direct parent div (which should have an id like assets-row, debts-row, etc.)
        var parent = btn.closest('div[id$="-row"]') || btn.closest('.row');
        var valueSpan = parent.querySelector('.cs-edit-value');
        var input = parent.querySelector('.edit-input');
        var titleSpan = parent.querySelector('.cs-edit-title');
        var titleInput = parent.querySelector('.edit-title-input');
        var saveBtn = parent.querySelector('.cs-edit-btn');
        valueSpan.classList.toggle('d-none');
        input.classList.toggle('d-none');
        if (titleSpan && titleInput) {
            titleSpan.classList.toggle('d-none');
            titleInput.classList.toggle('d-none');
        }
        btn.classList.toggle('d-none');
        if (saveBtn) saveBtn.classList.toggle('d-none');
        if (!input.classList.contains('d-none')) {
            input.value = valueSpan.textContent.trim();
            if (titleInput && titleSpan) titleInput.value = titleSpan.textContent.trim();
            input.focus();
        }
    };
    window.saveEdit = function(btn) {
        // Use the same improved targeting as toggleEdit
        var parent = btn.closest('div[id$="-row"]') || btn.closest('.row');
        var valueSpan = parent.querySelector('.cs-edit-value');
        var input = parent.querySelector('.edit-input');
        var titleSpan = parent.querySelector('.cs-edit-title');
        var titleInput = parent.querySelector('.edit-title-input');
        var editBtn = parent.querySelector('.cs-info');
        valueSpan.textContent = input.value;
        valueSpan.classList.remove('d-none');
        input.classList.add('d-none');
        if (titleSpan && titleInput) {
            titleSpan.textContent = titleInput.value;
            titleSpan.classList.remove('d-none');
            titleInput.classList.add('d-none');
        }
        btn.classList.add('d-none');
        if (editBtn) editBtn.classList.remove('d-none');
    };

    // === Currency Mask for Value Inputs ===
    
    async function loadFinancialData() {
        try {
            const response = await fetch('conscious-spending-data.json');
            const data = await response.json();
            // First, update all fields except netWorth
            document.querySelectorAll('.cs-edit-value[data-key]').forEach(function(span) {
                const key = span.getAttribute('data-key');
                if (key !== 'netWorth' && data[key] !== undefined) {
                    span.textContent = formatCurrencyBRL(data[key].toString());
                }
            });
            // Calculate netWorth (Patrimônio Total)
            const netWorth = (parseFloat(data.assets) + parseFloat(data.investments) + parseFloat(data.savings) - parseFloat(data.debts));
            const netWorthSpan = document.querySelector('.cs-edit-value[data-key="netWorth"]');
            if (netWorthSpan) {
                netWorthSpan.textContent = formatCurrencyBRL(netWorth.toString());
            }
        } catch (e) {
            console.error('Erro ao carregar dados financeiros:', e);
        }
    }

    function formatCurrencyBRL(value) {
        value = value.replace(/\D/g, '');
        value = (parseInt(value, 10) / 100).toFixed(2) + '';
        value = value.replace('.', ',');
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return 'R$ ' + value;
    }
    function applyCurrencyMask(input) {
        input.addEventListener('input', function(e) {
            let val = input.value.replace(/\D/g, '');
            if(val.length === 0) {
                input.value = '';
                return;
            }
            val = (parseInt(val, 10) / 100).toFixed(2);
            val = val.replace('.', ',');
            val = val.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            input.value = 'R$ ' + val;
        });
    }
    // Apply mask to all current and future .edit-input fields
    function maskAllEditInputs() {
        document.querySelectorAll('.edit-input').forEach(function(input) {
            if (!input.dataset.masked) {
                applyCurrencyMask(input);
                input.dataset.masked = 'true';
            }
        });
    }
    // Initial mask
    maskAllEditInputs();
    // Re-apply mask when a new row is added (by listening to DOM changes)
    const observer = new MutationObserver(maskAllEditInputs);
    observer.observe(document.body, { childList: true, subtree: true });

    // === Bootstrap Tooltips (if needed) ===
    if (window.bootstrap) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
        tooltipTriggerList.forEach(function (el) {
            new bootstrap.Tooltip(el);
        });
    }

    // === Add Row Logic for Conscious Spending ===
    function createEditableRow(label, value, colLabel, colValue) {
        // Default columns if not provided
        colLabel = colLabel || 'col-8';
        colValue = colValue || 'col-4';
        const row = document.createElement('div');
        row.className = 'row g-1 align-items-center mt-1';
        row.innerHTML = `
            <div class="${colLabel} d-flex align-items-center">
                <span class="cs-edit-title flex-grow-1"></span>
                <input type="text" class="edit-title-input d-none form-control form-control-sm flex-grow-1 me-2" value="" placeholder="Nova Despesa">
            </div>
            <div class="${colValue} text-end d-flex align-items-center justify-content-end gap-2">
                <span class="cs-edit-value"></span>
                <input type="text" class="edit-input d-none form-control form-control-sm text-end" value="" placeholder="R$ 0,00">
                <button class="btn btn-link p-0 m-0 cs-info" title="Editar" onclick="toggleEdit(this)"><i class="bi bi-pencil-fill"></i></button>
                <button class="btn btn-link p-0 m-0 cs-edit-btn d-none" title="Salvar" onclick="saveEdit(this)"><i class="bi bi-check-lg"></i></button>
            </div>
        `;
        return row;
    }

    // Gastos Fixos
    var addFixedBtn = document.getElementById('add-fixed-btn');
    if (addFixedBtn) {
        addFixedBtn.addEventListener('click', function() {
            var cardBody = addFixedBtn.closest('.card').querySelector('.card-body');
            var newRow = createEditableRow('Nova Despesa', 'R$ 0,00', 'col-8', 'col-4');
            cardBody.appendChild(newRow);
            // Immediately show edit mode for the new row
            var editBtn = newRow.querySelector('.cs-info');
            if (editBtn) {
                toggleEdit(editBtn);
            }
        });
    }
    // Investimentos
    var addInvestmentBtn = document.getElementById('add-investment-btn');
    if (addInvestmentBtn) {
        addInvestmentBtn.addEventListener('click', function() {
            var cardBody = addInvestmentBtn.closest('.card').querySelector('.card-body');
            var newRow = createEditableRow('Novo Investimento', 'R$ 0,00', 'col-8', 'col-4');
            cardBody.appendChild(newRow);
            // Immediately show edit mode for the new row
            var editBtn = newRow.querySelector('.cs-info');
            if (editBtn) {
                toggleEdit(editBtn);
            }
        });
    }
    // Poupança/Objetivos
    var addSavingsBtn = document.getElementById('add-savings-btn');
    if (addSavingsBtn) {
        addSavingsBtn.addEventListener('click', function() {
            var cardBody = addSavingsBtn.closest('.card').querySelector('.card-body');
            // For this section, label col is col-7, value col is col-3, plus pencil/check col-2
            const row = document.createElement('div');
            row.className = 'row g-1 align-items-center mt-1';
            row.innerHTML = `
                <div class="col-7 d-flex align-items-center">
                    <span class="cs-edit-title flex-grow-1">Novo Objetivo</span>
                    <input type="text" class="edit-title-input d-none form-control form-control-sm flex-grow-1 me-2" value="Novo Objetivo" placeholder="Título">
                </div>
                <div class="col-3 text-end d-flex align-items-center justify-content-end gap-2">
                    <span class="cs-edit-value">R$ 0,00</span>
                    <input type="text" class="edit-input d-none form-control form-control-sm text-end" value="R$ 0,00">
                </div>
                <div class="col-2 text-end">
                    <button class="btn btn-link p-0 m-0 cs-info" title="Editar" onclick="toggleEdit(this)"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-link p-0 m-0 cs-edit-btn d-none" title="Salvar" onclick="saveEdit(this)"><i class="bi bi-check-lg"></i></button>
                </div>
            `;
            cardBody.appendChild(row);
// Immediately show edit mode for the new row
var editBtn = row.querySelector('.cs-info');
if (editBtn) {
    toggleEdit(editBtn);
}
// Immediately show edit mode for the new row
var editBtn = row.querySelector('.cs-info');
if (editBtn) {
    toggleEdit(editBtn);
}
        });
    }
});
