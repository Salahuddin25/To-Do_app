import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  graphData: null,
  isLoading: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setGraphData: (state, action) => {
      state.graphData = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setGraphData, setIsLoading } = profileSlice.actions;
export default profileSlice.reducer;