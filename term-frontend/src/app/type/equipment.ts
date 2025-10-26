export interface Equipment {
    id: number;
    organizationId: number;
    categoryId: number;
    name: string;
    imageUrl: string;
    imageName: string;
    description?: string | null;
    isAvailable: boolean;
    totalQuantity: number;
}

export interface CreateEquipmentDto {
    organizationId: number;
    categoryId?: number | null;
    name: string;
    imageUrl: string;
    imageName: string;
    description?: string | null;
    totalQuantity: number;
    isAvailable: boolean;
}