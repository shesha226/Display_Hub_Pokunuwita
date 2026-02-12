import { RepairRepository } from "../repositories/repairRepository";

class RepairService {
    async createRepair(data: any) {
        const exisiting = await RepairRepository.getRepair(data.id);
        if (exisiting) {
            throw new Error("Repair already exists");
        }
        return RepairRepository.createRepair(data);
    }
    async getRepair(id: number) {
        const exisiting = await RepairRepository.getRepair(id);
        if (!exisiting) {
            throw new Error("Repair not found");
        }
        return RepairRepository.getRepair(id);
    }
    async getAllRepairs() {
        const exisiting = await RepairRepository.getAllRepairs();
        if (!exisiting) {
            throw new Error("Repairs not found");
        }
        return RepairRepository.getAllRepairs();
    }
    async updateRepair(id: number, data: any) {
        const existing = await RepairRepository.getRepair(id);

        if (!existing) {
            throw new Error("Repair not found");
        }

        const updatedData = {
            customer_name: data.customer_name ?? existing.customer_name,
            phone_model: data.phone_model ?? existing.phone_model,
            issue: data.issue ?? existing.issue,
            repair_cost: data.repair_cost ?? existing.repair_cost,
            status: data.status ?? existing.status,
            advance: data.advance ?? existing.advance,
        };

        const updated = await RepairRepository.updateRepair(id, updatedData);

        if (!updated) {
            throw new Error("Update failed");
        }

        return true;
    }
    async deleteRepair(id: number) {
        const exisiting = await RepairRepository.getRepair(id);
        if (!exisiting) {
            throw new Error("Repair not found");
        }
        return RepairRepository.deleteRepair(id);
    }
}

export const repairService = new RepairService();
