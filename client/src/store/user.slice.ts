import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUser } from '@interfaces/user.interface';

type UserState = {
  user: IUser | null;
  loading: boolean;
};

const initialState: UserState = {
  user: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
