import * as repo from "../repositories/orderItemRepository";

export const createOrderItem = async (data: any) => {
  const { order_id, accessory_id, quantity, price, discount = 0 } = data;

  if (!order_id || !accessory_id || !quantity || !price) {
    throw new Error("order_id, accessory_id, quantity, and price are required");
  }

  const final_price = price * quantity - discount;
  const result: any = await repo.insertOrderItem(
    Number(order_id),
    Number(accessory_id),
    Number(quantity),
    Number(price),
    Number(discount),
    final_price
  );

  return result.insertId;
};

export const updateorderitems = async (id: number, data: any) => {
  const { quantity = 0, price = 0, discount = 0 } = data;
  const final_price = price * quantity - discount;

  const result: any = await repo.updateOrderItem(
    id,
    Number(quantity),
    Number(price),
    Number(discount),
    final_price
  );

  return result.affectedRows;
};

export const getItems = async () => repo.getAllOrderItems();

export const getItem = async (id: number) => {
  const rows: any = await repo.getOrderItemById(id);
  return rows.length ? rows[0] : null;
};

export const deleteOrderItem = async (id: number) => {
  const result: any = await repo.deleteOrderItem(id);
  return result.affectedRows;
};
