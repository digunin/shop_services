export type ShopServicesDB = {
  log_action: {
    action_id: number;
    action_name: string;
  };
  log_record: {
    log_record_id: number;
    action_id: number;
    shop_id: number | null;
    product_plu: string;
    action_date: string;
  };
  order_detail: {
    order_detail_id: number;
    product_id: number;
    order_id: number;
    product_quantty: number;
  };
  product: {
    product_id: number;
    product_plu: string;
    product_name: string;
  };
  remainder: {
    remainder_id: number;
    product_id: number;
    shop_id: number;
    product_quantity: number;
  };
  shop: {
    shop_id: number;
    shop_name: string;
  };
  shop_order: {
    order_id: number;
    shop_id: number;
    order_date: string;
  };
};
