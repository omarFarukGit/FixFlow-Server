export interface ICreateReviewPayload {
  serviceRequestId: string;
  rating: number;
  comment?: string;
}
