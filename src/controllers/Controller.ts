import { Request, RequestHandler, Response } from 'express';
import { db } from '../db.js';

export class Controller {
  public createProduct: RequestHandler = (req: Request, res: Response) => {};
  public createRemainder: RequestHandler = (req: Request, res: Response) => {};
  public increaseRemainder: RequestHandler = (req: Request, res: Response) => {};
  public decreaseReaminder: RequestHandler = (req: Request, res: Response) => {};
  public getRemainders: RequestHandler = (req: Request, res: Response) => {};
  public getProducts: RequestHandler = async (req: Request, res: Response) => {
    const shops = await db.query<{
      person_id: number;
      person_name: string;
    }>('select * from public.product');
    res.send(shops.rows);
  };
}
