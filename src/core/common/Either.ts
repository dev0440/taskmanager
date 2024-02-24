export abstract class Either<L, R> {
  abstract getLeft(): L | null;
  abstract getRight(): R | null;
  abstract isLeft(): boolean;
  abstract isRight(): boolean;
}

export class Right<R> extends Either<null, R> {
  private value: R;

  constructor(value: R) {
    super();
    this.value = value;
  }

  static of<T>(value: T) {
    return new Right(value);
  }

  isRight(): boolean {
    return true;
  }
  isLeft(): boolean {
    return false;
  }

  getRight(): R {
    return this.value;
  }
  getLeft(): null {
    return null;
  }
}

export class Left<L> extends Either<L, null> {
  private value: L;

  constructor(value: L) {
    super();
    this.value = value;
  }

  static of<T>(value: T) {
    return new Left(value);
  }

  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return true;
  }

  getRight(): null {
    return null;
  }
  getLeft(): L {
    return this.value;
  }
}
