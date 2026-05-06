import { createApi } from '../ shared/createApi';

const AI_SERVICE_URL =
    import.meta.env.VITE_AI_SERVICE_URL ?? 'https://37.99.82.5';

export type AiChatAction = {
    type: string;
    payload?: unknown;
};

export type AiChatResponse = {
    answer: string;
    actions?: AiChatAction[];
};

export type AiChatRequest = {
    message: string;
    user_data?: Record<string, unknown> | null;
};

const aiApi = createApi(`${AI_SERVICE_URL}/ai-service`);

export const aiService = {
    async sendMessage(
        message: string,
        userData?: Record<string, unknown> | null
    ): Promise<AiChatResponse> {
        const body: AiChatRequest = {
            message,
        };

        if (userData) {
            body.user_data = userData;
        }

        const response = await aiApi.post<AiChatResponse>(
            '/external/chat',
            body
        );

        return response.data;
    },
};