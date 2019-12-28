import {Author} from './author';

export interface Book {
  id?: string;
  title: string;
  authors: Author[];
  isbn: string;
  tags: string[];
}
