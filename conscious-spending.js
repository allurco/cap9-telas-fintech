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

// Update the overall totals and percentages
function updateTotals() {
    console.log('Updating totals and percentages...');
    
    // Update Fixed Expenses total
    const fixedTotal = updateSectionTotal('Gastos Fixos') || 0;
    
    // Update Investments total
    const investTotal = updateSectionTotal('Investimentos de Longo Prazo') || 0;
    
    // Update Savings total
    const savingsTotal = updateSectionTotal('Poupança/Objetivos') || 0;
    
    // Get net income
    const netIncomeEl = document.querySelector('[data-key="netIncome"]');
    if (!netIncomeEl) return;
    
    const netIncome = parseCurrencyBRL(netIncomeEl.textContent);
    if (netIncome <= 0) return; // Avoid division by zero
    
    // Calculate guilt-free spending
    const guiltyFree = netIncome - fixedTotal - investTotal - savingsTotal;
    
    // Update the Gastos Livres display
    updateGuiltyFreeAmount(guiltyFree);
    
    // Update percentage badges
    updatePercentageBadges(fixedTotal, investTotal, savingsTotal, guiltyFree, netIncome);
}

// Update percentage badges for each section based on net income
function updatePercentageBadges(fixedTotal, investTotal, savingsTotal, guiltyFree, netIncome) {
    // Calculate percentages - using Math.max to ensure we don't get negative values
    const fixedPercentage = Math.round((fixedTotal / netIncome) * 100);
    const investPercentage = Math.round((investTotal / netIncome) * 100);
    const savingsPercentage = Math.round((savingsTotal / netIncome) * 100);
    const guiltyFreePercentage = Math.max(0, Math.round((guiltyFree / netIncome) * 100));
    
    console.log('Percentage breakdown:', {
        fixedPercentage,
        investPercentage,
        savingsPercentage,
        guiltyFreePercentage,
        netIncome,
        fixedTotal,
        investTotal,
        savingsTotal,
        guiltyFree
    });
    
    // Update fixed expenses badge
    updateSectionBadge('Gastos Fixos', fixedPercentage, 50, 60); // Target: 50-60%
    
    // Update investments badge
    updateSectionBadge('Investimentos de Longo Prazo', investPercentage, 10, 10); // Target: 10%
    
    // Update savings badge
    updateSectionBadge('Poupança/Objetivos', savingsPercentage, 5, 10); // Target: 5-10%
    
    // Update guilty-free badge - direct approach to ensure it works
    const gastoLivresSection = findCardByHeaderText('Gastos Livres');
    if (gastoLivresSection) {
        const badge = gastoLivresSection.querySelector('.badge');
        if (badge) {
            // Update percentage text
            badge.textContent = guiltyFreePercentage + '% ';
            
            // Determine if percentage is good or bad
            let icon = document.createElement('i');
            
            if (guiltyFreePercentage < 20) {
                // Below minimum target
                icon.className = 'bi bi-arrow-down';
                badge.className = 'badge bg-dark text-warning ms-2';
            } else if (guiltyFreePercentage > 35) {
                // Above maximum target
                icon.className = 'bi bi-arrow-up';
                badge.className = 'badge bg-dark text-danger ms-2';
            } else {
                // Within target range
                icon.className = 'bi bi-check-lg';
                badge.className = 'badge bg-dark text-success ms-2';
            }
            
            // Clear existing icons and add the new one
            while (badge.querySelector('i')) {
                badge.querySelector('i').remove();
            }
            badge.appendChild(icon);
        }
    }
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
    
    // First, calculate total from swipeable rows
    const rows = section.querySelectorAll('.swipeable-row-container');
    let total = 0;
    
    rows.forEach(row => {
        const valueEl = row.querySelector('.cs-edit-value');
        if (valueEl) {
            const value = parseCurrencyBRL(valueEl.textContent);
            total += value;
        }
    });
    
    // For fixed expenses, handle the miscellaneous row specially
    if (sectionTitle === 'Gastos Fixos') {
        // Remove existing miscellaneous row
        const existingMiscRow = section.querySelector('.non-editable-row');
        if (existingMiscRow) {
            existingMiscRow.remove();
        }
        
        // Calculate 5% of total spending
        const miscValue = total * 0.05;
        
        // Create the non-editable miscellaneous row
        const miscRow = document.createElement('div');
        miscRow.className = 'non-editable-row';
        miscRow.innerHTML = `
            <div class="row g-1 align-items-center">
                <div class="col-8 label fw-bold">Miscelâneos (5%)</div>
                <div class="col-4 value text-end d-flex align-items-center justify-content-end gap-2">
                    <span class="cs-edit-value">${formatCurrencyBRL(miscValue)}</span>
                </div>
            </div>
        `;
        
        // Find the card body and total row
        const cardBody = section.querySelector('.card-body');
        const totalRow = cardBody.querySelector('.row.mt-2');
        
        // Add the row before the total row
        if (totalRow && cardBody) {
            cardBody.insertBefore(miscRow, totalRow);
        }
        
        // Add the miscellaneous value to the total
        total += miscValue;
    } else {
        // For other sections, include any non-editable rows in the calculation
        const nonEditableRows = section.querySelectorAll('.non-editable-row');
        nonEditableRows.forEach(row => {
            const valueEl = row.querySelector('.cs-edit-value');
            if (valueEl) {
                const value = parseCurrencyBRL(valueEl.textContent);
                total += value;
            }
        });
    }
    
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

// Update the guilt-free spending amount display
function updateGuiltyFreeAmount(guiltyFree) {
    // Update the display
    const guiltyFreeSection = findCardByHeaderText('Gastos Livres');
    if (guiltyFreeSection) {
        const valueEl = guiltyFreeSection.querySelector('.cs-edit-value');
        if (valueEl) {
            valueEl.textContent = formatCurrencyBRL(guiltyFree);
        }
    }
}

// Function to add a new row to a section
function addNewRow(sectionTitle, labelCol, valueCol) {
    const section = findCardByHeaderText(sectionTitle);
    if (!section) return;
    
    const cardBody = section.querySelector('.card-body');
    if (!cardBody) return;
    
    // Default label and value based on section
    let defaultLabel = 'Nova Despesa';
    let defaultValue = 'R$ 0,00';
    
    if (sectionTitle === 'Investimentos de Longo Prazo') {
        defaultLabel = 'Novo Investimento';
    } else if (sectionTitle === 'Poupança/Objetivos') {
        defaultLabel = 'Novo Objetivo';
    }
    
    // Add the new row
    const newRow = addSwipeableRow(cardBody, defaultLabel, defaultValue, labelCol, valueCol);
    
    // Initialize swipe on the new row
    initSwipe(newRow);
    
    // Update totals
    updateTotals();
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
    updateTotals();
    
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
        await loadSectionData('gastos-fixos.json', 'gastos_fixos', 'Gastos Fixos', 'col-8', 'col-4');
        
        // Load investments (investimentos)
        await loadSectionData('investimentos.json', 'investimentos', 'Investimentos de Longo Prazo', 'col-8', 'col-4');
        
        // Load savings (poupança)
        await loadSectionData('poupanca.json', 'poupanca', 'Poupança/Objetivos', 'col-8', 'col-4');
        
        // Update all calculations
        updateTotals();
        
    } catch (error) {
        console.error('Error loading financial data:', error);
    }
}

