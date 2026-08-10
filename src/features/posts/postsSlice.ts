/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getUserPosts } from '../../api/posts';
import { Post } from '../../types/Post';

type PostsState = {
  items: Post[];
  loaded: boolean;
  hasError: boolean;
  selectedPost: Post | null;
};

const initialState: PostsState = {
  items: [],
  loaded: false,
  hasError: false,
  selectedPost: null,
};

export const loadUserPosts = createAsyncThunk(
  'posts/loadUserPosts',
  async (userId: number) => {
    return getUserPosts(userId);
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
    clearPosts: state => {
      state.items = [];
      state.selectedPost = null;
      state.loaded = false;
      state.hasError = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadUserPosts.pending, state => {
        state.items = [];
        state.loaded = false;
        state.hasError = false;
        state.selectedPost = null;
      })
      .addCase(loadUserPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
        state.hasError = false;
      })
      .addCase(loadUserPosts.rejected, state => {
        state.items = [];
        state.loaded = true;
        state.hasError = true;
      });
  },
});

export const { setSelectedPost, clearPosts } = postsSlice.actions;

export const selectPosts = (state: { posts: PostsState }) => state.posts.items;

export const selectPostsLoaded = (state: { posts: PostsState }) =>
  state.posts.loaded;

export const selectPostsError = (state: { posts: PostsState }) =>
  state.posts.hasError;

export const selectSelectedPost = (state: { posts: PostsState }) =>
  state.posts.selectedPost;

export default postsSlice.reducer;
