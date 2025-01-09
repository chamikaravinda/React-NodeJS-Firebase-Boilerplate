import { errorHandler, successHandler } from "../utils/response.js";
import User from "../models/user.model.js";

export const updateUser = async (req, res, next) => {
  const { id, email, password, name } = req.body;

  console.log("Request recived to update user", email);

  if (id !== req.params.userId) {
    console.error("Not allowed to update the user", email);
    return next(errorHandler(403, "Your are not allowed to update this user"));
  }
  if (password) {
    if (password.length < 6) {
      console.error("Password must be at least 6 characters");
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
  }
  if (req.body.email) {
    if (req.body.email.length < 7 || req.body.email.length > 20) {
      return next(
        errorHandler(400, "email must be between 7 and 20 characters")
      );
    }
    if (req.body.email.includes(" ")) {
      return next(errorHandler(400, "email cannot contain spaces"));
    }
    if (req.body.email !== req.body.email.toLowerCase()) {
      return next(errorHandler(400, "email must be lowercase"));
    }
    if (!req.body.email.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "email can only contain letters and numbers")
      );
    }
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          email: req.body.email,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(successHandler(200, "Update post success", rest));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!(req.user.userRole === "ADMIN") && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Your are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json(successHandler(200, "User has been delete"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie(ACCESS_TOKEN)
      .status(200)
      .json(successHandler(200, "User has been signed out"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!(req.user.userRole == "ADMIN")) {
    return next(errorHandler(403, "Your are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const filteredUsers = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    //TODO: move the one month back date to common
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json(
      successHandler(200, "Get users is success", {
        users: filteredUsers,
        totalUsers,
        lastMonthUsers,
      })
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};
