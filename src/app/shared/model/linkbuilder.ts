export class LinkBuilder {
  // Add here the links
  static readonly BOOK = 'books';
  static readonly ISBNBOOKS = 'isbnbooks';
  static readonly AMAZONBOOKS = 'amazonbooks';
  static readonly SEARCH = 'search';
  static readonly TITLE = 'title';

  static build(init: string, ...varargs: string[]): string {
    return init + '/' + varargs.join('/');
  }
}
