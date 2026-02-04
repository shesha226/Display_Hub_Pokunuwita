import * as repo from "../repositories/accessoryRepository";

export const createAccessory = async (data: any) => {
  const {
    category,
    item_name,
    item_number,
    price,
    discount = 0,
    offer_price = 0,
    qty_on_hand,
  } = data;

  if (
    !category?.trim() ||
    !item_name?.trim() ||
    !item_number?.trim() ||
    price == null ||
    qty_on_hand == null
  ) {
    throw new Error("All fields are required");
  }

  // Check duplicates
  const existing = await repo.findAccessoryByNameOrNumber(
    item_name,
    item_number
  );
  if ((existing as any).length > 0) {
    throw new Error("Accessory with this name or number already exists");
  }

  const result: any = await repo.insertAccessory(
    category,
    item_name,
    item_number,
    Number(price),
    Number(discount),
    Number(offer_price),
    Number(qty_on_hand)
  );

  const rows: any = await repo.getAccessoryById(result.insertId);
  return rows[0];
};

export const getAccessory = async (id: number) => {
  const rows: any = await repo.getAccessoryById(id);
  return rows.length ? rows[0] : null;
};

export const getAllAccessories = async () => {
  const rows: any = await repo.getAllAccessories();
  return rows;
};

export const updateAccessory = async (id: number, data: any) => {
  const {
    category,
    item_name,
    item_number,
    price,
    discount = 0,
    offer_price = 0,
    qty_on_hand,
  } = data;

  if (
    !category?.trim() ||
    !item_name?.trim() ||
    !item_number?.trim() ||
    price == null ||
    qty_on_hand == null
  ) {
    throw new Error("All fields are required");
  }

  const accessory = await repo.getAccessoryById(id);
  if ((accessory as any).length === 0) throw new Error("Accessory not found");

  // Check duplicates excluding current id
  const existing = await repo.findAccessoryByNameOrNumber(
    item_name,
    item_number,
    id
  );
  if ((existing as any).length > 0)
    throw new Error("Accessory with this name or number already exists");

  const result: any = await repo.updateAccessory(
    id,
    category,
    item_name,
    item_number,
    Number(price),
    Number(discount),
    Number(offer_price),
    Number(qty_on_hand)
  );

  const updatedRows: any = await repo.getAccessoryById(id);
  return updatedRows[0];
};

export const deleteAccessory = async (id: number) => {
  const accessory = await repo.getAccessoryById(id);
  if ((accessory as any).length === 0) throw new Error("Accessory not found");

  const used = await repo.checkAccessoryUsedInOrders(id);
  if ((used as any).length > 0)
    throw new Error("Cannot delete accessory. It is used in existing orders.");

  const result: any = await repo.deleteAccessory(id);
  return result.affectedRows;
};
