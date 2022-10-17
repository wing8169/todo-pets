export type Pet = {
  self: string;
  name: string;
};

export type User = {
  id: string;
  self: string;
  ipAddress: string;
  coins: number;
  pets: Pet[];
  newPet: string;
};

export type Task = {
  id: string;
  ipAddress: string;
  title: string;
  status: boolean;
  deleted: boolean;
  createdAt: Date;
  dueAt: Date;
  claimed: boolean;
  lastModifiedAt: Date;
};
