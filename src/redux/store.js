import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import userReducer from './userSlice';
import booksReducer from './booksSlice';
import loansReducer from './loansSlice';
import reviewsReducer from './reviewsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  books: booksReducer,
  loans: loansReducer,
  reviews: reviewsReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;