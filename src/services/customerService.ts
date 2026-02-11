import { CustomerRepository } from "../repositories/customerRepository";

class CustomerService {
  async createCustomer(data: any) {
    const exisiting = await CustomerRepository.getCustomerByEmail(data.email);
    if (exisiting) {
      throw new Error("Customer already exists");
    }
    return CustomerRepository.insertCustomer(data.name, data.email, data.address, data.phone);
  }

  async getCutomerbyId(id: number) {
    const customer = await CustomerRepository.getCustomerById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async getAllCustomers() {
    return CustomerRepository.getAllCustomers();
  }

  async updateCustomer(id: number, data: any) {
    const customer = await CustomerRepository.getCustomerById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (data.email) {
      const existing = await CustomerRepository.getCustomerByEmail(data.email);
      if (existing) {
        throw new Error("Customer already exists");
      }
    }
    return CustomerRepository.updateCustomer(id, {
      name: data.name ?? customer.name,
      email: data.email ?? customer.email,
      phone: data.phone ?? customer.phone,
      address: data.address ?? customer.address,
    });
  }

  async deleteCustomer(id: number) {
    const customer = await CustomerRepository.getCustomerById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return CustomerRepository.deleteCustomer(id);
  }
}
export const customerService = new CustomerService();
