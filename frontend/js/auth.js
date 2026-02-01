class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.apiBaseUrl = 'http://localhost:8080/api'; // Будет использоваться с backend
        
        this.initElements();
        this.bindEvents();
        this.checkAuth();
    }

    initElements() {
        // Элементы аутентификации
        this.authScreen = document.getElementById('auth-screen');
        this.chatScreen = document.getElementById('chat-screen');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.showRegisterLink = document.getElementById('show-register');
        this.showLoginLink = document.getElementById('show-login');
        this.loginBtn = document.getElementById('login-btn');
        this.registerBtn = document.getElementById('register-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // Поля ввода
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.regUsernameInput = document.getElementById('reg-username');
        this.regPasswordInput = document.getElementById('reg-password');
        this.regConfirmInput = document.getElementById('reg-confirm');
        
        // Элементы пользователя
        this.currentUserElement = document.getElementById('current-user');
        this.userAvatar = document.getElementById('user-avatar');
        this.infoUsername = document.getElementById('info-username');
    }

    bindEvents() {
        // Переключение между формами
        this.showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });

        this.showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        // Авторизация
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.registerBtn.addEventListener('click', () => this.handleRegister());
        this.logoutBtn.addEventListener('click', () => this.handleLogout());

        // Ввод по Enter
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    }

    showForm(formType) {
        if (formType === 'register') {
            this.loginForm.classList.add('hidden');
            this.registerForm.classList.remove('hidden');
        } else {
            this.registerForm.classList.add('hidden');
            this.loginForm.classList.remove('hidden');
        }
    }

    async handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!username || !password) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        try {
            // Здесь будет реальный запрос к backend
            // const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ username, password })
            // });
            
            // if (!response.ok) throw new Error('Ошибка авторизации');
            // const data = await response.json();

            // Имитация успешной авторизации для демонстрации
            const mockUser = {
                id: 1,
                username: username,
                email: `${username}@example.com`,
                status: 'online',
                lastSeen: new Date().toISOString(),
                avatarColor: this.getRandomColor()
            };

            this.loginSuccess(mockUser);
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Неверное имя пользователя или пароль', 'error');
        }
    }

    async handleRegister() {
        const username = this.regUsernameInput.value.trim();
        const password = this.regPasswordInput.value;
        const confirmPassword = this.regConfirmInput.value;

        if (!username || !password || !confirmPassword) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Пароль должен содержать минимум 6 символов', 'error');
            return;
        }

        try {
            // Здесь будет реальный запрос к backend
            // const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ username, password, email: `${username}@example.com` })
            // });
            
            // if (!response.ok) throw new Error('Ошибка регистрации');
            // const data = await response.json();

            // Имитация успешной регистрации для демонстрации
            const mockUser = {
                id: Date.now(),
                username: username,
                email: `${username}@example.com`,
                status: 'online',
                lastSeen: new Date().toISOString(),
                avatarColor: this.getRandomColor()
            };

            this.showNotification('Регистрация успешна! Выполняется вход...', 'success');
            setTimeout(() => this.loginSuccess(mockUser), 1500);
            
        } catch (error) {
            console.error('Register error:', error);
            this.showNotification('Ошибка регистрации. Попробуйте другое имя', 'error');
        }
    }

    loginSuccess(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Сохраняем пользователя в localStorage (временное решение до backend)
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Обновляем UI
        this.updateUserUI(user);
        
        // Переключаем экраны
        this.authScreen.classList.add('hidden');
        this.chatScreen.classList.remove('hidden');
        
        // Инициализируем чат
        if (window.chatManager) {
            window.chatManager.setCurrentUser(user);
            window.chatManager.loadContacts();
        }
        
        this.showNotification(`Добро пожаловать, ${user.username}!`, 'success');
        
        // Очищаем поля
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        this.regUsernameInput.value = '';
        this.regPasswordInput.value = '';
        this.regConfirmInput.value = '';
        
        this.showForm('login');
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Очищаем localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        
        // Переключаем экраны
        this.authScreen.classList.remove('hidden');
        this.chatScreen.classList.add('hidden');
        
        this.showNotification('Вы вышли из системы', 'info');
    }

    checkAuth() {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('currentUser');
        
        if (isAuthenticated === 'true' && userData) {
            try {
                const user = JSON.parse(userData);
                this.loginSuccess(user);
            } catch (error) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isAuthenticated');
            }
        }
    }

    updateUserUI(user) {
        this.currentUserElement.textContent = user.username;
        this.infoUsername.textContent = user.username;
        
        // Устанавливаем цвет аватара
        this.userAvatar.style.backgroundColor = user.avatarColor;
        
        // Обновляем статус
        const statusElement = document.querySelector('.user-status');
        if (statusElement) {
            statusElement.textContent = user.status;
            statusElement.className = `user-status ${user.status}`;
        }
        
        // Обновляем время последней активности
        const lastSeenElement = document.getElementById('info-last-seen');
        if (lastSeenElement && user.lastSeen) {
            lastSeenElement.textContent = new Date(user.lastSeen).toLocaleString();
        }
    }

    getRandomColor() {
        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        notificationArea.appendChild(notification);
        
        // Автоматическое удаление уведомления через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});