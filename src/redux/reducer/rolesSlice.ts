import { createSlice } from '@reduxjs/toolkit';

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {role: ''},
  reducers: {
    setRoles: (state, action) => {
      console.log(action);
      
      state.role = action.payload
    }
  }
});

export const { setRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
