class AuthService {
    constructor() {
        this.isAuthenticated = false;

        window.addEventListener('message', (event) => {
            // Make sure the message is from popup and contains the expected data
            if (event.origin === 'http://localhost:5500' && event.data === 'authenticated') {
                console.log('User authenticated!');
                window.location.reload();
            }
        });
        
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('http://localhost:3000/auth/status', { credentials: 'include' });
            const data = await response.json();
            this.isAuthenticated = data.isAuthenticated;
            this.updateSignInButton(this.isAuthenticated);
        } catch (error) {
            console.error('Error:', error);
            this.isAuthenticated = false;
            this.updateSignInButton(false);
        }
    }

    signOut() {
        fetch('http://localhost:3000/auth/logout', { credentials: 'include' })
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    initiateGoogleOAuth() {
        window.open('http://localhost:3000/auth/google', 'GoogleOAuthLogin', 'width=500,height=600');
    }

    updateSignInButton(isLoggedIn) {
        const signInButton = document.getElementById('login');
        if (isLoggedIn) {
          signInButton.textContent = 'Sign Out';
          signInButton.removeEventListener('click', this.initiateGoogleOAuth);
          signInButton.addEventListener('click', this.signOut);
        } else {
          signInButton.textContent = 'Login with Google';
          signInButton.removeEventListener('click', this.signOut);
          signInButton.addEventListener('click', this.initiateGoogleOAuth);
        }
    }
}
