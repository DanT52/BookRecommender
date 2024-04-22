const bookService = new BookService();
const authService = new AuthService();
const bookManager = new BookManager(bookService, authService);


document.addEventListener('DOMContentLoaded', domLoaded);

async function domLoaded() {

    await authService.checkAuthStatus(); // Wait for authentication status check to complete

    if (authService.isAuthenticated) {
        bookManager.loadBooksFromServer();
    } else {
        bookManager.loadFromLocal();
    }
    bookManager.loadFromLocal(true)
}

