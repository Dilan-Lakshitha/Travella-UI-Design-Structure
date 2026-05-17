export interface DriverDto {
  id: number;
  name: string;
  phone?: string | null;
  language?: string | null;
  email?: string | null;
  experience?: string | number | null;
  availability?: string | null;
  companyId?: number | null;
  role?: string;
}

export interface GuideDto {
  id: number;
  name: string;
  phone?: string | null;
  language?: string | null;
  languages?: string | null;
  email?: string | null;
  experience?: string | number | null;
  availability?: string | null;
}

