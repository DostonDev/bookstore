export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const QUERY_KEYS = {
  books: 'books',
  book: 'book',
  newBooks: 'newBooks',
  popularBooks: 'popularBooks',
  bookmarks: 'bookmarks',
  likes: 'likes',
  comments: 'comments',
  ratings: 'ratings',
  downloads: 'downloads',
  profile: 'profile',
  users: 'users',
  adminStats: 'adminStats',
  allUsers: 'allUsers',
} as const

export const PAGE_SIZE = 12

export const BOOK_CATEGORIES = [
  'Technology',
  'Business',
  'Science',
  'Fiction',
  'Self-Help',
  'Design',
  'Marketing',
  'Finance',
  'Health',
  'History',
  'Philosophy',
  'Art',
] as const

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Downloaded', value: 'downloads' },
] as const

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dilnoza Yusupova',
    role: 'Adabiyot o\'qituvchisi',
    avatar: 'DY',
    content: 'Kitobxona platformasi mening dars tayyorlash jarayonimni butunlay o\'zgartirdi. O\'zbek va jahon adabiyotining durdonalari bir joyda — bu ajoyib!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jasur Toshmatov',
    role: 'Yozuvchi va shoir',
    avatar: 'JT',
    content: 'Navoiy, Cho\'lpon, Fitrat asarlarini bir platformada topish mumkinligi — bu katta yutuq. Interfeys qulay, kitoblar sifatli.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mohira Karimova',
    role: 'Talaba, ToshDU',
    avatar: 'MK',
    content: 'Kurs ishim uchun kerakli adabiy asarlarni osongina topdim. Bepul kitoblar ham juda ko\'p. Tavsiya etaman!',
    rating: 5,
  },
]

export const STATS = [
  { label: 'Adabiy asar', value: '5,000+' },
  { label: 'Kitobxon', value: '30,000+' },
  { label: 'Yuklanmalar', value: '200K+' },
  { label: 'Muallif', value: '500+' },
]
