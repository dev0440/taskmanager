function add(one: number, two: number): number {
  return one + two;
}

describe('add two numbers', () => {
  it('add two numbers', () => {
    expect(3).toEqual(add(2, 1));
  });
});
