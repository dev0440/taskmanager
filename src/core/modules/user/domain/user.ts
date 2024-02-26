import { IUser } from './types';

export class User implements IUser {
  constructor(
    private id: string,
    private email: string,
    private password: string,
  ) {
    console.log(`User with ${email} created`);
  }
}
