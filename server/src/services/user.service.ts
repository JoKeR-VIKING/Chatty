import { ObjectId } from 'mongodb';

import UserModel from '@mongo/user.schema';
import { IUserDocument } from '@interfaces/user.interface';

class UserService {
  public async login(user: IUserDocument) {
    const query = { googleEmail: user?.googleEmail };

    return await UserModel.findOneAndUpdate(
      query,
      { $setOnInsert: user },
      {
        upsert: true,
        new: true,
      },
    ).exec();
  }

  public async searchUser(
    currentUserEmail: string,
    searchPrefix: string,
  ): Promise<IUserDocument[]> {
    const query = {
      $and: [
        { googleEmail: { $ne: currentUserEmail } },
        {
          $or: [
            { googleEmail: { $regex: `^${searchPrefix}`, $options: 'i' } },
            { googleName: { $regex: `^${searchPrefix}`, $options: 'i' } },
          ],
        },
      ],
    };

    return await UserModel.find(query).exec();
  }

  public async getUserDetailsById(
    id: string | ObjectId,
  ): Promise<IUserDocument> {
    const query = { _id: id };

    return (await UserModel.findOne(query).exec()) as IUserDocument;
  }

  public async updateProfile(
    profileName: string,
    profilePicture: string,
    _id: string,
  ) {
    const query = { _id: new ObjectId(_id) };

    return await UserModel.findByIdAndUpdate(
      query,
      {
        $set: { googleName: profileName, googlePicture: profilePicture },
      },
      { $new: true },
    ).exec();
  }
}

const userService: UserService = new UserService();
export default userService;
