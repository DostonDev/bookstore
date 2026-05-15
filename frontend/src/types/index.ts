export type Role = 'USER' | 'ADMIN'
export type BlogStatus = 'DRAFT' | 'PUBLISHED'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string | null
  createdAt: string
  updatedAt?: string
  _count?: {
    bookmarks: number
    downloads: number
    comments: number
    likes: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string | null
  parent?: { id: string; name: string; slug: string } | null
  children?: Category[]
  createdAt: string
  _count?: { books: number; blogs: number }
}

export interface Author {
  id: string
  name: string
  slug: string
  bio?: string
  avatarUrl?: string
  website?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  createdAt: string
  books?: Book[]
  _count?: { books: number }
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
  _count?: { books: number }
}

export interface Book {
  id: string
  title: string
  description?: string
  pdfUrl: string
  coverUrl?: string
  price: number
  downloadCount: number
  likeCount: number
  categoryId?: string
  authorId?: string
  category?: { id: string; name: string; slug: string }
  author?: { id: string; name: string; slug: string; avatarUrl?: string; bio?: string }
  tags?: Tag[]
  createdAt: string
  updatedAt: string
  _avgRating?: number | null
  _count?: { ratings: number; comments: number; likes: number }
  isBookmarked?: boolean
  isLiked?: boolean
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
  readingTime: number
  status: BlogStatus
  authorId?: string
  categoryId?: string
  author?: { id: string; name: string; slug: string; avatarUrl?: string }
  category?: { id: string; name: string; slug: string }
  tags?: Tag[]
  createdAt: string
  updatedAt: string
}

export interface ReadingProgress {
  id: string
  userId: string
  bookId: string
  book?: { id: string; title: string; coverUrl?: string }
  currentPage: number
  totalPages: number
  percentage: number
  completed: boolean
  readingTime: number
  lastReadAt: string
}

export interface Bookmark {
  id: string
  userId: string
  bookId: string
  book?: Book
  createdAt: string
}

export interface DownloadHistory {
  id: string
  userId: string
  bookId: string
  book?: { id: string; title: string; coverUrl?: string }
  createdAt: string
}

export interface Comment {
  id: string
  text: string
  userId: string
  bookId: string
  user?: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  value: number
  userId: string
  bookId: string
  createdAt: string
}

export interface RatingStats {
  average: number
  total: number
  userRating?: number | null
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface BooksResponse {
  books?: Book[]
  data?: Book[]
  pagination?: Pagination
  meta?: Meta
}

export interface DownloadsResponse {
  downloads: DownloadHistory[]
  pagination: Pagination
}

export interface PaginatedApiResponse<T = unknown> {
  success: boolean
  message?: string
  data: T[]
  meta: Meta
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AdminStats {
  stats: {
    totalUsers: number
    totalBooks: number
    totalDownloads: number
    revenue?: number
  }
  topBooks: Book[]
  topCategories: Category[]
  topAuthors: Author[]
  recentUsers: User[]
  charts: {
    userGrowth: ChartData[]
    downloadGrowth: ChartData[]
  }
}

export interface UserDashboard {
  bookmarks: number
  downloads: number
  readingProgress: ReadingProgress[]
  recentActivity: DownloadHistory[]
}

export interface SearchResult {
  type: 'book' | 'author' | 'category' | 'blog' | 'tag'
  id: string
  [key: string]: unknown
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}
