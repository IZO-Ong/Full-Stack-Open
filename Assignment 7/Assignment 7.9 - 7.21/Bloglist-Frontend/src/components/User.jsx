import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";

const User = () => {
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);

  const userBlogs = blogs.filter((blog) => {
    if (!blog.user) return false;
    const blogUserId = typeof blog.user === "string" ? blog.user : blog.user.id;
    return blogUserId === id;
  });

  if (userBlogs.length === 0) {
    return (
      <Typography sx={{ mt: 4 }}>
        This user has no blogs or does not exist.
      </Typography>
    );
  }

  const userName =
    typeof userBlogs[0].user === "string" ? "User" : userBlogs[0].user.name;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {userName}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Added blogs
      </Typography>

      <Paper variant="outlined" sx={{ mt: 2 }}>
        <List>
          {userBlogs.map((blog, index) => (
            <div key={blog.id}>
              <ListItem>
                <ListItemText primary={blog.title} />
              </ListItem>
              {index < userBlogs.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default User;
