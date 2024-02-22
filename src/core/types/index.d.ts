interface User {
  name: string;
  email: string;
  password: string;
}

type JWTToken = string;

interface UserStinupDTO {
  email: string;
  password: string;
}

export interface UserService {
  signup(
    userSignupDTO: UserStinupDTO,
  ): Promise<Either<Failure<AuthFailure>, JWTToken>>;
}
