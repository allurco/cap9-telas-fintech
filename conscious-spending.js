/**
 * Conscious Spending Plan JavaScript
 * Based on Ramit Sethi's financial philosophy from "I Will Teach You to Be Rich"
 */

// Format currency to BRL (Brazilian Real)
function formatCurrencyBRL(value) {
    // Convert to a number and handle conversion from cents if needed
    let numValue = parseFloat(value);
    
    // Format the number to BRL currency
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(numValue);
}

// Parse BRL currency string to number
function parseCurrencyBRL(value) {
    if (!value) return 0;
    
    // Remove R$, spaces, dots and replace comma with dot
    return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
}

// Helper function to find a card by its header text
function findCardByHeaderText(headerText) {
    const cards = document.querySelectorAll('.cs-section');
    for (let card of cards) {
        const header = card.querySelector('.card-header');
        if (header && header.textContent.includes(headerText)) {
            return card;
        }
    }
    return null;
}

// Toggle edit mode for a field
window.toggleEdit = function(button) {
    const container = button.closest('.col-6, .col-4, .col-3');
    
    // Get elements
    const valueSpan = container.querySelector('.cs-edit-value');
    const input = container.querySelector('.edit-input');
    const editBtn = container.querySelector('.cs-edit-btn');
    const infoBtn = container.querySelector('.cs-info');
    
    // Toggle visibility
    valueSpan.classList.add('d-none');
    input.classList.remove('d-none');
    editBtn.classList.remove('d-none');
    if (infoBtn) infoBtn.classList.add('d-none');
    
    // Focus the input
    input.focus();
    input.select();
};

// Save an edited value
window.saveEdit = function(button) {
    const container = button.closest('.col-6, .col-4, .col-3');
    
    // Get elements
    const valueSpan = container.querySelector('.cs-edit-value');
    const input = container.querySelector('.edit-input');
    const editBtn = container.querySelector('.cs-edit-btn');
    const infoBtn = container.querySelector('.cs-info');
    
    // Get the new value and format it
    const newValue = input.value;
    valueSpan.textContent = newValue;
    
    // Toggle visibility back
    valueSpan.classList.remove('d-none');
    input.classList.add('d-none');
    editBtn.classList.add('d-none');
    if (infoBtn) infoBtn.classList.remove('d-none');
    
    // Update totals after edit
    updateCalculatedTotals();
};

// Toggle edit mode directly for a row (for swipe actions)
function toggleEditDirectly(row) {
    const valueContainer = row.querySelector('.value');
    if (!valueContainer) return;
    
    const valueSpan = valueContainer.querySelector('.cs-edit-value');
    const valueInput = valueContainer.querySelector('.edit-input');
    const editBtn = valueContainer.querySelector('.cs-edit-btn');
    
    // Toggle visibility
    valueSpan.classList.add('d-none');
    valueInput.classList.remove('d-none');
    editBtn.classList.remove('d-none');
    
    // Focus the input
    valueInput.focus();
    valueInput.select();
}

// Update all calculated totals
function updateCalculatedTotals() {
    // Update Fixed Expenses total
    const fixedTotal = updateSectionTotal('Gastos Fixos');
    
    // Update Investments total
    const investTotal = updateSectionTotal('Investimentos de Longo Prazo');
    
    // Update Savings total
    const savingsTotal = updateSectionTotal('Poupança/Objetivos');
    
    // Update Guilt-free spending amount
    updateGuiltyFreeSpending();
    
    // Update percentage badges
    updatePercentageBadges(fixedTotal, investTotal, savingsTotal);
}

// Update percentage badges for each section based on net income
function updatePercentageBadges(fixedTotal, investTotal, savingsTotal) {
    // Get net income
    const netIncomeEl = document.querySelector('[data-key="netIncome"]');
    if (!netIncomeEl) return;
    
    const netIncome = parseCurrencyBRL(netIncomeEl.textContent);
    if (netIncome <= 0) return; // Avoid division by zero
    
    // Calculate percentages
    const fixedPercentage = Math.round((fixedTotal / netIncome) * 100);
    const investPercentage = Math.round((investTotal / netIncome) * 100);
    const savingsPercentage = Math.round((savingsTotal / netIncome) * 100);
    const guiltyFreePercentage = 100 - fixedPercentage - investPercentage - savingsPercentage;
    
    // Update fixed expenses badge
    updateSectionBadge('Gastos Fixos', fixedPercentage, 50, 60); // Target: 50-60%
    
    // Update investments badge
    updateSectionBadge('Investimentos de Longo Prazo', investPercentage, 10, 10); // Target: 10%
    
    // Update savings badge
    updateSectionBadge('Poupança/Objetivos', savingsPercentage, 5, 10); // Target: 5-10%
    
    // Update guilty-free badge
    updateSectionBadge('Gastos Livres', guiltyFreePercentage, 20, 35); // Target: 20-35%
}

