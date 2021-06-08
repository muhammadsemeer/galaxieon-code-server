export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  followers?: number;
  following?: number;
  status?: boolean;
}
