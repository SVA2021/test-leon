import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorT, TableColumnT} from "../../helpers/models";
import {LocalStorageService} from "../../helpers/local-storage.service";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiDay} from "@taiga-ui/cdk";
import {TuiAlertService, TuiButtonModule, TuiLabelModule, TuiTextfieldControllerModule} from "@taiga-ui/core";
import {DateService} from "../../helpers/date.service";
import {TuiInputDateModule, TuiInputModule} from "@taiga-ui/kit";
import {TuiTableModule} from "@taiga-ui/addon-table";

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiInputModule, TuiLabelModule, TuiTextfieldControllerModule, TuiButtonModule, TuiInputDateModule, TuiTableModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorsComponent implements OnInit {
  public authors: AuthorT[] = [];
  public tableColumns: TableColumnT<keyof AuthorT>[] = [
    {id: 'id', label: 'ID'},
    {id: 'firstname', label: 'Имя',},
    {id: 'lastname', label: 'Фамилия',},
    {id: 'surname', label: 'Отчество',},
    {id: 'dateOfBirth', label: 'Дата рождения',},
  ];
  public columns: string[] = this.tableColumns.map(c => c.id);

  readonly authorForm = new FormGroup({
    firstname: new FormControl<string | null>(null, [Validators.required]),
    lastname: new FormControl<string | null>(null, [Validators.required]),
    surname: new FormControl<string | null>(null, [Validators.required]),
    dateOfBirth: new FormControl<TuiDay | null>(null, [Validators.required])
  })

  private readonly lsService = inject(LocalStorageService);
  private readonly dateService = inject(DateService);
  private readonly alertService = inject(TuiAlertService);

  ngOnInit() {
    this.getAuthors();
  }

  getAuthors() {
    this.authors = this.lsService.getAuthors();
  }

  getError(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  addAuthor() {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      this.alertService
        .open('Не все поля формы правильно заполнены', {
          label: 'Ошибка валидации',
          status: 'error',
          autoClose: 3000,
        })
        .subscribe();
      return;
    }

    const formValue = this.authorForm.value;
    const body: AuthorT = {
      id: this.findMaxIndexInAuthors() + 1,
      firstname: formValue.firstname as string,
      lastname: formValue.lastname as string,
      surname: formValue.surname as string,
      dateOfBirth: this.dateService.convertTuiDayToISOString(formValue.dateOfBirth as TuiDay),
    }

    if (this.checkIsAuthorExistByDateAndName(body)) {
      this.alertService
        .open('Автор с таким именем и фамилией уже существует', {
          label: 'Ошибка уникальности',
          status: 'error',
          autoClose: 3000,
        })
        .subscribe();
      return;
    }

    const newAuthors = [...this.authors, body];
    this.lsService.setAuthors(newAuthors);
    this.alertService
      .open('Автор добавлен', {
        label: 'Успешно добавлено',
        status: 'success',
        autoClose: 3000,
      })
      .subscribe();
    this.authorForm.reset();
    this.getAuthors();
  }

  private findMaxIndexInAuthors(): number {
    let maxIndex = 0;
    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i].id > maxIndex) {
        maxIndex = this.authors[i].id;
      }
    }
    return maxIndex;
  }

  private checkIsAuthorExistByDateAndName(author: AuthorT): boolean {
    for (let i = 0; i < this.authors.length; i++) {
      if (
        this.authors[i].firstname === author.firstname
        && this.authors[i].lastname === author.lastname
        && this.authors[i].surname === author.surname
        && this.authors[i].dateOfBirth === author.dateOfBirth
      ) {
        return true;
      }
    }
    return false;
  }
}
