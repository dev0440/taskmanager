import { Either } from './Either';

describe('Either', () => {
  it('should return right', () => {
    const either = Either.of(null, 10);

    expect(either).toBeInstanceOf(Either);
    expect(either.isRight()).toEqual(true);
    expect(either.isLeft()).toEqual(false);
    expect(either.getRight()).toEqual(10);
    expect(either.getLeft()).toEqual(undefined);
  });
  it('should return left', () => {
    const either = Either.of(10);

    expect(either).toBeInstanceOf(Either);
    expect(either.isRight()).toEqual(false);
    expect(either.isLeft()).toEqual(true);
    expect(either.getRight()).toEqual(undefined);
    expect(either.getLeft()).toEqual(10);
  });
});
