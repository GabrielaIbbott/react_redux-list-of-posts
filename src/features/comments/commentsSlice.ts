/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as commentsApi from '../../api/comments';
import { Comment, CommentData } from '../../types/Comment';

type CommentsState = {
  items: Comment[];
  loaded: boolean;
  hasError: boolean;
};

const initialState: CommentsState = {
  items: [],
  loaded: false,
  hasError: false,
};

export const loadPostComments = createAsyncThunk(
  'comments/loadPostComments',
  async (postId: number) => {
    return commentsApi.getPostComments(postId);
  },
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, data }: { postId: number; data: CommentData }) => {
    return commentsApi.createComment({
      ...data,
      postId,
    });
  },
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: number) => {
    await commentsApi.deleteComment(commentId);

    return commentId;
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: state => {
      state.items = [];
      state.loaded = false;
      state.hasError = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadPostComments.pending, state => {
        state.items = [];
        state.loaded = false;
        state.hasError = false;
      })
      .addCase(loadPostComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
        state.hasError = false;
      })
      .addCase(loadPostComments.rejected, state => {
        state.items = [];
        state.loaded = true;
        state.hasError = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createComment.rejected, state => {
        state.hasError = true;
      })
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter(
            comment => comment.id !== action.payload,
          );
        },
      );
  },
});

export const { clearComments } = commentsSlice.actions;

export const selectComments = (state: { comments: CommentsState }) =>
  state.comments.items;

export const selectCommentsLoaded = (state: { comments: CommentsState }) =>
  state.comments.loaded;

export const selectCommentsError = (state: { comments: CommentsState }) =>
  state.comments.hasError;

export default commentsSlice.reducer;
