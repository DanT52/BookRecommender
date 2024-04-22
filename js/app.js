const bookService = new BookService();
const bookManager = new BookManager(bookService);


document.addEventListener('DOMContentLoaded', domLoaded);

async function domLoaded() {
    bookManager.loadFromLocal();
    bookManager.loadFromLocal(true)
}

