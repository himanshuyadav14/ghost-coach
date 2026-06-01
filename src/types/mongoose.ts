export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type WithId<T> = T & { _id: string };

export type LeanDocument<T> = T & { _id: string };
