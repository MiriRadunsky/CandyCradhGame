document.addEventListener('DOMContentLoaded', function () {
    function toggleForms() {
        document.getElementById('login-form').classList.toggle('inactive');
        document.getElementById('login-form').classList.toggle('active');
        document.getElementById('register-form').classList.toggle('inactive');
        document.getElementById('register-form').classList.toggle('active');
    }

    window.toggleForms = toggleForms;

    function registerUser() {
        const username = document.getElementById('register-user').value;
        const password = document.getElementById('register-pass').value;
        const email = document.getElementById('register-email').value;

        if (!username) {
            alert('Username is required!');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert('Invalid email address!');
            return;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,8}$/;

        if (!passwordPattern.test(password)) {
            alert('Password must contain at least one letter, at least 5 digits, and be 6-8 characters long!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('User already exists!');
        } else {
            users.push({ username: username, password: password, email: email });
            localStorage.setItem('users', JSON.stringify(users));
            alert('User registered successfully!');
            toggleForms();
        }
    }

    window.registerUser = registerUser;

    function loginUser() {
        const username = document.getElementById('login-user').value;
        const password = document.getElementById('login-pass').value;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            window.location.href = 'פרויקט js/html/game.html';
        } else {
            alert('Invalid username or password!');
        }
    }

    window.loginUser = loginUser;
});

