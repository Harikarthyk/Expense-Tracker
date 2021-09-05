const initialState = [];

export default expense = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_EXPENSES':
      let {expenses} = action.payload
      return {
        ...expenses,
      };
    default:
      return state;
  }
};