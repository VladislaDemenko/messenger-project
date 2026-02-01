class ChatManager {
    constructor() {
        this.currentUser = null;
        this.activeChat = null;
        this.contacts = [];
        this.messages = new Map(); // chatId -> messages array
        
        this.initElements();
        this.bindEvents();
        this.loadMockData();
    }

    initElements() {
        // Элементы чата
        this.contactsList = document.getElementById('contacts-list');
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('message-input');
        this.sendBtn = document.getElementById('send-btn');
        this.activeChatName = document.getElementById('active-chat-name');
        this.activeChatStatus = document.getElementById('active-chat-status');
        
        // Кнопки
        this.newChatBtn = document.getElementById('new-chat-btn');
        this.attachBtn = document.getElementById('attach-btn');
        this.emojiBtn = document.getElementById('emoji-btn');
        
        // Модальное окно
        this.newChatModal = document.getElementById('new-chat-modal');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.cancelChatBtn = document.getElementById('cancel-chat-btn');
        this.createChatBtn = document.getElementById('create-chat-btn');
        this.chatTypeSelect = document.getElementById('chat-type');
        this.groupNameInput = document.getElementById('group-name');
        
        // Поиск
        this.contactSearch = document.getElementById('contact-search');
    }

    bindEvents() {
        // Отправка сообщений
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Новый чат
        this.newChatBtn.addEventListener('click', () => this.openNewChatModal());
        this.closeModalBtn.addEventListener('click', () => this.closeNewChatModal());
        this.cancelChatBtn.addEventListener('click', () => this.closeNewChatModal());
        this.createChatBtn.addEventListener('click', () => this.createNewChat());
        
        // Переключение типа чата в модальном окне
        this.chatTypeSelect.addEventListener('change', (e) => this.toggleChatType(e.target.value));
        
        // Поиск контактов
        this.contactSearch.addEventListener('input', (e) => this.searchContacts(e.target.value));
        
        // Имитация получения новых сообщений
        setInterval(() => this.simulateIncomingMessage(), 15000);
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    async loadContacts() {
        // Здесь будет запрос к backend
        // const response = await fetch(`${window.authManager.apiBaseUrl}/chats`);
        // this.contacts = await response.json();
        
        // Имитация загрузки контактов
        setTimeout(() => {
            this.renderContacts();
        }, 500);
    }

    loadMockData() {
        // Mock контакты для демонстрации
        this.contacts = [
            {
                id: 1,
                name: "Алексей Петров",
                type: "private",
                lastMessage: "Привет, как дела?",
                lastMessageTime: "10:30",
                unreadCount: 2,
                avatarColor: "#28a745",
                isOnline: true,
                members: []
            },
            {
                id: 2,
                name: "Мария Иванова",
                type: "private",
                lastMessage: "Готовы к встрече?",
                lastMessageTime: "09:15",
                unreadCount: 0,
                avatarColor: "#dc3545",
                isOnline: false,
                members: []
            },
            {
                id: 3,
                name: "Рабочая группа",
                type: "group",
                lastMessage: "Иван: Отправил финальный отчет",
                lastMessageTime: "Вчера",
                unreadCount: 5,
                avatarColor: "#ffc107",
                isOnline: true,
                members: ["Алексей", "Мария", "Иван", "Елена"]
            },
            {
                id: 4,
                name: "Друзья",
                type: "group",
                lastMessage: "Ольга: Кто сегодня вечером свободен?",
                lastMessageTime: "12/04",
                unreadCount: 0,
                avatarColor: "#17a2b8",
                isOnline: true,
                members: ["Сергей", "Ольга", "Дмитрий"]
            }
        ];

        // Mock сообщения
        this.messages.set(1, [
            {
                id: 1,
                chatId: 1,
                senderId: 2,
                senderName: "Алексей Петров",
                text: "Привет! Как дела?",
                timestamp: "2024-01-15T10:30:00",
                isRead: true
            },
            {
                id: 2,
                chatId: 1,
                senderId: 1,
                senderName: "Вы",
                text: "Привет! Всё отлично, спасибо! А у тебя?",
                timestamp: "2024-01-15T10:32:00",
                isRead: true
            },
            {
                id: 3,
                chatId: 1,
                senderId: 2,
                senderName: "Алексей Петров",
                text: "Тоже всё хорошо, работаю над новым проектом",
                timestamp: "2024-01-15T10:35:00",
                isRead: false
            }
        ]);

        this.messages.set(3, [
            {
                id: 4,
                chatId: 3,
                senderId: 3,
                senderName: "Иван",
                text: "Доброе утро всем!",
                timestamp: "2024-01-15T09:00:00",
                isRead: true
            },
            {
                id: 5,
                chatId: 3,
                senderId: 4,
                senderName: "Елена",
                text: "Привет! Кто готовил презентацию?",
                timestamp: "2024-01-15T09:15:00",
                isRead: true
            },
            {
                id: 6,
                chatId: 3,
                senderId: 3,
                senderName: "Иван",
                text: "Я отправил финальный отчет на почту",
                timestamp: "2024-01-15T09:30:00",
                isRead: false
            }
        ]);
    }

    renderContacts() {
        if (this.contacts.length === 0) {
            this.contactsList.innerHTML = `
                <div class="contact">
                    <div class="contact-details">
                        <div class="contact-name">Контакты не найдены</div>
                        <div class="contact-last-message">Создайте новый чат</div>
                    </div>
                </div>
            `;
            return;
        }

        this.contactsList.innerHTML = this.contacts.map(contact => `
            <div class="contact ${this.activeChat?.id === contact.id ? 'active' : ''}" 
                 data-chat-id="${contact.id}">
                <div class="contact-avatar" style="background-color: ${contact.avatarColor}">
                    <i class="fas ${contact.type === 'group' ? 'fa-users' : 'fa-user'}"></i>
                </div>
                <div class="contact-details">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-last-message">${contact.lastMessage || 'Нет сообщений'}</div>
                </div>
                <div class="contact-time">
                    ${contact.lastMessageTime || ''}
                    ${contact.unreadCount > 0 ? `
                        <span class="unread-badge">${contact.unreadCount}</span>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Добавляем обработчики кликов на контакты
        document.querySelectorAll('.contact').forEach(contact => {
            contact.addEventListener('click', () => {
                const chatId = parseInt(contact.dataset.chatId);
                this.selectChat(chatId);
            });
        });
    }

    selectChat(chatId) {
        this.activeChat = this.contacts.find(c => c.id === chatId);
        
        // Обновляем активный чат в UI
        document.querySelectorAll('.contact').forEach(c => {
            c.classList.remove('active');
        });
        document.querySelector(`.contact[data-chat-id="${chatId}"]`)?.classList.add('active');
        
        // Обновляем заголовок чата
        this.activeChatName.textContent = this.activeChat.name;
        this.activeChatStatus.textContent = this.activeChat.type === 'group' 
            ? `${this.activeChat.members.length} участников` 
            : (this.activeChat.isOnline ? 'online' : 'offline');
        
        // Активируем поле ввода
        this.messageInput.disabled = false;
        this.sendBtn.disabled = false;
        
        // Загружаем сообщения
        this.loadMessages(chatId);
    }

    loadMessages(chatId) {
        const chatMessages = this.messages.get(chatId) || [];
        
        if (chatMessages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="empty-chat">
                    <i class="fas fa-comment-slash"></i>
                    <h3>Нет сообщений</h3>
                    <p>Начните общение первым</p>
                </div>
            `;
            return;
        }

        this.messagesContainer.innerHTML = chatMessages.map(message => {
            const isSent = message.senderName === 'Вы';
            const time = new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <div class="message ${isSent ? 'sent' : 'received'}">
                    ${!isSent && this.activeChat?.type === 'group' ? `
                        <div class="message-sender">${message.senderName}</div>
                    ` : ''}
                    <div class="message-text">${this.escapeHtml(message.text)}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }).join('');

        // Прокручиваем вниз
        this.scrollToBottom();
    }

    handleInputChange() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const text = this.messageInput.value.trim();
        
        if (!text || !this.activeChat) return;

        // Создаем сообщение
        const message = {
            id: Date.now(),
            chatId: this.activeChat.id,
            senderId: this.currentUser.id,
            senderName: 'Вы',
            text: text,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        // Добавляем в локальное хранилище
        const chatMessages = this.messages.get(this.activeChat.id) || [];
        chatMessages.push(message);
        this.messages.set(this.activeChat.id, chatMessages);

        // Отображаем сообщение
        this.displayMessage(message);

        // Очищаем поле ввода
        this.messageInput.value = '';
        this.handleInputChange();

        // Обновляем последнее сообщение в контактах
        const contact = this.contacts.find(c => c.id === this.activeChat.id);
        if (contact) {
            contact.lastMessage = text.length > 30 ? text.substring(0, 30) + '...' : text;
            contact.lastMessageTime = new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            this.renderContacts();
        }

        // Здесь будет отправка на сервер
        // await fetch(`${window.authManager.apiBaseUrl}/messages`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(message)
        // });
    }

    displayMessage(message) {
        const isSent = message.senderName === 'Вы';
        const time = new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const messageElement = document.createElement('div');
        messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
            ${!isSent && this.activeChat?.type === 'group' ? `
                <div class="message-sender">${message.senderName}</div>
            ` : ''}
            <div class="message-text">${this.escapeHtml(message.text)}</div>
            <div class="message-time">${time}</div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    scrollToBottom() {
        const container = this.messagesContainer.parentElement;
        container.scrollTop = container.scrollHeight;
    }

    openNewChatModal() {
        this.newChatModal.classList.remove('hidden');
        this.toggleChatType(this.chatTypeSelect.value);
        
        // Загрузка пользователей для приватного чата
        this.loadUsersForPrivateChat();
    }

    closeNewChatModal() {
        this.newChatModal.classList.add('hidden');
        this.groupNameInput.value = '';
    }

    toggleChatType(type) {
        const privateForm = document.getElementById('private-chat-form');
        const groupForm = document.getElementById('group-chat-form');
        
        if (type === 'private') {
            privateForm.classList.remove('hidden');
            groupForm.classList.add('hidden');
        } else {
            privateForm.classList.add('hidden');
            groupForm.classList.remove('hidden');
        }
    }

    async loadUsersForPrivateChat() {
        // Здесь будет запрос к backend для получения списка пользователей
        // const response = await fetch(`${window.authManager.apiBaseUrl}/users`);
        // const users = await response.json();

        const mockUsers = [
            { id: 2, username: "Алексей Петров" },
            { id: 3, username: "Мария Иванова" },
            { id: 4, username: "Иван Сидоров" },
            { id: 5, username: "Елена Ковалева" },
            { id: 6, username: "Сергей Новиков" }
        ];

        const select = document.getElementById('private-chat-user');
        select.innerHTML = '<option value="">Выберите пользователя...</option>' +
            mockUsers.map(user => `
                <option value="${user.id}">${user.username}</option>
            `).join('');
    }

    async createNewChat() {
        const type = this.chatTypeSelect.value;
        
        if (type === 'private') {
            const userId = document.getElementById('private-chat-user').value;
            if (!userId) {
                window.authManager.showNotification('Выберите пользователя', 'error');
                return;
            }
            
            // Создание приватного чата
            const newChat = {
                id: Date.now(),
                name: document.getElementById('private-chat-user').selectedOptions[0].text,
                type: 'private',
                lastMessage: '',
                lastMessageTime: '',
                unreadCount: 0,
                avatarColor: this.getRandomColor(),
                isOnline: true,
                members: []
            };
            
            this.contacts.unshift(newChat);
            this.closeNewChatModal();
            this.renderContacts();
            
            window.authManager.showNotification('Чат создан', 'success');
            
        } else {
            const groupName = this.groupNameInput.value.trim();
            if (!groupName) {
                window.authManager.showNotification('Введите название группы', 'error');
                return;
            }
            
            // Создание группового чата
            const newChat = {
                id: Date.now(),
                name: groupName,
                type: 'group',
                lastMessage: '',
                lastMessageTime: '',
                unreadCount: 0,
                avatarColor: this.getRandomColor(),
                isOnline: true,
                members: ['Вы', 'Алексей', 'Мария']
            };
            
            this.contacts.unshift(newChat);
            this.closeNewChatModal();
            this.renderContacts();
            
            window.authManager.showNotification('Групповой чат создан', 'success');
        }
    }

    searchContacts(query) {
        const filteredContacts = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(query.toLowerCase())
        );
        
        this.contactsList.innerHTML = filteredContacts.map(contact => `
            <div class="contact ${this.activeChat?.id === contact.id ? 'active' : ''}" 
                 data-chat-id="${contact.id}">
                <div class="contact-avatar" style="background-color: ${contact.avatarColor}">
                    <i class="fas ${contact.type === 'group' ? 'fa-users' : 'fa-user'}"></i>
                </div>
                <div class="contact-details">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-last-message">${contact.lastMessage || 'Нет сообщений'}</div>
                </div>
                <div class="contact-time">${contact.lastMessageTime || ''}</div>
            </div>
        `).join('');

        // Добавляем обработчики кликов
        document.querySelectorAll('.contact').forEach(contact => {
            contact.addEventListener('click', () => {
                const chatId = parseInt(contact.dataset.chatId);
                this.selectChat(chatId);
            });
        });
    }

    simulateIncomingMessage() {
        if (!this.activeChat || Math.random() < 0.5) return;

        const mockMessages = [
            "Привет!",
            "Как дела?",
            "Что нового?",
            "Посмотри это!",
            "Готов к встрече?",
            "Отличная работа!",
            "Когда сможем созвониться?",
            "Отправил файл на почту"
        ];

        const mockSenders = [
            { id: 2, name: "Алексей Петров" },
            { id: 3, name: "Мария Иванова" },
            { id: 4, name: "Иван Сидоров" }
        ];

        const sender = mockSenders[Math.floor(Math.random() * mockSenders.length)];
        const message = mockMessages[Math.floor(Math.random() * mockMessages.length)];

        const newMessage = {
            id: Date.now(),
            chatId: this.activeChat.id,
            senderId: sender.id,
            senderName: sender.name,
            text: message,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        // Добавляем сообщение
        const chatMessages = this.messages.get(this.activeChat.id) || [];
        chatMessages.push(newMessage);
        this.messages.set(this.activeChat.id, chatMessages);

        // Отображаем, если активен этот чат
        if (this.activeChat.id === newMessage.chatId) {
            this.displayMessage(newMessage);
        }

        // Обновляем последнее сообщение в контакте
        const contact = this.contacts.find(c => c.id === this.activeChat.id);
        if (contact) {
            contact.lastMessage = message.length > 30 ? message.substring(0, 30) + '...' : message;
            contact.lastMessageTime = new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            contact.unreadCount = (contact.unreadCount || 0) + 1;
            this.renderContacts();
        }

        // Показываем уведомление, если чат не активен
        if (this.activeChat.id !== newMessage.chatId) {
            window.authManager.showNotification(
                `Новое сообщение от ${sender.name}: ${message}`,
                'info'
            );
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getRandomColor() {
        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});