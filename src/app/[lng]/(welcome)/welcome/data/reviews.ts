/**
 * reviews.ts - Đánh giá từ người dùng Việt Nam
 */

export interface Review {
  id: string
  name: string
  contentKey: string
  avatar: string
  rating: number
}

export const reviewsColumnLeft: Review[] = [
  { id: 'review-1', name: 'Nguyễn Văn Minh', contentKey: 'reviews.review1.content', avatar: '', rating: 5 },
  { id: 'review-2', name: 'Trần Thị Hương', contentKey: 'reviews.review2.content', avatar: '', rating: 5 },
  { id: 'review-3', name: 'Lê Hoàng Nam', contentKey: 'reviews.review3.content', avatar: '', rating: 5 },
]

export const reviewsColumnMiddle: Review[] = [
  { id: 'review-4', name: 'Phạm Ngọc Mai', contentKey: 'reviews.review4.content', avatar: '', rating: 5 },
  { id: 'review-5', name: 'Đỗ Tuấn Anh', contentKey: 'reviews.review5.content', avatar: '', rating: 5 },
  { id: 'review-6', name: 'Bùi Thanh Hà', contentKey: 'reviews.review6.content', avatar: '', rating: 5 },
]

export const reviewsColumnRight: Review[] = [
  { id: 'review-7', name: 'Võ Quang Huy', contentKey: 'reviews.review7.content', avatar: '', rating: 5 },
  { id: 'review-8', name: 'Hoàng Đức Thắng', contentKey: 'reviews.review8.content', avatar: '', rating: 5 },
  { id: 'review-9', name: 'Ngô Minh Tâm', contentKey: 'reviews.review9.content', avatar: '', rating: 5 },
]

export const allReviews: Review[] = [
  ...reviewsColumnLeft,
  ...reviewsColumnMiddle,
  ...reviewsColumnRight,
]
