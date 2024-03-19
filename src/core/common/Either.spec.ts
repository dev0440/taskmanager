import { Either } from './Either';

describe('Either', () => {
  it('should return left', () => {
    const either = Either.left(10);

    expect(either).toBeInstanceOf(Either);
    expect(either.isRight()).toEqual(false);
    expect(either.isLeft()).toEqual(true);
    expect(either.getRight()).toEqual(null);
    expect(either.getLeft()).toEqual(10);
  });
  it('should return right', () => {
    const either = Either.right(10);

    expect(either).toBeInstanceOf(Either);
    expect(either.isRight()).toEqual(true);
    expect(either.isLeft()).toEqual(false);
    expect(either.getRight()).toEqual(10);
    expect(either.getLeft()).toEqual(null);
  });
});
