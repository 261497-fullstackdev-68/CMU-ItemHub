export interface EquipmentLoan {
    id: number;
    equipmentId: number;
    borrowerId: number;
    amount: number;
    status: "pending" | "approved" | "returned" | "rejected";
    borrowedAt: Date;
    returnedAt: Date;
    note: string | null;
}