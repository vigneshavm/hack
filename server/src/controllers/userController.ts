// server/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/users';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const addUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'User creation failed', details: error });
  }
};
