
export interface User {
  id: string;
  name: string;
  phone?: string;
  role: "client" | "merchant";
}
