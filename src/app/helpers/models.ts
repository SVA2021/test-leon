export type AuthorT = {
  id: number,
  name: string,
  lastName: string,
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
