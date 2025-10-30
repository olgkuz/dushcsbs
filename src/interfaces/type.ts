export interface IType {
  id?: string; // виртуальное поле от Mongoose (строковый _id)
  name: string;
  description: string;
  img?: string;
  readonly imgUrl?: string;
}
