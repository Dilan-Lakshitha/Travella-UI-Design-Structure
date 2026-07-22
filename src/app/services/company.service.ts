import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { API_BASE_URL } from "@app/config/api.config";
import { firstValueFrom } from "rxjs";
import { AuthService } from "./auth.service";

export interface CreateCompanyRequest {
  name: string;
  email: string;
  phone: string;
  ownerName: string;
  adminEmail: string;
  websiteUrl?: string;
}

export interface CreateCompanyResponse {
  companyId: number;
  adminUserId: number;
  companyName: string;
  slug: string;
  companyUrl: string;
  adminEmail: string;
  welcomeEmailSent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${API_BASE_URL}/api/company/Creation`;

  async createCompany(
    request: CreateCompanyRequest
  ): Promise<CreateCompanyResponse> {

    return await firstValueFrom(
      this.http.post<CreateCompanyResponse>(
        this.apiUrl,
        request
      )
    );
  }
}