import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import UserList from "./components/UserList";
import User from "./components/User";
import BlogView from "./components/BlogView";

import blogService from "./services/blogs";
import loginService from "./services/login";

import { showNotification } from "./reducers/notificationReducer";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setUser, clearUser, initializeUser } from "./reducers/userReducer";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from "@mui/material";

const App = () => {
  const blogFormRef = useRef();
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm handleLogin={handleLogin} />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm handleCreate={addBlog} />
    </Togglable>
  );

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await dispatch(createBlog(blogObject));
      blogFormRef.current.toggleVisibility();
      dispatch(
        showNotification(
          `a new blog ${newBlog.payload.title} by ${newBlog.payload.author} added`,
          "success",
          5,
        ),
      );
    } catch {
      dispatch(showNotification("Failed to create blog", "error", 5));
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
    } catch {
      dispatch(showNotification("Wrong username or password", "error", 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h4" sx={{ my: 4 }}>
          Log in to application
        </Typography>
        <Notification />
        {loginForm()}
      </Container>
    );
  }

  return (
    <Router>
      <Container>
        <AppBar position="static" sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Blogs
              </Button>
              <Button
                component={Link}
                to="/users"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Users
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.name} logged in
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Notification />

        <Routes>
          <Route
            path="/"
            element={
              <Box>
                {blogForm()}
                {blogs.map((blog) => (
                  <Blog key={blog.id} blog={blog} />
                ))}
              </Box>
            }
          />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
