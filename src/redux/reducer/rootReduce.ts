// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import rolesSlice from './rolesSlice';

const rootReducer = combineReducers({
  roles: rolesSlice,
});

export default rootReducer;
