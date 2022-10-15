export type User = {
  id: string;
  ipAddress?: string;
  coins?: number;
  pets?: string[];
};

export type Task = {
  id: string;
  title?: string;
  status?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  dueAt?: Date;
};