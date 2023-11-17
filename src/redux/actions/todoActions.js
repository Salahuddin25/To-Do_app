
import axios from 'axios';

export const fetchTodosRequest = () => ({
  type: 'FETCH_TODOS_REQUEST',
});

export const fetchTodosSuccess = (todos) => ({
  type: 'FETCH_TODOS_SUCCESS',
  payload: todos,
});

export const fetchTodosFailure = (error) => ({
  type: 'FETCH_TODOS_FAILURE',
  payload: error,
});

export const fetchTodos = () => {
  return (dispatch) => {
    dispatch(fetchTodosRequest());
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        dispatch(fetchTodosSuccess(response.data));
      })
      .catch(error => {
        dispatch(fetchTodosFailure(error.message));
      });
  };
};
