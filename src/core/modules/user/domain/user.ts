import { IUser } from './types';

export class User implements IUser {
  constructor(
    public id: string,
    public email: string,
    private password: string,
  ) {
    console.log(`User with ${email} created`);
  }
  getEmail(): string {
    return this.email;
  }
  getId(): string {
    return this.id;
  }
}
