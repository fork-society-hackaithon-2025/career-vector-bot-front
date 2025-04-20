
export interface User {
  id: string;
  name: string;
  telegramId: string;
  role: "USER" | "ADMIN";
}