// Update badge for a specific section
function updateSectionBadge(sectionTitle, percentage, minTarget, maxTarget) {
    const section = findCardByHeaderText(sectionTitle);
    if (!section) return;
    
    const badge = section.querySelector('.badge');
    if (!badge) return;
    
    // Update percentage text
    badge.textContent = percentage + '% ';
    
    // Determine if percentage is good (within or below target) or bad (above target)
    let isGood = true;
    let icon = document.createElement('i');
    
    if (percentage < minTarget) {
        // Below minimum target
        icon.className = 'bi bi-arrow-down';
        badge.classList.remove('text-danger');
        badge.classList.add('text-warning');
    } else if (percentage > maxTarget) {
        // Above maximum target
        icon.className = 'bi bi-arrow-up';
        badge.classList.remove('text-success', 'text-warning');
        badge.classList.add('text-danger');
    } else {
        // Within target range - good!
        icon.className = 'bi bi-check';
        badge.classList.remove('text-danger', 'text-warning');
        badge.classList.add('text-success');
    }
    
    // Add icon to badge
    badge.appendChild(icon);
}

// Update total for a specific section
function updateSectionTotal(sectionTitle) {
    const section = findCardByHeaderText(sectionTitle);
    if (!section) return;
    
    const rows = section.querySelectorAll('.swipeable-row-container');
    let total = 0;
    
    rows.forEach(row => {
        const valueEl = row.querySelector('.cs-edit-value');
        if (valueEl) {
            const value = parseCurrencyBRL(valueEl.textContent);
            total += value;
        }
    });
    
    // Update the total display
    const totalRow = section.querySelector('.row.mt-2');
    if (totalRow) {
        const totalEl = totalRow.querySelector('.cs-edit-value');
        if (totalEl) {
            totalEl.textContent = formatCurrencyBRL(total);
        }
    }
    
    return total;
}

// Update the guilt-free spending amount
function updateGuiltyFreeSpending() {
    // Get the net income
    const netIncomeEl = document.querySelector('[data-key="netIncome"]');
    if (!netIncomeEl) return;
    
    const netIncome = parseCurrencyBRL(netIncomeEl.textContent);
    
    // Get section totals
    const fixedExpensesSection = findCardByHeaderText('Gastos Fixos');
    const investmentsSection = findCardByHeaderText('Investimentos de Longo Prazo');
    const savingsSection = findCardByHeaderText('Poupança/Objetivos');
    
    let fixedTotal = 0;
    let investTotal = 0;
    let savingsTotal = 0;
    
    if (fixedExpensesSection) {
        const totalEl = fixedExpensesSection.querySelector('.row.mt-2 .cs-edit-value');
        if (totalEl) fixedTotal = parseCurrencyBRL(totalEl.textContent);
    }
    
    if (investmentsSection) {
        const totalEl = investmentsSection.querySelector('.row.mt-2 .cs-edit-value');
        if (totalEl) investTotal = parseCurrencyBRL(totalEl.textContent);
    }
    
    if (savingsSection) {
        const totalEl = savingsSection.querySelector('.row.mt-2 .cs-edit-value');
        if (totalEl) savingsTotal = parseCurrencyBRL(totalEl.textContent);
    }
    
    // Calculate guilt-free spending
    const guiltyFree = netIncome - fixedTotal - investTotal - savingsTotal;
    
    // Update the display
    const guiltyFreeSection = findCardByHeaderText('Gastos Livres');
    if (guiltyFreeSection) {
        const valueEl = guiltyFreeSection.querySelector('.cs-edit-value');
        if (valueEl) {
            valueEl.textContent = formatCurrencyBRL(guiltyFree);
        }
    }
}

// Function to delete an existing row
window.deleteRow = function(element) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        // First check if it's a swipe action or a button click
        var isSwipeAction = element.classList && element.classList.contains('swipe-action-delete');
        var container;
        
        if (isSwipeAction) {
            container = element.closest('.swipeable-row-container');
        } else {
            // For button clicks, find either the container or the row directly
            container = element.closest('.swipeable-row-container') || element.closest('.row');
        }
        
        if (container) {
            container.remove();
            // Update calculations after removing the row
            updateCalculatedTotals();
        }
    }
};

