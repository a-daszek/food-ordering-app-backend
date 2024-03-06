import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "Nie znaleziono uzytkownika" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Wystąpił błąd" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  // 1. check if the user exists
  try {
    const { auth0Id } = req.body; //getting the auth0Id received in the request to create the user
    const existingUser = await User.findOne({ auth0Id }); //finding a user that has an auth0Id stored, and it's the same as the one from above
    if (existingUser) {
      return res.status(200).send();
    }
    // 2. create the user if it doesn't
    const newUser = new User(req.body); //req.body is going to have stored an auth0Id and email, those are the things that get passed to the frontend
    // after the user gets redirected back after they've finished logging in
    await newUser.save(); //saving credentials in the database

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Wystąpił błąd przy tworzeniu użytkownika" });
  }

  // 3. return the user object to the calling client
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika" });
    }
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Wystąpił błąd przy aktualizacji użytkownika" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
