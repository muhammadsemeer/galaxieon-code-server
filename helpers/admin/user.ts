import User from "../../models/User";
import { User as UserType } from "../../types/User";

export const getAllUsers = (): Promise<UserType[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let users: UserType[] = await User.findAll({ raw: true });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

export const getOneUser = (id: string): Promise<UserType> => {
  return new Promise(async (resolve, reject) => {
    try {
      let user: UserType = await User.findByPk(id, { raw: true });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

export const changeUserStatus = (
  id: string,
  status: string
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.update({ status }, { where: { id } });
      resolve()
    } catch (error) { reject(error) }
  });
};

const forDefault = { getAllUsers, getOneUser, changeUserStatus };

export default forDefault;
