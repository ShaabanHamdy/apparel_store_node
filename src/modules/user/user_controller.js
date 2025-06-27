import bcryptjs from "bcryptjs";
import user_model from "../../../db/models/user_model.js";
import { token_generation } from "../../utils/token_generation.js";
// import { customAlphabet } from "nanoid";
// import sendEmail from "../../utils/send_email.js";


//  =======================================================    signup

export const signup = async (req, res, next) => {
  console.log("ssss", req.body );
  
  if (await user_model.findOne({ email: req?.body?.email })) {
    return next(new Error("Email Already Exist"));
  }
  const user = new user_model(req.body);
  await user.save();
  if (!user) return next(new Error("fail to create user"));
  const token = token_generation({ payload: { user } });
  if (!token) return next(new Error("fail to generate token", { cause: 400 }));
  res.json({ message: "success", user });
};


//  =======================================================  login

export const login = async (req, res, next) => {
  // const checkUser = await user_model.findOne({ email: req.body.email })
  const checkUser = await user_model.findOne({
    $or: [{ email: req.body.identifier }, { mobile: req.body.identifier }],
  });

  if (!checkUser && req.body.identifier?.includes("@")) {
    return next(new Error("invalid email  information", { cause: 409 }));
  }
  if (!checkUser) {
    return next(
      new Error("invalid  mobile number information", { cause: 409 })
    );
  }
  const matchPassword = bcryptjs.compareSync(
    req.body.password,
    checkUser.password
  );
  if (!matchPassword)
    return next(new Error("invalid password information", { cause: 409 }));
  const token = token_generation({
    payload: { id: checkUser._id, role: checkUser.role },
    expiresIn: 60 * 30,
  });
  await user_model.updateOne({ status: "online" });
  res.json({ message: "success", token });
};

//=====================================================  get all users
export const getAllUsers = async (req, res, next) => {
  const users = await user_model.find();
  if (!users.length) return next(new Error("no users available"));
  res.json({ message: "all users", users });
};
//=====================================================  delete one user
export const deleteOneUser = async (req, res, next) => {
  const user = await user_model.findByIdAndDelete({ _id: req.params._id });
  if (!user) return next(new Error("id invalid"));
  res.json({ message: "Deleted" });
};

// //=====================================================  delete All Users
export const deleteAllUsers = async (req, res, next) => {
  const user = await user_model.deleteMany();
  if (!user) return next(new Error("fail in delete many"));
  res.json({ message: "Deleted All" });
};

// //  ======================================================= logout
// export const logout = async (req, res, next) => {
//   const user = await user_model.updateOne({ status: "offline" });
//   res.status(201).json({ message: "success ", user });
// };
// //  ======================================================= sendCode
// export const sendCode = async (req, res, next) => {
//   const user = await user_model.findOne({ email: req.body.email });
//   if (!user) {
//     return next(Error("invalid email information"));
//   }

//   const id = customAlphabet("123456789");
//   const code = id(4);
//   const message = ` Hello ${user.name} your code is ${code}`;
//   const emailIsSend = sendEmail({
//     to: req.body.email,
//     message,
//     subject: "Confirmation Email",
//   });
//   if (!emailIsSend) {
//     return next(Error("send Email fail"));
//   }
//   await user_model.updateOne({ forgetCode: code });
//   res
//     .status(201)
//     .json({ message: "please check your Gmail to get your Confirmation Code" });
// };
// //  ======================================================= confirmCodeInfo

// let codeContainer;
// export const confirmCodeInfo = async (req, res, next) => {
//   if (!(await user_model.findOne({ forgetCode: req.body.code }))) {
//     return next(Error("Invalid code"));
//   }
//   codeContainer = req.body.code;
//   res.status(201).json({ message: "success go to change password page" });
// };
// // ====================================================================== changePassword
// export const changePassword = async (req, res, next) => {
//   const checkCodeInfo = await user_model.findOne({ forgetCode: codeContainer });
//   if (!checkCodeInfo) {
//     return next(Error("not equal code"));
//   }
//   const hashNewPassword = bcrypt.hashSync(
//     req.body.newPassword,
//     +process.env.SALT_ROUNDS
//   );
//   await user_model.updateOne({
//     password: hashNewPassword,
//     forgetCode: 0,
//     changePasswordTime: Date.now(),
//   });
//   return res
//     .status(200)
//     .json({ message: "change password successfully", hashNewPassword });
// };

// // ====================================================================== changePassword
// export const settingsProfile = async (req, res, next) => {
//   const settingsProfile = await user_model.findOneAndUpdate(
//     { _id: req.user.id },
//     {
//       name: req.body.name,
//       birthOfDate: req.body.birthOfDate,
//       profileImage: req.files?.profileImage?.map(
//         (e) => "https://shaaban-facebook-node.up.railway.app/" + e.path
//       ),
//     },
//     { new: true }
//   );
//   if (!settingsProfile) {
//     return next(Error("failed"));
//   }
//   return res.status(200).json({ message: "Done", settingsProfile });
// };

// ====================================================================== getUserInfo
// export const getOneUser = async (req, res, next) => {
//   const user = await user_model.findOne({ _id: req.user.id });
//     if (!user) return next(new Error("User not found", { cause: 404 }));
//   return res.status(200).json({ message: "Done", user });
// };
