import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from './context/AuthContext';
import AppLayout from './layout/AppLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RegisterPage from './pages/RegisterPage';
import { PlayerProvider } from './context/PlayerContext';
import SearchPage from './pages/SearchPage';
import LikedSongsPage from './pages/LikedSongsPage';
import PlaylistPage from './pages/PlaylistPage';
import { PlaylistProvider } from './context/PlaylistContext';
import ArtistPage from './pages/ArtistPage';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        )
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        )
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        )
      },
      {
        path: "/liked",
        element: (
          <ProtectedRoute>
            <LikedSongsPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/search",
        element: <SearchPage />
      },
      {
        path: "/playlist/:playlistId",
        element: (
          <ProtectedRoute>
            <PlaylistPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/artist/:artistId",
        element: (
          <ArtistPage />
        )
      }
    ]
  }
])

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlaylistProvider>
          <PlayerProvider>
            <RouterProvider router={router} />

            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </PlayerProvider>
        </PlaylistProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App