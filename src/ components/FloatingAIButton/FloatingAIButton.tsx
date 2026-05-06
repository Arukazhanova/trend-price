import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import styles from './FloatingAIButton.module.css';
import aiButton from '../../assets/AI.svg';
import botIcon from '../../assets/bot.svg';
import { aiService } from '../../services/aiService';

type ChatMessage = {
    id: string;
    role: 'bot' | 'user';
    text: string;
};

type AiHistoryMessage = {
    role: 'user' | 'assistant';
    content: string;
};

const initialMessages: ChatMessage[] = [
    {
        id: 'welcome',
        role: 'bot',
        text: "Hi! I'm your price analyst. Ask me anything about grocery prices",
    },
];

const quickActions = [
    'Analyze my spending',
    'Find cheapest basket',
    'Price alerts',
];

const createMessage = (
    role: ChatMessage['role'],
    text: string
): ChatMessage => ({
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
});

const getCurrentPagePath = () => {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const getProductIdFromCurrentUrl = () => {
    const pathname = window.location.pathname;

    const productMatch = pathname.match(
        /^\/products\/([0-9a-fA-F-]{36})(?:\/analytics)?\/?$/
    );

    return productMatch?.[1] ?? null;
};

const buildAiMessageWithHistory = (
    history: AiHistoryMessage[],
    currentMessage: string
) => {
    const lastMessages = history.slice(-10);
    const currentPagePath = getCurrentPagePath();

    return [
        'Ты AI-помощник сервиса TrendPrice.',
        'Отвечай на текущий вопрос пользователя с учетом истории диалога.',
        'Если пользователь просто здоровается или задает общий вопрос, не подставляй товар из user_data без необходимости.',
        'Если пользователь спрашивает про прошлые сообщения, используй chat_history.',
        'current_page_path — это адрес страницы после домена.',
        '',
        `current_page_path: ${currentPagePath}`,
        `chat_history: ${JSON.stringify(lastMessages)}`,
        `current_message: ${currentMessage}`,
    ].join('\n');
};

const shouldSendUserData = (message: string) => {
    const lowerMessage = message.toLowerCase();

    const priceKeywords = [
        'цена',
        'цену',
        'цены',
        'стоимость',
        'стоит',
        'сколько',
        'товар',
        'товара',
        'продукт',
        'продукта',
        'магазин',
        'магазине',
        'magnum',
        'магнум',
        'дешевле',
        'дороже',
        'скидка',
        'акция',
        'экономия',
        'сэкономить',
        'прогноз',
        'инфляция',
        'алматы',
        'almaty',
        'где купить',
        'купить',
        'аналитика',
        'analytics',
        'best price',
        'price',
        'store',
        'product',
        'forecast',
        'cheapest',
        'savings',
    ];

    return priceKeywords.some((keyword) => lowerMessage.includes(keyword));
};

const buildUserData = (message: string) => {
    const productId = getProductIdFromCurrentUrl();

    if (!shouldSendUserData(message) && !productId) {
        return null;
    }

    return {
        ...(productId ? { product_id: productId } : {}),
        city: 'Almaty',
        preferred_store: 'Magnum',
    };
};

export default function FloatingAIButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [aiHistory, setAiHistory] = useState<AiHistoryMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const chatBodyRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const openChat = () => setIsOpen(true);

        window.addEventListener('open-ai-chat', openChat);

        return () => {
            window.removeEventListener('open-ai-chat', openChat);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        chatBodyRef.current?.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, isLoading, isOpen]);

    const sendMessage = async (text: string) => {
        const trimmedText = text.trim();

        if (!trimmedText || isLoading) return;

        setError('');
        setMessage('');

        setMessages((prev) => [
            ...prev,
            createMessage('user', trimmedText),
        ]);

        setIsLoading(true);

        try {
            const messageForAi = buildAiMessageWithHistory(
                aiHistory,
                trimmedText
            );

            const userData = buildUserData(trimmedText);

            const response = await aiService.sendMessage(
                messageForAi,
                userData
            );

            const botAnswer = response.answer || 'I could not find an answer.';

            setMessages((prev) => [
                ...prev,
                createMessage('bot', botAnswer),
            ]);

            setAiHistory((prev) => [
                ...prev,
                {
                    role: 'user',
                    content: trimmedText,
                },
                {
                    role: 'assistant',
                    content: botAnswer,
                },
            ]);
        } catch (requestError) {
            console.error('AI chat error:', requestError);

            setError('AI assistant is not available right now. Try again later.');

            setMessages((prev) => [
                ...prev,
                createMessage(
                    'bot',
                    'Sorry, I could not connect to the AI service.'
                ),
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void sendMessage(message);
    };

    const handleQuickAction = (action: string) => {
        void sendMessage(action);
    };

    return (
        <>
            {isOpen && (
                <div className={styles.chat}>
                    <div className={styles.chatHeader}>
                        <div className={styles.botIcon}>
                            <img src={botIcon} alt="" />
                        </div>

                        <div>
                            <h3>TrendPrice</h3>
                            <p>
                                <span /> online
                            </p>
                        </div>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                            aria-label="Close AI chat"
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.chatBody} ref={chatBodyRef}>
                        {messages.map((chatMessage) => (
                            <div
                                key={chatMessage.id}
                                className={
                                    chatMessage.role === 'bot'
                                        ? styles.botMessage
                                        : styles.userMessage
                                }
                            >
                                {chatMessage.text}
                            </div>
                        ))}

                        {isLoading && (
                            <div className={styles.botMessage}>Typing...</div>
                        )}

                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.quickActions}>
                            {quickActions.map((action) => (
                                <button
                                    key={action}
                                    type="button"
                                    onClick={() => handleQuickAction(action)}
                                    disabled={isLoading}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form
                        className={styles.chatFooter}
                        onSubmit={handleSubmit}
                    >
                        <input
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Ask about prices..."
                            disabled={isLoading}
                        />

                        <button
                            type="submit"
                            disabled={isLoading || !message.trim()}
                        >
                            ↑
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                className={styles.floatingBtn}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <img src={aiButton} alt="AI assistant" />
            </button>
        </>
    );
}