// Helper function to load data for a specific section
async function loadSectionData(jsonFile, dataKey, sectionTitle, labelCol, valueCol) {
    try {
        console.log(`Attempting to load ${jsonFile}...`);
        const response = await fetch(jsonFile);
        const data = await response.json();
        console.log(`Successfully loaded ${sectionTitle} data:`, data);
        
        // Get the section and find its card body
        console.log(`Looking for ${sectionTitle} section...`);
        const section = findCardByHeaderText(sectionTitle);
        console.log(`${sectionTitle} section found:`, !!section);
        
        if (section) {
            const cardBody = section.querySelector('.card-body');
            console.log('Card body found:', !!cardBody);
            
            console.log(`Starting fresh with ${sectionTitle} data`);
            
            // Find total row (we want to keep this)
            const totalRow = cardBody.querySelector('.row.mt-2');
            console.log('Total row found:', !!totalRow);
            
            // Clear existing rows
            const existingRows = cardBody.querySelectorAll('.swipeable-row-container, .non-editable-row');
            console.log('Found', existingRows.length, 'existing rows');
            existingRows.forEach(row => row.remove());
            
            // Initialize total counter
            let total = 0;
            
            // Create and add rows for all items
            console.log('Creating rows for', data[dataKey].length, 'items');
            
            // Add each row to the card body
            data[dataKey].forEach(item => {
                console.log('Processing item:', item.name, item.value);
                
                // Convert value to a proper number format (values in JSON are in cents)
                const valueInReais = item.value / 100;
                console.log('Value in Reais:', valueInReais);
                
                // Keep track of the total
                total += valueInReais;
                
                // Add to cardBody
                const newRow = addSwipeableRow(
                    cardBody, 
                    item.name, 
                    formatCurrencyBRL(valueInReais), 
                    labelCol, 
                    valueCol
                );
                
                // Initialize swipe on the new row
                initSwipe(newRow);
            });
            
            // For fixed expenses section only, add a non-editable miscellaneous row (5% of total)
            if (sectionTitle === 'Gastos Fixos') {
                // Calculate 5% of total spending
                const miscValue = total * 0.05;
                
                // Create the non-editable miscellaneous row
                const miscRow = document.createElement('div');
                miscRow.className = 'non-editable-row';
                miscRow.innerHTML = `
                    <div class="row g-1 align-items-center">
                        <div class="${labelCol} label fw-bold">Miscelâneos (5%)</div>
                        <div class="${valueCol} value text-end d-flex align-items-center justify-content-end gap-2">
                            <span class="cs-edit-value">${formatCurrencyBRL(miscValue)}</span>
                        </div>
                    </div>
                `;
                
                // Add the row before the total row
                if (totalRow) {
                    cardBody.insertBefore(miscRow, totalRow);
                } else {
                    cardBody.appendChild(miscRow);
                }
                
                // Add the miscellaneous value to the total
                total += miscValue;
            }
        }
    } catch (error) {
        console.error(`Error loading ${sectionTitle}:`, error);
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
    
    // Load financial data
    loadFinancialData();
    
    // Add event listener for net income changes
    const netIncomeEl = document.querySelector('[data-key="netIncome"]');
    if (netIncomeEl) {
        netIncomeEl.addEventListener('change', updateTotals);
    }
    
    // Add event listeners for the add row buttons
    const addFixedBtn = document.getElementById('add-fixed-btn');
    const addInvestBtn = document.getElementById('add-invest-btn');
    const addSavingsBtn = document.getElementById('add-savings-btn');
    
    if (addFixedBtn) {
        addFixedBtn.addEventListener('click', () => addNewRow('Gastos Fixos', 'col-8', 'col-4'));
    }
    
    if (addInvestBtn) {
        addInvestBtn.addEventListener('click', () => addNewRow('Investimentos de Longo Prazo', 'col-8', 'col-4'));
    }
    
    if (addSavingsBtn) {
        addSavingsBtn.addEventListener('click', () => addNewRow('Poupança/Objetivos', 'col-8', 'col-4'));
    }
    
    // Call updateTotals to ensure everything is initialized correctly
    setTimeout(updateTotals, 500);
});
