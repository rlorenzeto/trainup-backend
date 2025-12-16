import { Response } from 'express';

export const success = (res: Response, data: any) => {
  return res.json({ success: true, data });
};

export const error = (res: Response, message: string, status: number = 500) => {
  return res.status(status).json({ success: false, message });
};
