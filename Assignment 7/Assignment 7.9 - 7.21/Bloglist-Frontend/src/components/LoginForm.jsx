import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Log in to the application
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Username"
          data-testid="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Paper>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
