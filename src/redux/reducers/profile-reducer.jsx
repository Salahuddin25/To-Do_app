const initialState = {
  graphData: null,
  isLoading: true,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GRAPH_DATA':
      return {
        ...state,
        graphData: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default profileReducer;