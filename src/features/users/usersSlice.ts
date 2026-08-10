/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getUsers } from '../../api/users';
import { User } from '../../types/User';

type UsersState = {
  items: User[];
  loaded: boolean;
  hasError: boolean;
  author: User | null;
};

const initialState: UsersState = {
  items: [],
  loaded: false,
  hasError: false,
  author: null,
};

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
  return getUsers();
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setAuthor: (state, action: PayloadAction<User | null>) => {
      state.author = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadUsers.pending, state => {
        state.loaded = false;
        state.hasError = false;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
        state.hasError = false;
      })
      .addCase(loadUsers.rejected, state => {
        state.loaded = true;
        state.hasError = true;
      });
  },
});

export const { setAuthor } = usersSlice.actions;

export const selectUsers = (state: { users: UsersState }) => state.users.items;

export const selectAuthor = (state: { users: UsersState }) =>
  state.users.author;

export default usersSlice.reducer;
