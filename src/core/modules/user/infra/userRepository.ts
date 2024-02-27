import { Repository } from '../../../common/repository';
import { User } from '../domain/user';

export class UserRepository implements Repository<User> {
  constructor(private store: User[] = []) {}

  save({ email, password }: any): Promise<User> {
    const id = Math.ceil(Math.random() * 1000000000).toString();
    const user = new User(id, email, password);
    this.store.push(user);

    return Promise.resolve(user);
  }

  get(data: any): Promise<User[]> {
    const users = this.store.filter((user) => user.getEmail() === data.email);
    return Promise.resolve(users);
  }
}
