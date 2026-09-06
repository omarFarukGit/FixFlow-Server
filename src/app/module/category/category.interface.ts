export interface ICreateCategoryPayload {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}
