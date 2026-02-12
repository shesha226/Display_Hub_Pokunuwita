import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";

export const createUser = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    Next(error);
  }
};

export const loginUser = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const user = await UserService.loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    Next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    Next(error);
  }
};

export const getUserById = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const user = await UserService.getUserById(Number(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    Next(error);
  }
};

export const updateUser = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const user = await UserService.updateUser(Number(req.params.id), req.body);
    res.status(200).json(user);
  } catch (error) {
    Next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const user = await UserService.deleteUser(Number(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    Next(error);
  }
};