// Initialize swipe functionality for a row
function initSwipe(container) {
    if (!container) {
        console.log('No container provided to initSwipe');
        return;
    }
    
    const content = container.querySelector('.swipeable-row-content');
    const actionsWidth = container.querySelector('.swipeable-row-actions')?.offsetWidth || 90;
    
    if (!content) {
        console.log('No swipeable-row-content found in container');
        return;
    }
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isOpen = false;
    
    // Add event listeners
    content.addEventListener('mousedown', handleStart);
    content.addEventListener('touchstart', handleStart);
    
    content.addEventListener('mousemove', handleMove);
    content.addEventListener('touchmove', handleMove);
    
    content.addEventListener('mouseup', handleEnd);
    content.addEventListener('touchend', handleEnd);
    content.addEventListener('touchcancel', handleEnd);
    
    // For clicks on action buttons
    const actions = container.querySelectorAll('.swipe-action');
    actions.forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.dataset.action;
            if (actionType === 'edit') {
                // Toggle edit mode
                const valueContainer = container.querySelector('.value');
                const valueSpan = valueContainer.querySelector('.cs-edit-value');
                const valueInput = valueContainer.querySelector('.edit-input');
                const editBtn = valueContainer.querySelector('.cs-edit-btn');
                
                // Toggle visibility
                valueSpan.classList.add('d-none');
                valueInput.classList.remove('d-none');
                editBtn.classList.remove('d-none');
                
                // Focus the input
                valueInput.focus();
                
                // Close the swipe
                resetSwipe();
            } else if (actionType === 'delete') {
                // Remove the row
                deleteRow(this);
            }
        });
    });
    
    function handleStart(e) {
        isDragging = true;
        startX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        content.style.transition = 'none';
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        currentX = clientX - startX;
        
        // Limit to only allow swiping left (negative values)
        if (currentX > 0 && !isOpen) {
            currentX = 0;
        }
        
        // Limit the max swipe to actionsWidth
        if (currentX < -actionsWidth) {
            currentX = -actionsWidth;
        }
        
        // Apply the transform
        content.style.transform = `translateX(${currentX}px)`;
    }
    
    function handleEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        content.style.transition = 'transform 0.3s ease';
        
        // If swiped more than halfway, complete the swipe
        if (currentX < -actionsWidth / 2) {
            content.style.transform = `translateX(-${actionsWidth}px)`;
            isOpen = true;
        } else {
            resetSwipe();
        }
    }
    
    function resetSwipe() {
        content.style.transition = 'transform 0.3s ease';
        content.style.transform = 'translateX(0)';
        isOpen = false;
        currentX = 0;
    }
    
    // Allow clicking outside to close
    document.addEventListener('click', function(e) {
        if (isOpen && !container.contains(e.target)) {
            resetSwipe();
        }
    });
}

