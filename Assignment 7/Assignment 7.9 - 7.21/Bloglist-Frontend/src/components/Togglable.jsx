import { useState, forwardRef, useImperativeHandle } from "react";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  if (!visible) {
    return (
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={toggleVisibility}>
          {buttonLabel}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
      {children}

      <Button
        variant="outlined"
        color="secondary"
        onClick={toggleVisibility}
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
