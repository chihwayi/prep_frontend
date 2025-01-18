export interface PaginatedResponse<T> {
    content: T[];
    // Add other pagination fields if needed
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
  }