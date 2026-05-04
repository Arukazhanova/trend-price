import { useEffect, useState } from 'react';
import styles from './FloatingAIButton.module.css';
import aiButton from '../../assets/AI.svg';
import botIcon from '../../assets/bot.svg';

export default function FloatingAIButton() {
    const [isOpen, setIsOpen] = useState(false);

    // 👇 ВОТ ЭТО ДОБАВЬ
    useEffect(() => {
        const openChat = () => setIsOpen(true);

        window.addEventListener('open-ai-chat', openChat);

        return () => {
            window.removeEventListener('open-ai-chat', openChat);
        };
    }, []);
    // 👆

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
                            <p><span /> online</p>
                        </div>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.chatBody}>
                        <div className={styles.botMessage}>
                            Hi! I'm your price analyst. Ask me anything about grocery prices
                        </div>

                        <div className={styles.userMessage}>
                            Where is milk cheaper this week?
                        </div>

                        <div className={styles.botMessage}>
                            Best price: Magnum — 380₸ <br />
                            Compared to last week: −24 <br />
                            If you buy 4L/week, you save 1,040₸/month vs Small!
                        </div>

                        <div className={styles.quickActions}>
                            <button>Analyze my spending</button>
                            <button>Find cheapest basket</button>
                            <button>Price alerts</button>
                        </div>
                    </div>

                    <div className={styles.chatFooter}>
                        <input placeholder="Ask about prices..." />
                        <button type="button">↑</button>
                    </div>
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