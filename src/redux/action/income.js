
const SET_ALL_INCOMES = 'SET_ALL_INCOMES';

export const setAllIncomes = input => {
  return {
    type: SET_ALL_INCOMES,
    payload: input,
  };
};