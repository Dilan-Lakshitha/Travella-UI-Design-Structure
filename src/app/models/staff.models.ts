export interface DriverDto {
  id: number;
  name: string;
  phone?: string | null;
  experience?: string | null;
  availability?: string | null;
}

export interface GuideDto {
  id: number;
  name: string;
  phone?: string | null;
  languages?: string | null;
  experience?: string | null;
  availability?: string | null;
}

