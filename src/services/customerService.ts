import { CustomerRepository } from "../repositories/customerRepository";

class CustomerService {
  async createCustomer(data: any) {
    const exisiting = await CustomerRepository.getCustomerByEmail(data.email, 0);
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
    // Check if customer exists
    const customer = await CustomerRepository.getCustomerById(id);
    if (!customer) throw new Error("Customer not found");

    // Check for duplicate email
    if (data.email) {
      const existing = await CustomerRepository.getCustomerByEmail(data.email, id);
      if (existing) throw new Error("Customer email already exists");
    }

    // Update customer
    const updatedCustomer = await CustomerRepository.updateCustomer(id, {
      name: data.name ?? customer.name,
      email: data.email ?? customer.email,
      address: data.address ?? customer.address,
      phone: data.phone ?? customer.phone,
    });

    return updatedCustomer;
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
