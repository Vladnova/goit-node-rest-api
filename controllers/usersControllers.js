import { ctrlWrap } from "../decorators/ctrlWrap.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import * as userServices from "../services/userServices.js";

const register = async (req, res) => {
  const { email } = req.body;
  const hasEmailInDB = await userServices.findUser({ email });
  if (hasEmailInDB) {
    throw HttpError(409, "Email in use");
  }
  const user = await userServices.saveUser(req.body);

  res.status(201).json({
    email: user.email,
    subscription: user.subscription,
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

export default {
  register: ctrlWrap(register),
  login: ctrlWrap(login),
  getCurrent: ctrlWrap(getCurrent),
  logout: ctrlWrap(logout),
  changeSubscription: ctrlWrap(changeSubscription),
};
