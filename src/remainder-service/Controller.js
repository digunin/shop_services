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

  createRemainder = async (req, res) => {
    const { product_id, shop_id, product_quantity } = req.body;
    const query = 'insert into remainder (product_id, shop_id, product_quantity) values ($1,$2,$3) returning *';
    const remainder = await db.query(query, [product_id, shop_id, product_quantity]);
    res.send(remainder.rows[0]);
  };

  increaseRemainder = async (req, res) => {
    const id = req.params.id;
    const incr = req.query.incr;
    const query =
      'UPDATE remainder SET product_quantity = product_quantity + $1 WHERE remainder_id = $2 returning product_quantity';
    const quantity = await db.query(query, [incr, id]);
    res.send(quantity.rows[0]);
  };

  decreaseReaminder = async (req, res) => {
    const id = req.params.id;
    const decr = req.query.decr;
    const query = `
    UPDATE remainder SET product_quantity = (
      CASE WHEN product_quantity > $1
      THEN (product_quantity - $1) 
      ELSE product_quantity END
    ) WHERE remainder_id = $2 returning product_quantity`;
    const quantity = await db.query(query, [decr, id]);
    res.send(quantity.rows[0]);
  };

  async getRemainders(req, res) {
    const { plu, shop_id, order_from, order_to, shelf_from, shelf_to } = req.query;
    const select_part = `
    select distinct product.product_name, shop.shop_name, remainder.product_quantity
    from remainder
    join product on product.product_id = remainder.product_id
    join shop_order on shop_order.shop_id = remainder.shop_id
    join shop on shop.shop_id = remainder.shop_id
    left join order_detail on shop_order.order_id = order_detail.order_id and order_detail.product_id = product.product_id`;
    let where_part = addCond('product.product_plu', plu, '');
    where_part = addCond('shop.shop_id', shop_id, where_part);
    where_part = addCond('order_detail.product_quantity', order_from, where_part, '>=');
    where_part = addCond('order_detail.product_quantity', order_to, where_part, '<=');
    where_part = addCond('remainder.product_quantity', shelf_from, where_part, '>=');
    where_part = addCond('remainder.product_quantity', shelf_to, where_part, '<=');
    const query = `${select_part}${where_part}`;
    const shops = await db.query(query);
    res.send(shops.rows);
  }

  async getProducts(req, res) {
    const { plu, name } = req.query;
    const select_part = 'select * from product';
    let where_part = addCond('product_plu', plu, '');
    where_part = addCond('product_name', name, where_part, 'ilike');
    const query = `${select_part}${where_part}`;
    const shops = await db.query(query);
    res.send(shops.rows);
  }
}
