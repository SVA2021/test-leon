import { Injectable } from '@angular/core';
import {AuthorT, BookT} from "./models";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  readonly authorsKey = 'authors';
  readonly booksKey = 'books';

  public getAuthors(): AuthorT[] {
    let result = this.getItemFromLocalStorage(this.authorsKey);
    if (result) {
      return JSON.parse(JSON.parse(result));
    } else {
      return [];
    }
  }

  public setAuthors(authors: AuthorT[]): void {
    this.setItemToLocalStorage(this.authorsKey, JSON.stringify(authors));
  }

  public getBooks(): BookT[] {
    let result = this.getItemFromLocalStorage(this.booksKey);
    return result ? JSON.parse(result) : [];
  }

  public setBooks(books: BookT[]): void {
    this.setItemToLocalStorage(this.booksKey, JSON.stringify(books));
  }

  private getItemFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key) ?? null;
  }

  private setItemToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
