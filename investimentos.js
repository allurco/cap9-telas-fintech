// investimentos.js - Vida Rica Investments Management
// -----------------------------------------------------
// This file handles all functionality related to tracking and managing investments,
// allowing users to visualize their portfolio allocation and performance.
// Follows Ramit Sethi's philosophy of investing consistently in diversified assets.
// -----------------------------------------------------

// === DOM Elements ===
const investmentsContainer = document.querySelector('.investments-container');
const addInvestmentBtns = document.querySelectorAll('.add-investment-btn');

// Bootstrap modal
const investmentModal = new bootstrap.Modal(document.getElementById('investmentModal'));

// Modal form elements
const investmentForm = document.getElementById('investmentForm');
const investmentIdInput = document.getElementById('investmentId');
const investmentTypeInput = document.getElementById('investmentType');
const investmentNameInput = document.getElementById('investmentName');
const investmentDescriptionInput = document.getElementById('investmentDescription');
const investmentAmountInput = document.getElementById('investmentAmount');
const investmentReturnInput = document.getElementById('investmentReturn');
const saveInvestmentBtn = document.getElementById('saveInvestmentBtn');

// === Data Management ===
let investmentsData = {
    'fixed-income': [],
    'variable-income': [],
    'real-estate': [],
    'crypto': []
};

// Load investments data
async function loadInvestmentsData() {
    try {
        const response = await fetch('investimentos-data.json');
        if (!response.ok) {
            throw new Error('Failed to load investments data');
        }
        const data = await response.json();
        investmentsData = data.investments || {
            'fixed-income': [],
            'variable-income': [],
            'real-estate': [],
            'crypto': []
        };
        
        // Wait a bit to ensure Chart.js is fully loaded
        setTimeout(() => {
            calculatePortfolioStats();
            renderPortfolioChart();
        }, 100);
    } catch (error) {
        console.error('Error loading investments data:', error);
        // If data can't be loaded, use the default empty structure
    }
}

// Save investments data
async function saveInvestmentsData() {
    // In a real app, this would save to a server/database
    // For demo purposes, we'll just log it
    console.log('Investments data saved:', investmentsData);
    
    // Update UI components
    renderPortfolioChart();
    calculatePortfolioStats();
}

