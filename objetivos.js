// objetivos.js - Vida Rica Financial Goals and Investments
// -----------------------------------------------------
// This file handles all functionality related to financial goals and investments tracking,
// allowing users to set targets, track contributions, and visualize progress.
// Follows Ramit Sethi's philosophy of specific, targeted savings goals with regular contributions.
// -----------------------------------------------------

// === DOM Elements ===
const objetivosContainer = document.querySelector('.objetivos-container');
const loadingPlaceholder = document.querySelector('.loading-placeholder');
const addGoalBtn = document.getElementById('add-goal-btn');

// Bootstrap modals
const goalModal = new bootstrap.Modal(document.getElementById('goalModal'));
const contributionModal = new bootstrap.Modal(document.getElementById('contributionModal'));

// Modal form elements
const goalForm = document.getElementById('goalForm');
const goalIdInput = document.getElementById('goalId');
const goalNameInput = document.getElementById('goalName');
const goalTargetInput = document.getElementById('goalTarget');
const saveGoalBtn = document.getElementById('saveGoalBtn');

const contributionForm = document.getElementById('contributionForm');
const contributionGoalIdInput = document.getElementById('contributionGoalId');
const contributionMonthInput = document.getElementById('contributionMonth');
const contributionAmountInput = document.getElementById('contributionAmount');
const saveContributionBtn = document.getElementById('saveContributionBtn');

// === Data Management ===
let goalsData = [];

// Load goals data
async function loadGoalsData() {
    try {
        const response = await fetch('objetivos.json');
        if (!response.ok) {
            throw new Error('Failed to load goals data');
        }
        const data = await response.json();
        goalsData = data.goals || [];
        
        renderGoals();
    } catch (error) {
        console.error('Error loading goals data:', error);
        // If data can't be loaded, initialize with empty array
        goalsData = [];
        renderGoals();
    } finally {
        // Hide loading placeholder
        if (loadingPlaceholder) {
            loadingPlaceholder.style.display = 'none';
        }
    }
}

// Save goals data
async function saveGoalsData() {
    // In a real app, this would save to a server/database
    // For demo purposes, we'll just log it
    console.log('Goals data saved:', goalsData);
    
    // Calculate totals and update UI
    calculateGoalTotals();
}

// Calculate goal totals and progress
function calculateGoalTotals() {
    goalsData.forEach(goal => {
        let total = 0;
        
        // Sum all contributions
        if (goal.contributions && goal.contributions.length > 0) {
            goal.contributions.forEach(contribution => {
                total += contribution.amount;
            });
        }
        
        goal.currentAmount = total;
        goal.progress = goal.target > 0 ? (total / goal.target) * 100 : 0;
    });
}

// === UI Rendering ===
function renderGoals() {
    // Calculate totals first
    calculateGoalTotals();
    
    // Clear container except for add button container
    const addButtonContainer = document.querySelector('.add-goal-container');
    objetivosContainer.innerHTML = '';
    objetivosContainer.appendChild(addButtonContainer);
    
    // Add each goal to the container
    goalsData.forEach((goal, index) => {
        const goalElement = createGoalElement(goal, index);
        objetivosContainer.insertBefore(goalElement, addButtonContainer);
    });
}

function createGoalElement(goal, index) {
    const goalElement = document.createElement('div');
    goalElement.className = 'goal-item card mb-3';
    goalElement.dataset.id = goal.id;
    
    // Goal header
    const header = document.createElement('div');
    header.className = 'goal-header d-flex justify-content-between align-items-center p-3';
    header.innerHTML = `
        <div class="goal-name">
            <span class="fw-bold">${goal.name}</span>
            <i class="bi bi-info-circle ms-2 text-muted" title="Clique para editar"></i>
        </div>
        <div class="goal-amount fw-bold">R$ ${formatNumber(goal.currentAmount || 0)}</div>
    `;
    
    // Add click event to edit the goal
    header.querySelector('.goal-name').addEventListener('click', () => {
        openEditGoalModal(goal);
    });
    
    goalElement.appendChild(header);
    
    // Contributions section
    const contributionsSection = document.createElement('div');
    contributionsSection.className = 'contributions-section';
    
    // Contributions header (collapsible)
    const contributionsHeader = document.createElement('div');
    contributionsHeader.className = 'contributions-header d-flex justify-content-between align-items-center p-2 ps-3';
    contributionsHeader.innerHTML = `
        <div class="fw-bold">Aportes</div>
        <div><i class="bi bi-chevron-down"></i></div>
    `;
    
    // Make contributions header toggleable
    contributionsHeader.addEventListener('click', () => {
        const icon = contributionsHeader.querySelector('i');
        const contributionsList = contributionsSection.querySelector('.contributions-list');
        
        if (icon.classList.contains('bi-chevron-down')) {
            icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
            contributionsList.style.display = 'block';
        } else {
            icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
            contributionsList.style.display = 'none';
        }
    });
    
    contributionsSection.appendChild(contributionsHeader);
    
    // Contributions list
    const contributionsList = document.createElement('div');
    contributionsList.className = 'contributions-list';
    contributionsList.style.display = 'none'; // Start collapsed
    
    // Add contributions if they exist
    if (goal.contributions && goal.contributions.length > 0) {
        // Sort contributions by month
        const sortedContributions = [...goal.contributions].sort((a, b) => a.month - b.month);
        
        sortedContributions.forEach((contribution, i) => {
            const contributionRow = document.createElement('div');
            contributionRow.className = `contribution-row d-flex justify-content-between align-items-center p-2 ps-4 ${i % 2 === 0 ? 'even-row' : 'odd-row'}`;
            contributionRow.innerHTML = `
                <div>${getMonthName(contribution.month)}</div>
                <div class="fw-bold">R$ ${formatNumber(contribution.amount)}</div>
            `;
            contributionsList.appendChild(contributionRow);
        });
    } else {
        // No contributions message
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'text-center text-muted py-3';
        emptyMessage.textContent = 'Nenhum aporte registrado';
        contributionsList.appendChild(emptyMessage);
    }
    
    // Add contribution button
    const addContributionBtn = document.createElement('div');
    addContributionBtn.className = 'text-center py-2';
    addContributionBtn.innerHTML = `
        <button class="btn btn-sm btn-outline-primary add-contribution-btn">
            <i class="bi bi-plus-circle"></i> Adicionar aporte
        </button>
    `;
    
    addContributionBtn.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent toggling the section
        openAddContributionModal(goal);
    });
    
    contributionsList.appendChild(addContributionBtn);
    contributionsSection.appendChild(contributionsList);
    goalElement.appendChild(contributionsSection);
    
    return goalElement;
}

