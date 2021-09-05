
const SET_ALL_EXPENSE_CATEGORIES = 'SET_ALL_EXPENSE_CATEGORIES';
const SET_ALL_INCOME_CATEGORIES = 'SET_ALL_INCOME_CATEGORIES';

export const setAllExpensesCategories = input => {
  return {
    type: SET_ALL_EXPENSE_CATEGORIES,
    payload: input,
  };
};

export const setAllIncomeCategories = input => {
    return {
      type: SET_ALL_INCOME_CATEGORIES,
      payload: input,
    };
  };