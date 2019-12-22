import {Book} from './book';

export interface Isbnbook extends Book {
  averageRating: number;
  isbn13: string;
  languageCode: string;
  numPages: number;
  ratingsCount: number;
  textReviewsCount: number;
}
