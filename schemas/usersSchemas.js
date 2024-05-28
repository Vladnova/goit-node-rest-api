import Joi from "joi";
import { emailRegexp, subscriptions } from "../constants/user-constants.js";
import HttpError from "../helpers/HttpError.js";

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required().min(5),
});

export const changeSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptions)
    .required()
    .error(
      new Error(
        `Subscription must be one of the following values: ${subscriptions.join(
          ", "
        )}`
      )
    ),
});


