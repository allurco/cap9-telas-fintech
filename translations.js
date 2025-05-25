// translations.js - Vida Rica Translation System
// ------------------------------------------
// This file contains all text strings used in the application
// in multiple languages to support easy language switching.
// ------------------------------------------

const translations = {
  // English translations
  en: {
    // Login page
    login: {
      title: "Vida Rica - Login",
      emailPhonePlaceholder: "PHONE/EMAIL",
      or: "OR",
      validateAccess: "ACCESS",
      loginWithGoogle: "Login with Google",
      loginWithLinkedIn: "Login with LinkedIn",
      loginWithFacebook: "Login with Facebook"
    },
    
    // Password page
    password: {
      title: "Vida Rica - Access Code",
      codeMessage: "A 6-character code has been sent to your Phone/Email",
      resendCode: "Didn't receive? Resend code",
      verifyCode: "VERIFY CODE",
      returnToLogin: "Return to login"
    },
    // Navigation items
    nav: {
      dashboard: "Dashboard",
      spendingPlan: "Spending Plan",
      automation: "Automation",
      financialGoals: "Financial Goals",
      investments: "Investments",
      richLife: "My Rich Life",
      settings: "Settings"
    },
    
    // User profile
    profile: {
      premium: "Premium"
    },
    
    // Dashboard page
    dashboard: {
      title: "Dashboard",
      welcomeMessage: "Welcome to your financial journey",
      netWorth: "Net Worth",
      monthlyIncome: "Monthly Income",
      monthlyExpenses: "Monthly Expenses",
      savingsRate: "Savings Rate",
      investmentReturns: "Investment Returns",
      recentTransactions: "Recent Transactions",
      upcomingBills: "Upcoming Bills",
      viewAll: "View All",
      financialInsights: "Financial Insights",
      savingsGoalProgress: "Savings Goal Progress",
      seeDetails: "See Details"
    },
    
    // Spending Plan page
    spendingPlan: {
      title: "Conscious Spending Plan",
      fixedCosts: "Fixed Costs",
      savings: "Savings",
      investments: "Investments",
      guiltFreeSpending: "Guilt-Free Spending",
      totalBudget: "Total Budget",
      allocateByPercentage: "Allocate by Percentage",
      allocateByAmount: "Allocate by Amount",
      updatePlan: "Update Plan",
      savePlan: "Save Plan"
    },
    
    // Goals page
    goals: {
      title: "Financial Goals",
      shortTerm: "Short Term",
      mediumTerm: "Medium Term",
      longTerm: "Long Term",
      addGoal: "Add Goal",
      goalName: "Goal Name",
      targetAmount: "Target Amount",
      currentAmount: "Current Amount",
      deadline: "Deadline",
      progress: "Progress",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      goalNamePlaceholder: "Enter goal name",
      targetAmountPlaceholder: "Enter target amount",
      currentAmountPlaceholder: "Enter current amount",
      deadlinePlaceholder: "Select deadline",
      newGoalTitle: "New Goal",
      editGoalTitle: "Edit Goal"
    },
    
    // Investments page
    investments: {
      title: "Investments",
      portfolioValue: "Portfolio Value",
      totalReturn: "Total Return",
      assetAllocation: "Asset Allocation",
      individualStocks: "Individual Stocks",
      indexFunds: "Index Funds",
      realEstate: "Real Estate",
      retirement: "Retirement",
      cash: "Cash",
      otherInvestments: "Other Investments",
      addInvestment: "Add Investment",
      investmentName: "Investment Name",
      investmentType: "Investment Type",
      currentValue: "Current Value",
      purchaseValue: "Purchase Value",
      purchaseDate: "Purchase Date",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      investmentNamePlaceholder: "Enter investment name",
      currentValuePlaceholder: "Enter current value",
      purchaseValuePlaceholder: "Enter purchase value",
      purchaseDatePlaceholder: "Select purchase date",
      newInvestmentTitle: "New Investment",
      editInvestmentTitle: "Edit Investment"
    },
    
    // Settings page
    settings: {
      title: "Settings",
      languagePreferences: "Language Preferences",
      selectLanguage: "Select Application Language",
      appearance: "Appearance",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      savePreferences: "Save Preferences",
      preferencesSuccessfullySaved: "Preferences saved successfully!"
    },
    
    // Common words/phrases
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      confirm: "Are you sure?",
      yes: "Yes",
      no: "No",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      close: "Close",
      submit: "Submit",
      next: "Next",
      previous: "Previous",
      month: "Month",
      year: "Year",
      today: "Today",
      yesterday: "Yesterday",
      tomorrow: "Tomorrow",
      noData: "No data available"
    }
  },
  
  // Portuguese translations
  pt: {
    // Login page
    login: {
      title: "Vida Rica - Login",
      emailPhonePlaceholder: "TELEFONE/EMAIL",
      or: "OU",
      validateAccess: "VALIDAR ACESSO",
      loginWithGoogle: "Login com Google",
      loginWithLinkedIn: "Login com LinkedIn",
      loginWithFacebook: "Login com Facebook"
    },
    
    // Password page
    password: {
      title: "Vida Rica - Código de Acesso",
      codeMessage: "Um Código de 6 caracteres foi enviado para o seu Telefone/Email",
      resendCode: "Não recebeu? Reenviar código",
      verifyCode: "VERIFICAR CÓDIGO",
      returnToLogin: "Voltar para login"
    },
    // Navigation items
    nav: {
      dashboard: "Painel",
      spendingPlan: "Plano de Gastos",
      automation: "Automação",
      financialGoals: "Objetivos Financeiros",
      investments: "Investimentos",
      richLife: "Minha Vida Rica",
      settings: "Configurações"
    },
    
    // User profile
    profile: {
      premium: "Premium"
    },
    
    // Dashboard page
    dashboard: {
      title: "Painel",
      welcomeMessage: "Bem-vindo à sua jornada financeira",
      netWorth: "Patrimônio Líquido",
      monthlyIncome: "Renda Mensal",
      monthlyExpenses: "Despesas Mensais",
      savingsRate: "Taxa de Economia",
      investmentReturns: "Retornos de Investimentos",
      recentTransactions: "Transações Recentes",
      upcomingBills: "Contas Próximas",
      viewAll: "Ver Tudo",
      financialInsights: "Insights Financeiros",
      savingsGoalProgress: "Progresso da Meta de Economia",
      seeDetails: "Ver Detalhes"
    },
    
    // Spending Plan page
    spendingPlan: {
      title: "Plano de Gastos Conscientes",
      fixedCosts: "Custos Fixos",
      savings: "Economias",
      investments: "Investimentos",
      guiltFreeSpending: "Gastos Sem Culpa",
      totalBudget: "Orçamento Total",
      allocateByPercentage: "Alocar por Porcentagem",
      allocateByAmount: "Alocar por Valor",
      updatePlan: "Atualizar Plano",
      savePlan: "Salvar Plano"
    },
    
    // Goals page
    goals: {
      title: "Objetivos Financeiros",
      shortTerm: "Curto Prazo",
      mediumTerm: "Médio Prazo",
      longTerm: "Longo Prazo",
      addGoal: "Adicionar Objetivo",
      goalName: "Nome do Objetivo",
      targetAmount: "Valor Alvo",
      currentAmount: "Valor Atual",
      deadline: "Prazo",
      progress: "Progresso",
      actions: "Ações",
      edit: "Editar",
      delete: "Excluir",
      save: "Salvar",
      cancel: "Cancelar",
      goalNamePlaceholder: "Digite o nome do objetivo",
      targetAmountPlaceholder: "Digite o valor alvo",
      currentAmountPlaceholder: "Digite o valor atual",
      deadlinePlaceholder: "Selecione o prazo",
      newGoalTitle: "Novo Objetivo",
      editGoalTitle: "Editar Objetivo"
    },
    
    // Investments page
    investments: {
      title: "Investimentos",
      portfolioValue: "Valor do Portfólio",
      totalReturn: "Retorno Total",
      assetAllocation: "Alocação de Ativos",
      individualStocks: "Ações Individuais",
      indexFunds: "Fundos de Índice",
      realEstate: "Imóveis",
      retirement: "Aposentadoria",
      cash: "Dinheiro",
      otherInvestments: "Outros Investimentos",
      addInvestment: "Adicionar Investimento",
      investmentName: "Nome do Investimento",
      investmentType: "Tipo de Investimento",
      currentValue: "Valor Atual",
      purchaseValue: "Valor de Compra",
      purchaseDate: "Data de Compra",
      actions: "Ações",
      edit: "Editar",
      delete: "Excluir",
      save: "Salvar",
      cancel: "Cancelar",
      investmentNamePlaceholder: "Digite o nome do investimento",
      currentValuePlaceholder: "Digite o valor atual",
      purchaseValuePlaceholder: "Digite o valor de compra",
      purchaseDatePlaceholder: "Selecione a data de compra",
      newInvestmentTitle: "Novo Investimento",
      editInvestmentTitle: "Editar Investimento"
    },
    
    // Settings page
    settings: {
      title: "Configurações",
      languagePreferences: "Preferências de Idioma",
      selectLanguage: "Selecione o Idioma da Aplicação",
      appearance: "Aparência",
      darkMode: "Modo Escuro",
      lightMode: "Modo Claro",
      savePreferences: "Salvar Preferências",
      preferencesSuccessfullySaved: "Preferências salvas com sucesso!"
    },
    
    // Common words/phrases
    common: {
      loading: "Carregando...",
      error: "Ocorreu um erro",
      success: "Sucesso!",
      confirm: "Tem certeza?",
      yes: "Sim",
      no: "Não",
      save: "Salvar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Excluir",
      close: "Fechar",
      submit: "Enviar",
      next: "Próximo",
      previous: "Anterior",
      month: "Mês",
      year: "Ano",
      today: "Hoje",
      yesterday: "Ontem",
      tomorrow: "Amanhã",
      noData: "Nenhum dado disponível"
    }
  }
};

// Function to get a translation value by key path
function getTranslation(language, keyPath) {
  const keys = keyPath.split('.');
  let result = translations[language];
  
  for (const key of keys) {
    if (result && result[key]) {
      result = result[key];
    } else {
      // Return the key path if translation not found
      return keyPath;
    }
  }
  
  return result;
}

// Function to translate all elements with data-i18n attribute
function translatePage(language) {
  // Set all language-specific elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = getTranslation(language, key);
  });
  
  // Handle placeholders in inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.setAttribute('placeholder', getTranslation(language, key));
  });
  
  // Store the language preference
  localStorage.setItem('lang', language);
  
  // Hide all language-specific elements first
  document.querySelectorAll('.en, .pt').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show only the elements for the selected language
  document.querySelectorAll('.' + language).forEach(el => {
    el.style.display = '';
  });
}

// Initialize with the saved language or default to English
function initializeLanguage() {
  const savedLanguage = localStorage.getItem('lang') || 'en';
  translatePage(savedLanguage);
}

// Export functions for use in other files
if (typeof module !== 'undefined') {
  module.exports = {
    translations,
    getTranslation,
    translatePage,
    initializeLanguage
  };
}
