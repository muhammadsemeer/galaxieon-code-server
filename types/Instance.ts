import { User } from "./User";

export type File = { name: string; files: string[] };

export interface Files {
  name: string;
  files: string[];
  folder?: File[];
}

export interface Instance {
  id: string;
  name: string;
  description?: string;
  keywords?: string;
  subdomain?: string;
  isPriavte?: boolean;
  fork?: boolean;
  files: Files;
  autosave?: boolean;
  autopreview?: boolean;
  likes?: number;
  shares?: number;
  forks?: number;
  deletedAt?: Date;
  status?: boolean;
  UserId?: string;
  User?: User;
}
