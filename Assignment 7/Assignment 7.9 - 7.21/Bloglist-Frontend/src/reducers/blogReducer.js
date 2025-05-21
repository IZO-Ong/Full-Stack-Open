import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes);
    },
    appendBlog(state, action) {
      state.push(action.payload);
      return state.sort((a, b) => b.likes - a.likes);
    },
    updateBlog(state, action) {
      const updated = action.payload;
      const newState = state.map((blog) =>
        blog.id === updated.id ? updated : blog,
      );
      return newState.sort((a, b) => b.likes - a.likes);
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject);
    dispatch(appendBlog(newBlog));
    return { payload: newBlog };
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === "string" ? blog.user : blog.user.id,
    };
    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    dispatch(updateBlog(returnedBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export const addCommentToBlog = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment);
    dispatch(updateBlog(updatedBlog));
  };
};

export default blogSlice.reducer;
