import type { accountType } from '@prisma/client';
export class UserDto {
  id: number;
  preName?: string;
  firstname: string;
  lastname: string;
  email: string;
  faculty: string;
  accountType: accountType;
  studentID?: string;
  createdAt: Date;
  updateAt: Date;
}
