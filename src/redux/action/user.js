
const SET_USER = 'SET_USER';

export const setUserToStore = input => {
  return {
    type: SET_USER,
    payload: input,
  };
};