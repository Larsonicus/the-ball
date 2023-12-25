export interface ITouch<T, R = void> {
  object: T;
  callback?: (object: R) => void;
}
