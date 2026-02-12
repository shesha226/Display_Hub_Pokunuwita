import { repairService } from "../services/repeirPartsService";
import { Request, Response, NextFunction } from "express";

export const createRepair = async (req: Request, res: Response, Next: NextFunction) => {
    try {
        const repair = await repairService.createRepair(req.body);
        res.status(201).json(repair);
    } catch (error: any) {
        Next(error);
    }
};
export const getRepair = async (req: Request, res: Response, Next: NextFunction) => {
    try {
        const repair = await repairService.getRepair(Number(req.params.id));
        res.status(200).json(repair);
    } catch (error: any) {
        Next(error);
    }
};
export const getAllRepairs = async (req: Request, res: Response, Next: NextFunction) => {
    try {
        const repairs = await repairService.getAllRepairs();
        res.status(200).json(repairs);
    } catch (error: any) {
        Next(error);
    }
};
export const updateRepair = async (req: Request, res: Response, Next: NextFunction) => {
    try {
        const repair = await repairService.updateRepair(Number(req.params.id), req.body);
        res.status(200).json(repair);
    } catch (error: any) {
        Next(error);
    }
};
export const deleteRepair = async (req: Request, res: Response, Next: NextFunction) => {
    try {
        const repair = await repairService.deleteRepair(Number(req.params.id));
        res.status(200).json(repair);
    } catch (error: any) {
        Next(error);
    }
};


