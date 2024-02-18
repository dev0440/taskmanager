import { HTTPError } from '../../common/errors';

export class UserAlreadyExistsHTTPError extends HTTPError {
  constructor() {
    super(409, 'User already exists');
  }
}
