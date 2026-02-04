import * as repo from "../repositories/customerRepository";

export const createCustomer = async (data: any) => {
  const { name, email, address, phone } = data;

  if (!name?.trim() || !email?.trim() || !address?.trim() || !phone?.trim()) {
    throw new Error("All fields are required");
  }

  const existing: any = await repo.getCustomerByEmail(email);
  if (existing.length > 0) {
    throw new Error("Email already exists");
  }

  const result: any = await repo.insertCustomer(name, email, address, phone);
  return result.insertId;
};

export const getCustomers = async () => {
  const rows: any = await repo.getAllCustomers();
  return rows;
};

export const updateCustomer = async (id: number, data: any) => {
  const { name, email, address, phone } = data;

  const existing: any = await repo.getCustomerById(id);
  if (existing.length === 0) throw new Error("Customer not found");

  const result: any = await repo.updateCustomer(
    id,
    name,
    email,
    address,
    phone
  );
  return result.affectedRows;
};

export const deleteCustomer = async (id: number) => {
  const existing: any = await repo.getCustomerById(id);
  if (existing.length === 0) throw new Error("Customer not found");

  const result: any = await repo.deleteCustomer(id);
  return result.affectedRows;
};
