import User from "../../models/User";
import { User as UserType } from "../../types/User";

export const getAllUsers = (): Promise<UserType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.findAll({ raw: true });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const forDefault = { getAllUsers };

export default forDefault;
