function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const notification = document.getElementById('notification');
    if (notification) {
        setTimeout(closeNotification, 5000);
    }

    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formInputs = form.querySelectorAll('input');
            let hasErrors = false;

            formInputs.forEach(input => {
                const errorMessage = input.nextElementSibling;
                
                // Clear previous error states
                input.classList.remove('invalid');
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.textContent = '';
                }

                // Validate each input
                if (!input.checkValidity()) {
                    hasErrors = true;
                    input.classList.add('invalid');

                    // Show specific error messages
                    if (input.type === 'email') {
                        if (input.value === '') {
                            showError(input, 'Email is required');
                        } else {
                            showError(input, 'Please enter a valid email address');
                        }
                    } else if (input.type === 'password') {
                        if (input.value === '') {
                            showError(input, 'Password is required');
                        } else if (input.value.length < 8) {
                            showError(input, 'Password must be at least 8 characters');
                        }
                    } else if (input.name === 'name') {
                        if (input.value === '') {
                            showError(input, 'Name is required');
                        } else if (!input.value.match(/^[A-Za-z\s]+$/)) {
                            showError(input, 'Name can only contain letters and spaces');
                        }
                    }
                }
            });

            if (!hasErrors) {
                form.submit();
            } else {
                showNotification('Please correct the errors before submitting', 'error');
            }
        });
    });

    const emailInputs = document.querySelectorAll('input[type="email"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const email = e.target.value;
            const errorMessage = e.target.nextElementSibling;
            
            if (email === '') {
                errorMessage.textContent = 'Email is required';
            } else if (!isValidEmail(email)) {
                errorMessage.textContent = 'Please enter a valid email address';
            } else {
                errorMessage.textContent = '';
            }
        });
    });
});

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
    } else {
        const error = document.createElement('small');
        error.className = 'error-message';
        error.textContent = message;
        input.parentNode.insertBefore(error, input.nextSibling);
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button type="button" onclick="closeNotification()" class="close-btn" aria-label="Close">&times;</button>
    `;
    
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    document.body.appendChild(notification);
    setTimeout(() => closeNotification(), 5000);
}