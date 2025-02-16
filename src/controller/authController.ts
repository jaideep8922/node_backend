import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";

export const register = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    console.log("email", email)
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ email, password });
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token , user});
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
