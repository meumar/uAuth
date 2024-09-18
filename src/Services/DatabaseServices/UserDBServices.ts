import UserModel from "../../Models/UserModel";
import { CustomError, Error401Exception } from "../../Exceptions/customError";
import { createClientAuthData, createAuthToken } from "../../Utils/Token";
import { wrongCredentials } from "../../Messages/ErrorExceptions";
import User from "../../Interfaces/User.interface";
class UserService {
  private user = UserModel;

  public async login(
    primaryKey: string,
    password: string,
    collection: any
  ): Promise<any | CustomError> {
    try {
      const user: any = await this.user.findOne({ primaryKey });

      if (!user) {
        throw new Error401Exception(wrongCredentials);
      }

      if (await user.isValidPassword(password)) {
        const basicInfo = {
          _id: user._id,
          email: user.primaryKey,
          name: user.name,
        };
        return {
          authToken: await createAuthToken(
            basicInfo,
            "AUTH_TOKEN",
            collection.secretToken,
            collection.accessTokenLifetime
          ),
          refreshToken: await createAuthToken(
            basicInfo,
            "REFRESH_TOKEN",
            collection.secretToken,
            collection.refreshTokenLifetime
          ),
          clientInfo: basicInfo,
        };
      } else {
        throw new Error401Exception(wrongCredentials);
      }
    } catch (error: any) {
      throw error;
    }
  }
}

export default UserService;
