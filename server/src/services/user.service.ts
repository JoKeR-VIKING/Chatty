import UserModel from '@mongo/user.schema';
import { IUserDocument } from '@interfaces/user.interface';

class UserService {
  public async login(user: IUserDocument) {
    const query = { googleEmail: user?.googleEmail };

    return await UserModel.findOneAndUpdate(query, user, {
      upsert: true,
      new: true,
    }).exec();
  }
}

const userService: UserService = new UserService();
export default userService;
