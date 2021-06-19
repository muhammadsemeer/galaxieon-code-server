import { TokenPayload } from "google-auth-library";
import { User, UserToken } from "../types/User";
import UserModel from "../models/User";
import { Op } from "sequelize";
import Admin from "../models/Admin";

export const createUserOrLogUser = async (
  payload:
    | TokenPayload
    | { name: string; email: string | null; picture?: string },
  type: "google" | "github",
  cb: Function
): Promise<void> => {
  try {
    const { name, email, picture } = payload;
    let code: number = 200;
    let isUser: User = await UserModel.findOne({
      where: {
        email: payload.email,
        [Op.or]: [{ status: "active" }, { status: "blocked" }],
      },
      attributes: ["id", "name", "email", "profileImage", "status"],
    });
    if (!isUser) {
      let created: User = await UserModel.create({
        name,
        email,
        profileImage: picture,
        authType: type,
      });
      isUser = {
        id: created.id,
        name: created.name,
        email: created.email,
        profileImage: created.profileImage,
      };
      code = 201;
      cb(null, isUser, code);
    } else if (isUser?.status === "blocked") {
      cb({ status: 403, message: "User Blocked By ADMIN" });
    } else {
      cb(null, isUser, code);
    }
  } catch (error) {
    cb(error);
  }
};

export const checkUserActive = async ({ id }: UserToken) => {
  let { status } = await UserModel.findByPk(id, { attributes: ["status"] });
  return status === "blocked" || status === "deleted" ? true : false;
};

export const logAdmin = async (
  { email }: TokenPayload,
  cb: Function
): Promise<void> => {
  try {
    let admin: User = await Admin.findOne({
      where: {
        email: email,
      },
      attributes: ["id", "name", "email"],
    });
    console.log(admin)
    admin ? cb(null, admin) : cb({ status: 404, message: "Admin Not Found" });
  } catch (error) {
    cb(error);
  }
};
