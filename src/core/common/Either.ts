export class Either<L, R> {
  constructor(
    private left: L extends null ? null : L,
    private right: R extends null ? null : R,
  ) {}
  getLeft(): L extends null ? null : L {
    return this.left;
  }
  getRight(): R extends null ? null : R {
    return this.right;
  }

  isLeft(): boolean {
    return this.right === null;
  }
  isRight(): boolean {
    return this.left === null;
  }

  static left<T>(left: T extends null ? null : T) {
    return new Either<T, null>(left, null);
  }
  static right<T>(right: T extends null ? null : T) {
    return new Either<null, T>(null, right);
  }
}

export type Result<L, R> = Either<L, null> | Either<null, R>;
