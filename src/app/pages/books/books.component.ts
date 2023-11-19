import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiAlertService, TuiButtonModule, TuiLabelModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputYearModule,
  tuiItemsHandlersProvider,
  TuiSelectModule
} from "@taiga-ui/kit";
import {TuiComparator, TuiTableModule} from "@taiga-ui/addon-table";
import {AuthorT, BookT, TableColumnT} from "../../helpers/models";
import {tuiDefaultSort, TuiLetModule, TuiYear} from "@taiga-ui/cdk";
import {LocalStorageService} from "../../helpers/local-storage.service";
import {CommonModule} from "@angular/common";
import {TuiInputCardModule} from "@taiga-ui/addon-commerce";

const stringifyAuthor = (item: AuthorT): string => {
  return `${item.firstname} ${item.lastname} ${item.surname}`;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiButtonModule, TuiInputCardModule, TuiInputDateModule, TuiInputModule, TuiLabelModule, TuiTableModule, TuiTextfieldControllerModule, TuiInputYearModule, TuiSelectModule, TuiDataListWrapperModule, TuiLetModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiItemsHandlersProvider({
      stringify: stringifyAuthor,
    }),
  ]
})

export class BooksComponent implements OnInit {
  public authors: AuthorT[] = [];
  public books: BookT[] = [];

  public tableColumns: TableColumnT<keyof BookT>[] = [
    {id: 'id', label: 'ID'},
    {id: 'title', label: 'Название',},
    {id: 'author', label: 'Автор',},
    {id: 'publisher', label: 'Издатель',},
    {id: 'year', label: 'Год',},
  ];
  public columns: string[] = this.tableColumns.map(c => c.id);

  readonly bookForm = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required]),
    author: new FormControl<AuthorT | null>(null, [Validators.required]),
    publisher: new FormControl<string | null>(null, [Validators.required]),
    year: new FormControl<number | null>(null, [Validators.required])
  })

  private readonly lsService = inject(LocalStorageService);
  private readonly alertService = inject(TuiAlertService);

  ngOnInit() {
    this.getAuthors();
    this.getBooks();
  }

  getAuthors() {
    this.authors = this.lsService.getAuthors().sort((a, b) => a.lastname.localeCompare(b.lastname));
  }

  getBooks() {
    this.books = this.lsService.getBooks();
  }

  getError(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  getTableSorter(type: keyof BookT): TuiComparator<BookT> | null {
    if (type === 'id') return null;
    return (a, b) =>
      tuiDefaultSort(a[type], b[type]);
  }

  addBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      this.alertService
        .open('Не все поля формы правильно заполнены', {
          label: 'Ошибка валидации',
          status: 'error',
          autoClose: 3000,
        })
        .subscribe();
      return;
    }

    const formValue = this.bookForm.value;
    const body: BookT = {
      id: this.findMaxIndexInBooks() + 1,
      title: formValue.title as string,
      author: stringifyAuthor(formValue.author as AuthorT),
      publisher: formValue.publisher as string,
      year: formValue.year || 0,
    }

    if (this.checkIsBookExist(body)) {
      this.alertService
        .open('Автор с таким именем и фамилией уже существует', {
          label: 'Ошибка уникальности',
          status: 'error',
          autoClose: 3000,
        })
        .subscribe();
      return;
    }

    const newBooks = [...this.books, body];
    this.lsService.setBooks(newBooks);
    this.alertService
      .open('Книга добавлена', {
        label: 'Успешно добавлено',
        status: 'success',
        autoClose: 3000,
      })
      .subscribe();
    this.bookForm.reset();
    this.getBooks();
  }

  private findMaxIndexInBooks(): number {
    let maxIndex = 0;
    for (let i = 0; i < this.books.length; i++) {
      if (this.books[i].id > maxIndex) {
        maxIndex = this.books[i].id;
      }
    }
    return maxIndex;
  }

  private checkIsBookExist(book: BookT): boolean {
    for (let i = 0; i < this.books.length; i++) {
      if (
        this.books[i].title === book.title
        && this.books[i].author === book.author
        && this.books[i].publisher === book.publisher
        && this.books[i].year === book.year
      ) {
        return true;
      }
    }
    return false;
  }
}
