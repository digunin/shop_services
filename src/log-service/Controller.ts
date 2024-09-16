import { RequestHandler } from 'express';
import { db } from '../database/db.js';
import { ShopServicesDB } from '../database/types.js';

type RequestParams = {
  shop_id?: string;
  plu?: string;
  dateFrom?: string;
  dateTo?: string;
  action_id?: string;
};

export const addCond = (key: string, value: string | undefined, querystr: string, operator = '=') => {
  if (value == undefined) return querystr;
  if (key.includes('date')) {
    value = localeDateToUTC(new Date(value));
  }
  return `
  ${querystr ? `${querystr} and ` : ' where '}
  ${key} ${operator} '${value}'
  `;
};

const getTZOffset = (date: Date) => {
  return date.getTimezoneOffset() * 60000;
};

const localeDateToUTC = (date: Date) => {
  return new Date(date.getTime() + getTZOffset(date)).toISOString();
};
const UTCDateToLocale = (date: Date) => {
  return new Date(date.getTime() - getTZOffset(date)).toISOString();
};

export class Controller {
  public getLog: RequestHandler<unknown, Array<ShopServicesDB['log_record']>, unknown, RequestParams> = async (
    req,
    res,
  ) => {
    const { action_id, plu, shop_id, dateFrom, dateTo } = req.query;
    const select_part = 'select * from log_record';
    let where_part = addCond('action_id', action_id, '');
    where_part = addCond('product_plu', plu, where_part);
    where_part = addCond('shop_id', shop_id, where_part);
    where_part = addCond('action_date', dateFrom, where_part, '>=');
    where_part = addCond('action_date', dateTo, where_part, '<=');
    const query = `${select_part}${where_part}`;
    const log = await db.query<ShopServicesDB['log_record']>(query);
    res.send(
      log.rows.map(row => {
        return {
          ...row,
          action_date: UTCDateToLocale(new Date(row.action_date)),
        };
      }),
    );
  };

  public createRecord: RequestHandler<
    unknown,
    ShopServicesDB['log_record'],
    Omit<ShopServicesDB['log_record'], 'log_record_id' | 'action_timestamp'>
  > = async (req, res) => {
    const { action_id, product_plu, shop_id } = req.body;
    const record = await db.query<ShopServicesDB['log_record']>(
      'insert into log_record (action_id, product_plu, shop_id) values ($1, $2, $3) returning *',
      [action_id, product_plu, shop_id],
    );
    res.send(record.rows[0]);
  };
}
