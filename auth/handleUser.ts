import { TokenPayload } from "google-auth-library";
import db from "../config/dbconnection";
import { User } from "../types/User";
const { User } = db;

export const createUserOrLogUser = async (
  payload: TokenPayload,
  cb: Function
): Promise<void> => {
  try {
    const { name, email, picture } = payload;
    let code: number = 200;
    let isUser: User = await User.findOne({
      where: { email: payload.email, status: true },
      attributes: ["id", "name", "email", "profileImage"],
    });
    if (!isUser) {
      isUser = await User.create({ name, email, profileImage: picture });
      code = 201;
    }
    cb(null, isUser, code);
  } catch (error) {
    cb(error);
  }
};