// Helper function to add a swipeable row
function addSwipeableRow(cardBody, rowTitle, initialValue, colLabel, colValue) {
    // Wrap it in the swipeable container structure
    const container = document.createElement('div');
    container.className = 'swipeable-row-container';
    
    // Add the swipeable structure
    container.innerHTML = `
        <div class="swipeable-row-actions">
            <div class="swipe-action swipe-action-edit" data-action="edit">
                <i class="bi bi-pencil-fill"></i>
            </div>
            <div class="swipe-action swipe-action-delete" data-action="delete">
                <i class="bi bi-trash"></i>
            </div>
        </div>
        <div class="swipeable-row-content">
            <div class="row g-1 align-items-center">
                <div class="${colLabel} label">${rowTitle}</div>
                <div class="${colValue} value text-end d-flex align-items-center justify-content-end gap-2">
                    <span class="cs-edit-value">${initialValue}</span>
                    <input type="text" class="edit-input d-none form-control form-control-sm text-end" value="${initialValue}">
                    <button class="btn btn-link p-0 m-0 cs-edit-btn d-none" title="Salvar" onclick="saveEdit(this)"><i class="bi bi-check-lg"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // Find the total row if it exists
    const totalRow = cardBody.querySelector('.row.mt-2');
    
    // Add before the total row or at the end
    if (totalRow) {
        cardBody.insertBefore(container, totalRow);
    } else {
        cardBody.appendChild(container);
    }
    
    // Initialize swipe functionality
    initSwipe(container);
    
    // Update totals after adding
    updateCalculatedTotals();
    
    return container;
}

// Load financial data from JSON
async function loadFinancialData() {
    try {
        console.log('Loading financial data...');
        
        // Load main financial data
        const mainResponse = await fetch('conscious-spending-data.json');
        const data = await mainResponse.json();
        console.log('Main data loaded:', data);
        
        // Update main fields
        if (data.income) {
            const grossIncomeEl = document.querySelector('[data-key="grossIncome"]');
            if (grossIncomeEl) grossIncomeEl.textContent = formatCurrencyBRL(data.income.gross / 100);
            
            const netIncomeEl = document.querySelector('[data-key="netIncome"]');
            if (netIncomeEl) netIncomeEl.textContent = formatCurrencyBRL(data.income.net / 100);
        }
        
        // Load fixed expenses (gastos fixos)
        try {
            console.log('Attempting to load gastos-fixos.json...');
            const fixedExpensesResponse = await fetch('gastos-fixos.json');
            const fixedExpensesData = await fixedExpensesResponse.json();
            console.log('Successfully loaded fixed expenses:', fixedExpensesData);
            
            // Get the fixed expenses section and find its card body
            console.log('Looking for Gastos Fixos section...');
            const fixedExpensesSection = findCardByHeaderText('Gastos Fixos');
            console.log('Fixed expenses section found:', !!fixedExpensesSection);
            if (fixedExpensesSection) {
                const cardBody = fixedExpensesSection.querySelector('.card-body');
                console.log('Card body found:', !!cardBody);
                
                console.log('Starting fresh with fixed expenses data');
                
                // Find total row (we want to keep this)
                const totalRow = cardBody.querySelector('.row.mt-2');
                console.log('Total row found:', !!totalRow);
                
                // Clear existing rows
                const existingRows = cardBody.querySelectorAll('.swipeable-row-container');
                console.log('Found', existingRows.length, 'existing swipeable rows');
                existingRows.forEach(row => row.remove());
                
                // Initialize total expenses counter
                let totalFixedExpenses = 0;
                
                // Create and add rows for all expenses
                console.log('Creating rows for', fixedExpensesData.gastos_fixos.length, 'expenses');
                
                // Add each expense row to the card body
                fixedExpensesData.gastos_fixos.forEach(expense => {
                    console.log('Processing expense:', expense.name, expense.value);
                    
                    // Convert value to a proper number format (values in JSON are in cents)
                    const valueInReais = expense.value / 100;
                    console.log('Value in Reais:', valueInReais);
                    
                    // Add to cardBody
                    const newRow = addSwipeableRow(
                        cardBody, 
                        expense.name, 
                        formatCurrencyBRL(valueInReais), 
                        'col-8', 
                        'col-4'
                    );
                    
                    // Initialize swipe on the new row
                    initSwipe(newRow);
                });
                
                // Update all calculations
                updateCalculatedTotals();
            }
        } catch (error) {
            console.error('Error loading fixed expenses:', error);
        }
        
    } catch (error) {
        console.error('Error loading financial data:', error);
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Conscious Spending Plan initializing...');
    
    // Initialize all swipeable rows
    const swipeableRows = document.querySelectorAll('.swipeable-row-container');
    swipeableRows.forEach(row => {
        initSwipe(row);
    });
    
    // Load data
    loadFinancialData();
    
    // Set up add buttons
    // Gastos Fixos
    var addFixedBtn = document.getElementById('add-fixed-btn');
    if (addFixedBtn) {
        addFixedBtn.addEventListener('click', function() {
            var cardBody = addFixedBtn.closest('.card').querySelector('.card-body');
            addSwipeableRow(cardBody, 'Nova Despesa', 'R$ 0,00', 'col-8', 'col-4');
        });
    }
    
    // Investimentos
    var addInvestBtn = document.getElementById('add-invest-btn');
    if (addInvestBtn) {
        addInvestBtn.addEventListener('click', function() {
            var cardBody = addInvestBtn.closest('.card').querySelector('.card-body');
            addSwipeableRow(cardBody, 'Novo Investimento', 'R$ 0,00', 'col-8', 'col-4');
        });
    }
    
    // Poupança/Objetivos
    var addSavingsBtn = document.getElementById('add-savings-btn');
    if (addSavingsBtn) {
        addSavingsBtn.addEventListener('click', function() {
            var cardBody = addSavingsBtn.closest('.card').querySelector('.card-body');
            addSwipeableRow(cardBody, 'Novo Objetivo', 'R$ 0,00', 'col-7', 'col-3');
        });
    }
});
