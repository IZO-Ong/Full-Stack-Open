import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  likeBlog,
  deleteBlog,
  addCommentToBlog,
} from "../reducers/blogReducer";
import { useState } from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  Divider,
  Paper,
} from "@mui/material";

const BlogView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));

  const user = useSelector((state) => state.user);

  if (!blog) return <Typography>Blog not found.</Typography>;

  const handleLike = () => dispatch(likeBlog(blog));

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id));
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addCommentToBlog(blog.id, comment));
      setComment("");
    }
  };

  const isOwner = String(user?.username) === String(blog.user?.username);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        by {blog.author}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        <a href={blog.url}>{blog.url}</a>
      </Typography>

      <Typography sx={{ mb: 1 }}>
        {blog.likes} likes
        <Button
          size="small"
          variant="outlined"
          onClick={handleLike}
          sx={{ ml: 1 }}
        >
          Like
        </Button>
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Added by {blog.user.name}
      </Typography>

      {isOwner && (
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Comments</Typography>

        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{ mt: 2, display: "flex", gap: 2 }}
        >
          <TextField
            fullWidth
            size="small"
            label="Add a comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>

        <Paper variant="outlined" sx={{ mt: 3 }}>
          <List>
            {blog.comments.map((c, i) => (
              <div key={i}>
                <ListItem>{c}</ListItem>
                {i < blog.comments.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlogView;
