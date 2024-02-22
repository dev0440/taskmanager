export class Either<L, R> {
  right?: R;
  left?: L;

  constructor(l: L, r?: R) {
    if (l) {
      this.left = l;
    } else if (r) {
      this.right = r;
    }
  }
  isRight(): boolean {
    return !!this.right && !this.left;
  }
  isLeft(): boolean {
    return !!this.left && !this.right;
  }
  getRight(): R | undefined {
    return this.right;
  }
  getLeft(): L | undefined {
    return this.left;
  }

  static of<L, R>(l: L, r?: R) {
    return new Either(l, r);
  }
}
