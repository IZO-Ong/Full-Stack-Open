import { useSelector } from "react-redux";
import { Alert, Box } from "@mui/material";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification || !notification.message) return null;

  return (
    <Box sx={{ my: 2 }}>
      <Alert severity={notification.type === "success" ? "success" : "error"}>
        {notification.message}
      </Alert>
    </Box>
  );
};

export default Notification;
