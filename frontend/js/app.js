class App {
    constructor() {
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.initInfoPanel();
        this.addStyles();
    }

    bindGlobalEvents() {
        // Кнопка информации о чате
        const chatInfoBtn = document.getElementById('chat-info-btn');
        const closeInfoBtn = document.getElementById('close-info-btn');
        const infoPanel = document.querySelector('.info-panel');

        if (chatInfoBtn && infoPanel) {
            chatInfoBtn.addEventListener('click', () => {
                infoPanel.classList.toggle('active');
            });

            closeInfoBtn.addEventListener('click', () => {
                infoPanel.classList.remove('active');
            });
        }

        // Закрытие модального окна по клику вне его
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('new-chat-modal');
            if (modal && !modal.classList.contains('hidden') && 
                e.target === modal) {
                window.chatManager.closeNewChatModal();
            }
        });

        // Обработка Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('new-chat-modal');
                if (modal && !modal.classList.contains('hidden')) {
                    window.chatManager.closeNewChatModal();
                }
                
                const infoPanel = document.querySelector('.info-panel');
                if (infoPanel && infoPanel.classList.contains('active')) {
                    infoPanel.classList.remove('active');
                }
            }
        });
    }

    initInfoPanel() {
        // Здесь можно добавить дополнительную логику для панели информации
        const updateChatInfo = () => {
            const chatInfo = document.getElementById('chat-info');
            if (!window.chatManager?.activeChat) {
                chatInfo.innerHTML = '<p>Выберите чат, чтобы увидеть информацию</p>';
                return;
            }

            const chat = window.chatManager.activeChat;
            chatInfo.innerHTML = `
                <h4>${chat.name}</h4>
                <p><strong>Тип:</strong> ${chat.type === 'private' ? 'Личный чат' : 'Групповой чат'}</p>
                ${chat.type === 'group' ? `
                    <p><strong>Участники:</strong> ${chat.members.join(', ')}</p>
                ` : ''}
                <p><strong>Статус:</strong> ${chat.isOnline ? 'online' : 'offline'}</p>
                <p><strong>Создан:</strong> ${new Date().toLocaleDateString()}</p>
            `;
        };

        // Обновляем информацию при смене чата
        setInterval(updateChatInfo, 1000);
    }

    addStyles() {
        // Добавляем дополнительные стили через JavaScript
        const style = document.createElement('style');
        style.textContent = `
            .unread-badge {
                display: inline-block;
                background: var(--primary-color);
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 5px;
                min-width: 18px;
                text-align: center;
            }
            
            .contact.active .unread-badge {
                background: white;
                color: var(--primary-color);
            }
            
            .loading {
                color: var(--secondary-color);
                font-style: italic;
            }
            
            .fa-spin {
                animation: fa-spin 2s infinite linear;
            }
            
            @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
});