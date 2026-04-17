// ===== Requests =====

export type MessageReportRequest = {
  content: string;
};

export type MessageReportAdminRequest = {
  messageId?: string;
  reporterId?: string;
  content?: string;
};

// ===== Query params =====

export type GetReportsParams = {
  keywords?: string;
  page?: number;
  pageSize?: number;
  createdDateStart?: string; // ISO string
  createdDateEnd?: string;   // ISO string
  ascSort?: boolean;
};

// ===== Responses =====

export type ReportResponse = {
  id: string;
  messageId: string;
  reporterId: string | null;
  content: string | null;
  createdDate: string;
};

export type ReportListResponse = ReportResponse[];
