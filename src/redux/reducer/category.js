const initialState = {
    incomeCategories: [],
    expenseCategories: []
};

export default category = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ALL_EXPENSE_CATEGORIES':
            return {
                ...state,
                expenseCategories: action.payload.categories,
            };
        case 'SET_ALL_INCOME_CATEGORIES':
            return {
                ...state,
                incomeCategories: action.payload.categories,
            };
        default:
            return state;
    }
};