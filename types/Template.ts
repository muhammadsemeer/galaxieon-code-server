import { Files } from "./Instance";

export interface Template {
  id: string;
  name: string;
  files: Files;
  used: number;
  language: string;
  status: boolean;
}