// === UI Rendering ===
function renderPortfolioChart() {
    console.log('Rendering portfolio chart...');
    const canvas = document.getElementById('portfolioChart');
    if (!canvas) {
        console.error('Portfolio chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas');
        return;
    }
    
    // Calculate allocation data
    let totalFixed = calculateCategoryTotal('fixed-income');
    let totalVariable = calculateCategoryTotal('variable-income');
    let totalRealEstate = calculateCategoryTotal('real-estate');
    let totalCrypto = calculateCategoryTotal('crypto');
    
    console.log('Investment totals:', { totalFixed, totalVariable, totalRealEstate, totalCrypto });
    
    // Handle case where all values are 0
    const hasData = totalFixed > 0 || totalVariable > 0 || totalRealEstate > 0 || totalCrypto > 0;
    if (!hasData) {
        console.log('No investment data to display');
        // Show a message instead of an empty chart
        const noDataMessage = document.createElement('div');
        noDataMessage.textContent = 'Adicione investimentos para visualizar sua carteira';
        noDataMessage.className = 'text-center text-muted my-5';
        canvas.parentNode.insertBefore(noDataMessage, canvas);
        canvas.style.display = 'none';
        return;
    }
    
    // Make sure canvas is visible
    canvas.style.display = 'block';
    
    // Prepare chart data with more vivid colors
    const data = {
        labels: ['Renda Fixa', 'Renda Variável', 'Fundos Imobiliários', 'Criptomoedas'],
        datasets: [{
            data: [totalFixed, totalVariable, totalRealEstate, totalCrypto],
            backgroundColor: [
                'rgba(0, 184, 148, 0.85)',  // Teal - Fixed Income
                'rgba(116, 85, 247, 0.85)', // Purple - Variable Income
                'rgba(253, 150, 68, 0.85)', // Orange - Real Estate
                'rgba(255, 71, 87, 0.85)'   // Pink - Crypto
            ],
            borderColor: [
                'rgba(0, 184, 148, 1)',
                'rgba(116, 85, 247, 1)',
                'rgba(253, 150, 68, 1)',
                'rgba(255, 71, 87, 1)'
            ],
            borderWidth: 2,
            hoverBackgroundColor: [
                'rgba(0, 184, 148, 1)',
                'rgba(116, 85, 247, 1)',
                'rgba(253, 150, 68, 1)',
                'rgba(255, 71, 87, 1)'
            ],
            hoverBorderWidth: 3
        }]
    };
    
    // If a chart already exists, destroy it
    try {
        if (window.portfolioChart && typeof window.portfolioChart.destroy === 'function') {
            console.log('Destroying existing chart');
            window.portfolioChart.destroy();
        }
    } catch (error) {
        console.error('Error destroying chart:', error);
        // Continue anyway, we'll create a new chart
    }
    
    try {
        // Create new chart
        console.log('Creating new chart');
        window.portfolioChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '60%',  // Makes the doughnut thicker and more pronounced
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            color: document.body.classList.contains('light-mode') ? '#22285A' : '#FFFFFF'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = formatCurrencyBRL(context.raw);
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully');
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

function calculateCategoryTotal(category) {
    return investmentsData[category].reduce((total, investment) => {
        return total + (investment.amount || 0);
    }, 0);
}

function calculatePortfolioStats() {
    // Calculate total invested
    let totalInvested = 0;
    Object.keys(investmentsData).forEach(category => {
        totalInvested += calculateCategoryTotal(category);
    });
    
    // Calculate current value with returns
    let currentValue = 0;
    Object.keys(investmentsData).forEach(category => {
        investmentsData[category].forEach(investment => {
            const amount = investment.amount || 0;
            const returnPct = investment.return || 0;
            currentValue += amount * (1 + returnPct / 100);
        });
    });
    
    // Calculate overall profitability
    let profitability = totalInvested > 0 ? ((currentValue / totalInvested) - 1) * 100 : 0;
    let gainLoss = currentValue - totalInvested;
    
    // Update UI
    document.getElementById('totalInvested').textContent = formatCurrencyBRL(totalInvested);
    document.getElementById('currentValue').textContent = formatCurrencyBRL(currentValue);
    document.getElementById('profitability').textContent = `${profitability.toFixed(1)}%`;
    document.getElementById('gainLoss').textContent = formatCurrencyBRL(gainLoss);
    
    // Add appropriate class for gain/loss color
    if (gainLoss > 0) {
        document.getElementById('profitability').className = 'stats-value text-success fw-bold';
        document.getElementById('gainLoss').className = 'stats-value text-success fw-bold';
        document.getElementById('profitability').innerHTML = `+${profitability.toFixed(1)}% <i class="bi bi-arrow-up"></i>`;
        document.getElementById('gainLoss').innerHTML = `+${formatCurrencyBRL(gainLoss)}`;
    } else if (gainLoss < 0) {
        document.getElementById('profitability').className = 'stats-value text-danger fw-bold';
        document.getElementById('gainLoss').className = 'stats-value text-danger fw-bold';
        document.getElementById('profitability').innerHTML = `${profitability.toFixed(1)}% <i class="bi bi-arrow-down"></i>`;
        document.getElementById('gainLoss').innerHTML = formatCurrencyBRL(gainLoss);
    } else {
        document.getElementById('profitability').className = 'stats-value text-muted fw-bold';
        document.getElementById('gainLoss').className = 'stats-value text-muted fw-bold';
        document.getElementById('profitability').textContent = '0.0%';
        document.getElementById('gainLoss').textContent = 'R$ 0,00';
    }
}

// === Modal Handlers ===
function openAddInvestmentModal(type) {
    // Reset the form
    investmentForm.reset();
    
    // Set up the modal for adding a new investment
    investmentIdInput.value = '';
    investmentTypeInput.value = type;
    
    // Set modal title based on investment type
    let title = 'Novo Investimento';
    switch (type) {
        case 'fixed-income':
            title = 'Nova Renda Fixa';
            break;
        case 'variable-income':
            title = 'Nova Renda Variável';
            break;
        case 'real-estate':
            title = 'Novo Fundo Imobiliário';
            break;
        case 'crypto':
            title = 'Nova Criptomoeda';
            break;
    }
    
    document.getElementById('investmentModalLabel').textContent = title;
    investmentModal.show();
}

function openEditInvestmentModal(investment, type) {
    // Set up the modal for editing an existing investment
    investmentIdInput.value = investment.id;
    investmentTypeInput.value = type;
    investmentNameInput.value = investment.name;
    investmentDescriptionInput.value = investment.description || '';
    investmentAmountInput.value = formatCurrencyBRL(investment.amount);
    investmentReturnInput.value = investment.return || 0;
    
    document.getElementById('investmentModalLabel').textContent = 'Editar Investimento';
    investmentModal.show();
}

// === Event Handlers ===
function handleSaveInvestment() {
    if (!investmentForm.checkValidity()) {
        investmentForm.reportValidity();
        return;
    }
    
    const investmentId = investmentIdInput.value;
    const type = investmentTypeInput.value;
    
    const investmentData = {
        name: investmentNameInput.value.trim(),
        description: investmentDescriptionInput.value.trim(),
        amount: parseCurrencyValue(investmentAmountInput.value),
        return: parseFloat(investmentReturnInput.value) || 0
    };
    
    if (investmentId) {
        // Edit existing investment
        const index = investmentsData[type].findIndex(i => i.id === investmentId);
        if (index !== -1) {
            investmentData.id = investmentId;
            investmentsData[type][index] = investmentData;
        }
    } else {
        // Add new investment
        investmentData.id = generateId();
        investmentsData[type].push(investmentData);
    }
    
    saveInvestmentsData();
    investmentModal.hide();
    window.location.reload(); // For simplicity, reload the page to show changes
}

// === Helper Functions ===
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatCurrencyBRL(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
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
    loadInvestmentsData();
    
    // Set up event listeners for add investment buttons
    addInvestmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            openAddInvestmentModal(type);
        });
    });
    
    // Save investment button
    saveInvestmentBtn.addEventListener('click', handleSaveInvestment);
    
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
    
    // Update chart colors when theme changes
    document.querySelector('.theme-toggle button').addEventListener('click', () => {
        // Give it a moment to update the DOM
        setTimeout(() => {
            renderPortfolioChart();
        }, 100);
    });
});
