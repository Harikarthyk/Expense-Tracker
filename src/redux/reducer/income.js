const initialState = [];

export default income = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_INCOMES':
      let { incomes } = action.payload;
      return {
        ...incomes,
      };
    default:
      return state;
  }
};