import user_model from "../../db/models/user_model.js";
import { asyncHandling } from "./error_handling.js";
import { token_decode } from "./token_generation.js";

const auth = () => {
  return asyncHandling(async (req, res, next) => {
    const { auth } = req.headers;
    if (!auth)
      return next(
        new Error("You are not logged in. Please login to get access")
      );
    const decode = token_decode({ payload: auth });
    const user = await user_model
      .findById({ _id: decode.id })
      .select("name email");
    if (!user) return next(new Error("not register account"));
    req.user = user;

    return next();
  });
};

export default auth;
