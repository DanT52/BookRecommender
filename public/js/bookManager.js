class BookManager {
    constructor(bookService, authService) {
        const inputTitle = document.getElementById('input-title');
        const inputAuthor = document.getElementById('input-author');
        const addBookBtn = document.getElementById('add-book');

        this.bookService = bookService;
        this.authService = authService;
        this.books = [];
        this.bookRecs = [];

        addBookBtn.addEventListener('click', () => this.addBook());
        inputTitle.addEventListener('keypress', (event) => this.submitBook(event));
        inputAuthor.addEventListener('keypress', (event) => this.submitBook(event));



    }

    submitBook(event) {
        if (event.key === 'Enter') {
            this.addBook();
            event.preventDefault(); 
        }
    }

    addBook() {
        console.log(this.books)
        const inputTitle = document.getElementById('input-title');
        const inputAuthor = document.getElementById('input-author');
        const bookTitle = inputTitle.value.trim();
        const authorName = inputAuthor.value.trim();
    
        if (!(bookTitle && authorName)) {
            return;
        }
    
        const bookData = {
            title: inputTitle.value.trim(),
            author: inputAuthor.value.trim()
        };

        if (this.books.some(book => book.title === bookData.title && book.author === bookData.author)) {
            alert("Book already in list.");
            return;
        }
        this.books.push(bookData)
        
        this.addBookItem(bookData);
        inputTitle.value = '';
        inputAuthor.value = '';
        
        if (this.authService.isAuthenticated){
            this.bookService.postBook(bookData);
        }
    }
    addRecommendation(bookData) {
        this.bookRecs.push(bookData)
        this.addBookItem(bookData, true);
        if (this.authService.isAuthenticated){
            //this.bookService.postBookRec(bookData);
        }
    }

    addBookItem(bookData, recommendation = false) {
        const bookList = document.getElementById(recommendation ? 'book-recs' : 'book-list');
        const li = document.createElement('li');
        const titleSpan = document.createElement('span');
        const authorSpan = document.createElement('span');
        const deleteBtn = document.createElement('button');
    
        // This event listener is added only when the recommendation flag is not set.
        if (!recommendation) {
            li.addEventListener('click', () => {
                li.classList.toggle('selected');
            });
        }
    
        titleSpan.textContent = bookData.title;
        authorSpan.textContent = ` by ${bookData.author}`;
        deleteBtn.textContent = 'Delete';
        authorSpan.classList.add('author-text');
    
        deleteBtn.addEventListener('click', () => {
            this.removeBook(bookData, li);
        });
    
        li.appendChild(titleSpan);
        li.appendChild(authorSpan);
        li.appendChild(deleteBtn);
    
        bookList.appendChild(li);
    }
    

    removeBook(bookData, bookItem, recommendation = false) {
        const bookList = document.getElementById('book-list');
        bookList.removeChild(bookItem);
        const index = this.books.findIndex(book => book.title === bookData.title && book.author === bookData.author);
    
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    
        if (this.authService.isAuthenticated) {
            if (!recommendation) this.bookService.deleteBook(bookData);
            //else this.bookService.deleteRecommendation(bookData);
        }
    
    }

    async loadBooksFromServer() {
        const loadedBooks = await this.bookService.fetchMyBooks();
        loadedBooks.forEach(book => {
            const bookData = {
                title: book.title,
                author: book.author
            };
            this.books.push(bookData)
            this.addBookItem(bookData)
        })
        
    }

    
}


// function recommendBooks() {
//     const checkedBooks = document.querySelectorAll('#book-list li.done');
//     checkedBooks.forEach(book => {
//       const title = book.querySelector('span:nth-child(2)').textContent;
//       const author = book.querySelector('.author-text').textContent;
//       console.log(`Title: ${title}, Author: ${author}`);
//     });
// }
