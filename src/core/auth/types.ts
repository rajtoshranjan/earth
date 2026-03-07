export interface AuthHeader {
  key: string;
  value: string;
}

export interface AuthRecord {
  name: string;
  headers: AuthHeader[];
}
