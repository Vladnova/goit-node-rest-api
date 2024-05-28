import { ctrlWrap } from "../decorators/ctrlWrap.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import * as userServices from "../services/userServices.js";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

import gravatar from "gravatar";

const register = async (req, res) => {
  const { email } = req.body;

  const hasEmailInDB = await userServices.findUser({ email });
  if (hasEmailInDB) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(
    email,
    { s: "200", r: "x", d: "monsterid" },
    false
  );
  const user = await userServices.saveUser({ ...req.body, avatarURL });

  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userInDB = await userServices.findUser({ email });
  if (!userInDB) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await compareHash(password, userInDB.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: userInDB._id,
  };

  const token = createToken(payload);

  await userServices.updateUser({ _id: payload.id }, { token });

  res.json({
    token,
    user: {
      email: userInDB.email,
      subscription: userInDB.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await userServices.updateUser({ _id }, { token: null });

  res.status(204).json();
};
const changeSubscription = async (req, res, next) => {
  const { subscription: newSubscription } = req.body;
  const { _id, subscription } = req.user;

  if (newSubscription === subscription) {
    return next(HttpError(409, `You already have ${subscription} level`));
  }

  const result = await userServices.updateUser(
    { _id },
    { subscription: newSubscription }
  );

  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

const changeAvatar = async (req, res, next) => {
  const { path: oldPath, filename } = req.file;
  const { _id } = req.user;

  const image = await Jimp.read(oldPath);
  await image.resize(250, 250).writeAsync(oldPath);

  const avatarsPath = path.resolve("public", "avatars");
  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await userServices.updateUser({ _id }, { avatarURL });

  res.status(200).json({ avatarURL });
};

export default {
  register: ctrlWrap(register),
  login: ctrlWrap(login),
  getCurrent: ctrlWrap(getCurrent),
  logout: ctrlWrap(logout),
  changeSubscription: ctrlWrap(changeSubscription),
  changeAvatar: ctrlWrap(changeAvatar),
};
