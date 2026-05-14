import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

// Auth
const LoginPage = lazy(() => import('@/modules/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/modules/auth/RegisterPage'))

// Main
const HomePage = lazy(() => import('@/modules/home/HomePage'))
const BooksPage = lazy(() => import('@/modules/books/BooksPage'))
const BookDetailPage = lazy(() => import('@/modules/books/BookDetailPage'))
const BookmarksPage = lazy(() => import('@/modules/bookmarks/BookmarksPage'))
const LikedBooksPage = lazy(() => import('@/modules/liked/LikedBooksPage'))
const ProfilePage = lazy(() => import('@/modules/profile/ProfilePage'))
const DownloadsPage = lazy(() => import('@/modules/profile/DownloadsPage'))

// New: Categories
const CategoriesPage = lazy(() => import('@/modules/categories/CategoriesPage'))
const CategoryDetailPage = lazy(() => import('@/modules/categories/CategoryDetailPage'))

// New: Authors
const AuthorsPage = lazy(() => import('@/modules/authors/AuthorsPage'))
const AuthorDetailPage = lazy(() => import('@/modules/authors/AuthorDetailPage'))

// New: Search
const SearchPage = lazy(() => import('@/modules/search/SearchPage'))

// New: Blog
const BlogListPage = lazy(() => import('@/modules/blog/BlogListPage'))
const BlogDetailPage = lazy(() => import('@/modules/blog/BlogDetailPage'))

// New: PDF Reader
const PDFReaderPage = lazy(() => import('@/modules/reader/PDFReaderPage'))

// Admin
const AdminDashboardPage = lazy(() => import('@/modules/admin/AdminDashboardPage'))
const AdminBooksPage = lazy(() => import('@/modules/admin/AdminBooksPage'))
const AdminUsersPage = lazy(() => import('@/modules/admin/AdminUsersPage'))
const AdminCategoriesPage = lazy(() => import('@/modules/admin/AdminCategoriesPage'))
const AdminAuthorsPage = lazy(() => import('@/modules/admin/AdminAuthorsPage'))
const AdminBlogsPage = lazy(() => import('@/modules/admin/AdminBlogsPage'))
const AdminAnalyticsPage = lazy(() => import('@/modules/admin/AdminAnalyticsPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'books/:id', element: <BookDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'categories/:id', element: <CategoryDetailPage /> },
      { path: 'authors', element: <AuthorsPage /> },
      { path: 'authors/:slug', element: <AuthorDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogDetailPage /> },
      {
        path: 'bookmarks',
        element: <ProtectedRoute><BookmarksPage /></ProtectedRoute>,
      },
      {
        path: 'liked',
        element: <ProtectedRoute><LikedBooksPage /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: 'downloads',
        element: <ProtectedRoute><DownloadsPage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '/read/:bookId',
    element: <ProtectedRoute><PDFReaderPage /></ProtectedRoute>,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'books', element: <AdminBooksPage /> },
      { path: 'users', element: <AdminUsersPage /> },
{ path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'authors', element: <AdminAuthorsPage /> },
      { path: 'blogs', element: <AdminBlogsPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
    ],
  },
])

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
