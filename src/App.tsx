import { RouterProvider } from 'react-router';
import { router } from './utils/routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { BookmarksProvider } from './contexts/BookmarksContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <BookmarksProvider>
            <RouterProvider router={router} />
          </BookmarksProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
