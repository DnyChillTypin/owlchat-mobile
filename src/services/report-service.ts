import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const REPORT_BASE_URL = `${API_ENDPOINTS.CHAT_SERVICE}/report`;

import type { MessageReportRequest } from "@/types/chat.type";

export async function reportMessage(
  messageId: string,
  data: MessageReportRequest,
): Promise<string> {
  const response = await apiClient.post<string>(
    `${REPORT_BASE_URL}/message/${messageId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}
