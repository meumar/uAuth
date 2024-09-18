import ClientModel from "../../Models/ClientModel";
import { CustomError, Error401Exception } from "../../Exceptions/customError";
import { createClientAuthData, createAuthToken } from "../../Utils/Token";
import Client from "../../Interfaces/Client.interface";
import { wrongCredentials } from "../../Messages/ErrorExceptions";
class ClientService {
  private client = ClientModel;
  public async register(payload: Client): Promise<any | CustomError> {
    try {
      return await this.client.create(payload);
    } catch (error: any) {
      throw error;
    }
  }

  public async login(
    email: string,
    password: string
  ): Promise<any | CustomError> {
    try {
      const client = await this.client.findOne({ email });

      if (!client) {
        throw new Error401Exception(wrongCredentials);
      }

      if (await client.isValidPassword(password)) {
        const basicInfo = {
          email: client.email,
          name: client.name,
          logo: client.logo,
        };
        const payload = createClientAuthData(client);
        return {
          authToken: await createAuthToken(payload, "AUTH_TOKEN"),
          refreshToken: await createAuthToken(payload, "REFRESH_TOKEN"),
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

export default ClientService;
