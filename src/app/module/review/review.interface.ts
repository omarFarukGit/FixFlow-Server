export interface ICreateReviewPayload {
  serviceRequestId: string;
  rating: number;
  comment?: string;
}

export interface IGetReviewsQuery {
  page?: number;
  limit?: number;
  rating?: number;
}
