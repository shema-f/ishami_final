import { RouterProvider } from 'react-router';
import { router } from './utils/routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
