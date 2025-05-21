import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const BlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    handleCreate({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Box
      component="form"
      onSubmit={addBlog}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
    >
      <Typography variant="h6">Create a new blog</Typography>

      <TextField
        label="Title"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="Author"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="URL"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        fullWidth
        size="small"
      />

      <Button type="submit" variant="contained" color="primary">
        Create
      </Button>
    </Box>
  );
};

export default BlogForm;
