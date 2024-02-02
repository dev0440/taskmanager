interface SingupCredentials {
  email: string;
  password: string;
}

export interface User {
  email: string;
  password: string;
}

interface AuthService {
  hashPassword: (password: string) => string;
}

interface UserService {
  saveUser: (user: User) => Promise<User>;
}

export class SignupController {
  constructor(
    private userRepository: UserService,
    private authService: AuthService,
  ) {}

  async signup(credentials: SingupCredentials): Promise<User> {
    const password = this.authService.hashPassword(credentials.password);

    const user = { email: credentials.email, password };
    await this.userRepository.saveUser({ email: credentials.email, password });

    return user;
  }
}
