import axios from "axios";
import { config } from "dotenv";

config();

export const githubVerfiy = (token: string): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      let { data } = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: token,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      let resp = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${data.access_token}`,
        },
      });
      resolve(resp.data);
    } catch (error) {
      reject(error);
    }
  });
};
