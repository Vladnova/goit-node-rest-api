import User from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => User.findOne(filter);

export const saveUser = async (user) => {
  const hashPass = await bcrypt.hash(user.password, 10);
  return User.create({ ...user, password: hashPass });
};

export const updateUser = async (filter, data) =>
  User.findOneAndUpdate(filter, data);
