import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CmuEntraIDBasicInfo } from 'src/types/CmuEntraIDBasicInfo';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { accountType } from '@prisma/client';

@Injectable()
export class ExternalApiService {
  async getEntraIDAccessToken(authorizationCode: string): Promise<string> {
    try {
      const response = await axios.post(
        process.env.CMU_ENTRAID_GET_TOKEN_URL!,
        {
          code: authorizationCode,
          redirect_uri: process.env.CMU_ENTRAID_REDIRECT_URL!,
          client_id: process.env.CMU_ENTRAID_CLIENT_ID!,
          client_secret: process.env.CMU_ENTRAID_CLIENT_SECRET!,
          scope: process.env.SCOPE!,
          grant_type: 'authorization_code',
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      return response.data.access_token;
    } catch {
      throw new HttpException(
        'Cannot get EntraID access token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getCMUBasicInfo(accessToken: string): Promise<CmuEntraIDBasicInfo> {
    try {
      const response = await axios.get(
        process.env.CMU_ENTRAID_GET_BASIC_INFO!,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch {
      throw new HttpException(
        'Cannot get CMU basic info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  prepareProfile = (basicInfo: CmuEntraIDBasicInfo): CreateUserDto => {
    const {
      prename_TH: preName,
      firstname_TH: firstname,
      lastname_TH: lastname,
      cmuitaccount: email,
      organization_name_TH: faculty,
      itaccounttype_id: accType,
      student_id: studentID,
    } = basicInfo;

    return {
      preName,
      firstname,
      lastname,
      email,
      faculty,
      accountType: this.mapAccountType(accType),
      studentID,
    };
  };

  mapAccountType(value: string): accountType {
    switch (value) {
      case 'StdAcc':
        return accountType.StdAcc;
      case 'AlumAcc':
        return accountType.AlumAcc;
      case 'MISEmpAcc':
        return accountType.MISEmpAcc;
      default:
        throw new Error(`Invalid account type: ${value}`);
    }
  }
}
