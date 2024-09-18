type RequestInterface = {
  Variables: {
    client: {
      _id: string;
      name: string;
      email: string;
      status: string;
    };
    collection: {
      _id: string;
      name: string;
      callbackUrl: string;
      verificationToken: string;
      clientId: any;
      secretToken: string;
      accessTokenLifetime: number;
      refreshTokenLifetime: number;
      authKey: string;
      status: string;
    };
    user: {
      _id: string;
      name: string;
      primaryKey: string;
      customArgs: string;
    }
  };
};