// === Modal Handlers ===
function openAddGoalModal() {
    goalIdInput.value = '';
    goalNameInput.value = '';
    goalTargetInput.value = '';
    
    document.getElementById('goalModalLabel').textContent = 'Novo Objetivo';
    goalModal.show();
}

function openEditGoalModal(goal) {
    goalIdInput.value = goal.id;
    goalNameInput.value = goal.name;
    goalTargetInput.value = formatNumber(goal.target);
    
    document.getElementById('goalModalLabel').textContent = 'Editar Objetivo';
    goalModal.show();
}

function openAddContributionModal(goal) {
    contributionGoalIdInput.value = goal.id;
    contributionMonthInput.value = getCurrentMonth();
    contributionAmountInput.value = '';
    
    document.getElementById('contributionModalLabel').textContent = 'Novo Aporte para ' + goal.name;
    contributionModal.show();
}

// === Event Handlers ===
function handleSaveGoal() {
    if (!goalForm.checkValidity()) {
        goalForm.reportValidity();
        return;
    }
    
    const goalId = goalIdInput.value;
    const goalData = {
        name: goalNameInput.value.trim(),
        target: parseCurrencyValue(goalTargetInput.value),
        contributions: []
    };
    
    if (goalId) {
        // Edit existing goal
        const index = goalsData.findIndex(g => g.id === goalId);
        if (index !== -1) {
            // Preserve existing contributions
            goalData.contributions = goalsData[index].contributions || [];
            goalData.id = goalId;
            goalsData[index] = goalData;
        }
    } else {
        // Add new goal
        goalData.id = generateId();
        goalsData.push(goalData);
    }
    
    saveGoalsData();
    renderGoals();
    goalModal.hide();
}

function handleSaveContribution() {
    if (!contributionForm.checkValidity()) {
        contributionForm.reportValidity();
        return;
    }
    
    const goalId = contributionGoalIdInput.value;
    const month = parseInt(contributionMonthInput.value);
    const amount = parseCurrencyValue(contributionAmountInput.value);
    
    const goalIndex = goalsData.findIndex(g => g.id === goalId);
    if (goalIndex === -1) {
        console.error('Goal not found');
        return;
    }
    
    // Check if contribution for this month already exists
    const goal = goalsData[goalIndex];
    goal.contributions = goal.contributions || [];
    
    const existingIndex = goal.contributions.findIndex(c => c.month === month);
    
    if (existingIndex !== -1) {
        // Update existing contribution
        goal.contributions[existingIndex].amount = amount;
    } else {
        // Add new contribution
        goal.contributions.push({
            month,
            amount
        });
    }
    
    saveGoalsData();
    renderGoals();
    contributionModal.hide();
}

// === Helper Functions ===
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getCurrentMonth() {
    return new Date().getMonth() + 1; // JavaScript months are 0-indexed
}

function getMonthName(monthNum) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[monthNum - 1] || '';
}

function formatNumber(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function parseCurrencyValue(value) {
    // Remove currency symbol, thousands separators, and convert decimal separator
    const numericValue = value.replace(/[^0-9,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
    
    return parseFloat(numericValue) || 0;
}

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadGoalsData();
    
    // Set up event listeners
    addGoalBtn.addEventListener('click', openAddGoalModal);
    saveGoalBtn.addEventListener('click', handleSaveGoal);
    saveContributionBtn.addEventListener('click', handleSaveContribution);
    
    // Initialize currency inputs
    document.querySelectorAll('.currency-input').forEach(input => {
        input.addEventListener('input', (e) => {
            // Format as currency
            let value = e.target.value.replace(/\D/g, '');
            if (value === '') return e.target.value = '';
            
            value = (parseInt(value) / 100).toFixed(2);
            e.target.value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        });
    });
});
