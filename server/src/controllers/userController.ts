import { Request, Response } from 'express';
import User from '../models/users.js';
import { userSchema } from '../schemas/userSchema.js';
import { HTTP_STATUS } from '../constants/statusCodes.js';

/**
 * Get all users
 */
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to fetch users',
      details: (error as Error).message,
    });
  }
};

/**
 * Add a new user with Zod validation
 */
export const addUser = async (req: Request, res: Response): Promise<void> => {
  const parseResult = userSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Validation failed',
      details: parseResult.error.flatten(),
    });
    return;
  }

  const { name, email } = parseResult.data;

  try {
    const newUser = await User.create({ name, email });
    res.status(HTTP_STATUS.CREATED).json(newUser);
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'User creation failed',
      details: (error as Error).message,
    });
  }
};
