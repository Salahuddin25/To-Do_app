
const initialState = {
  todos: [],
  isLoading: false,
};

export const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TODOS_REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'FETCH_TODOS_SUCCESS':
      return {
        ...state,
        todos: action.payload,
        isLoading: false,
      };
    case 'FETCH_TODOS_FAILURE':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
