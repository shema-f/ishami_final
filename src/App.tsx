import { RouterProvider } from 'react-router';
import { router } from './utils/routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { CommentsProvider } from './contexts/CommentsContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <BookmarksProvider>
            <CommentsProvider>
              <RouterProvider router={router} />
            </CommentsProvider>
          </BookmarksProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
