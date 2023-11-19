export type AuthorT = {
  id: number,
  firstname: string,
  lastname: string,
  surname: string,
  dateOfBirth: string, // ISO-string
}

export type BookT = {
  id: number,
  title: string,
  author: AuthorT,
  year: number,
  publisher: string,
}

export type TableColumnT<T> = {
  id: T,
  label: string,
}
