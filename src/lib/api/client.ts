import type { ApiResponse } from "@/types/api";
import type {
  ChatThreadDetail,
  ChatThreadsResponse,
  SendMessageInput,
  SendMessageResponse,
} from "@/types/chat";
import type { AnalysisResponse, SessionDetail, SessionsListResponse } from "@/types/coaching";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { body, headers, ...rest } = options;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    return response.json() as Promise<ApiResponse<T>>;
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async uploadAnalysis(
    formData: FormData,
  ): Promise<ApiResponse<AnalysisResponse>> {
    const response = await fetch(`${this.baseUrl}/api/analysis`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    return response.json() as Promise<ApiResponse<AnalysisResponse>>;
  }

  getSessions(page = 1, pageSize = 20) {
    return this.get<SessionsListResponse>(
      `/api/sessions?page=${page}&pageSize=${pageSize}`,
    );
  }

  getSession(id: string) {
    return this.get<SessionDetail>(`/api/sessions/${id}`);
  }

  sendChatMessage(input: SendMessageInput) {
    return this.post<SendMessageResponse>("/api/chat", input);
  }

  getChatThread(threadId: string) {
    return this.get<ChatThreadDetail>(`/api/chat/${threadId}`);
  }

  getChatThreads() {
    return this.get<ChatThreadsResponse>("/api/chat/threads");
  }
}

export const apiClient = new ApiClient();
