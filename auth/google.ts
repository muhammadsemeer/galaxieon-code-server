import { config } from "dotenv";
import { OAuth2Client, TokenPayload } from "google-auth-library";
config();
const authClient: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = (token: string): Promise<TokenPayload> => {
  return new Promise(async (resolve, reject) => {
    try {
      const ticket = await authClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
      });
      const payload: TokenPayload | undefined = ticket.getPayload();
      payload ? resolve(payload) : reject("Verification Failed");
    } catch (error) {
      reject(error);
    }
  });
};

export default googleAuth;
