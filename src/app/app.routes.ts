import {Routes} from '@angular/router';
import {AuthorsComponent} from "./pages/authors/authors.component";
import {BooksComponent} from "./pages/books/books.component";

export const routes: Routes = [
  {
    path: 'authors', component: AuthorsComponent,
  },
  {
    path: 'books', component: BooksComponent,
  },
  {
    path: '**', redirectTo: 'authors',
  }
];
