import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  return (
    <Card variant="outlined" sx={{ my: 2 }}>
      <CardContent>
        <Typography
          component={Link}
          to={`/blogs/${blog.id}`}
          variant="h6"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          {blog.title} {blog.author}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Blog;
