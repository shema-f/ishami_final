import { RouterProvider } from 'react-router';
import { router } from './utils/routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { CommentsProvider } from './contexts/CommentsContext';
import { ReadingModeProvider } from './contexts/ReadingModeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <BookmarksProvider>
            <CommentsProvider>
              <ReadingModeProvider>
                <NotificationsProvider>
                  <RouterProvider router={router} />
                </NotificationsProvider>
              </ReadingModeProvider>
            </CommentsProvider>
          </BookmarksProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
