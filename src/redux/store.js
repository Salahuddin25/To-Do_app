import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { todosReducer } from './reducers/todoReducer';

const rootReducer = combineReducers({
  todos: todosReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));