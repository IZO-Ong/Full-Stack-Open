// components/UserList.jsx
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";

const UserList = () => {
  const blogs = useSelector((state) => state.blogs);

  const userBlogMap = {};
  blogs.forEach((blog) => {
    const user = blog.user;
    if (!user) return;
    const id = typeof user === "string" ? user : user.id;
    if (!userBlogMap[id]) {
      userBlogMap[id] = {
        name: user.name,
        id: id,
        blogCount: 0,
      };
    }
    userBlogMap[id].blogCount += 1;
  });

  const users = Object.values(userBlogMap);

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Users
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>
                <strong>Blogs Created</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link
                    to={`/users/${user.id}`}
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.blogCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
