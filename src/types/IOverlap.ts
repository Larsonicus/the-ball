export interface ITouch<T> {
  object: T;
  callback: () => void;
}
