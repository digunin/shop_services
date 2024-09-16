import { db } from '../database/db.js';
import { addCond } from '../log-service/Controller.js';

const host = process.env.APP_SERVER_LOG_HOST;
const port = process.env.APP_SERVER_LOG_PORT;
const url = process.env.APP_LOG_API_URL;

const log_api_URL = `${host?.startsWith('http') ? '' : 'http://'}${host}:${port}${url}`;

export class Controller {
  async createProduct(req, res) {
    const { product_name, product_plu } = req.body;
    const product = await db.query('insert into product (product_name, product_plu) values ($1, $2) returning *', [
      product_name,
      product_plu,
    ]);
    const record = {
      action_id: 1,
      product_plu: product.rows[0].product_plu,
    };
    await fetch(`${log_api_URL}/record`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(record),
    }).catch(err => console.log(err));
    res.send(product.rows[0]);
  }

  createRemainder = (req, res) => {};
  increaseRemainder = (req, res) => {};
  decreaseReaminder = (req, res) => {};

  async getRemainders(req, res) {
    const { plu, shop_id, from, to } = req.query;
  }

  async getProducts(req, res) {
    const { plu, name } = req.query;
    const select_part = 'select * from product';
    let where_part = addCond('product_plu', plu, '');
    where_part = addCond('product_name', name, where_part, 'ilike');
    const query = `${select_part}${where_part}`;
    console.log(query);
    const shops = await db.query(query);
    res.send(shops.rows);
  }
}
