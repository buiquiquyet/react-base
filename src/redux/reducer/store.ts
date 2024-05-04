import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReduce'; 

const store = configureStore({
  reducer: rootReducer
});

export default store;
