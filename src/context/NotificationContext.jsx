import { createContext, useContext } from 'react';

// This is a context provider, the eslint warning about Fast Refresh can be ignored
// as we're exporting both the hook and the context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
