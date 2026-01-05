import { Request, Response, NextFunction } from 'express';
import UserMode from '../models/UserMode';

export const createUserMode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, overallMood, journalEntry, feelings, sleepHours } = req.body;
    const userMode = await UserMode.create({ userId, overallMood, journalEntry, feelings, sleepHours, date: new Date() });
    res.status(201).json({
      success: true,
      message: 'User mode created successfully',
      data: userMode
    });     
  } catch (error) {
    next(error as Error);
    }
};

export const getUserMode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const userMode = await UserMode.find({ userId: userId });
    res.status(200).json({
      success: true,
      message: 'User mode fetched successfully',
      data: userMode
    });
  } catch (error) {
    next(error as Error);
  }
};