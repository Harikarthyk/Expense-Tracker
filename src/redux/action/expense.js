
const SET_ALL_EXPENSES = 'SET_ALL_EXPENSES';

export const setAllExpenses = input => {
  return {
    type: SET_ALL_EXPENSES,
    payload: input,
  };
};