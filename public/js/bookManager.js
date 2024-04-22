class BookManager {
    constructor(bookService, authService) {
        const inputTitle = document.getElementById('input-title');
        const inputAuthor = document.getElementById('input-author');
        const addBookBtn = document.getElementById('add-book');
        const recommendBtn = document.getElementById('recommend');
        const clearRecommendations = document.getElementById('clearRecs');

        this.bookService = bookService;
        this.authService = authService;
        this.books = [];
        this.bookRecs = [];

        addBookBtn.addEventListener('click', () => this.addBook());
        inputTitle.addEventListener('keypress', (event) => this.submitBook(event));
        inputAuthor.addEventListener('keypress', (event) => this.submitBook(event));
        recommendBtn.addEventListener('click', () => this.recommendBooks());
        clearRecommendations.addEventListener('click', () => this.clearRecommendations());


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
        localStorage.setItem('books', JSON.stringify(this.books));
        
        this.addBookItem(bookData);
        inputTitle.value = '';
        inputAuthor.value = '';
        
        if (this.authService.isAuthenticated){
            this.bookService.postBook(bookData);
        }
    }
    addRecommendation(bookData) {
        this.addBookItem(bookData, true);
        this.bookRecs.push(bookData)
        localStorage.setItem('recommendedBooks', JSON.stringify(this.bookRecs));
    }

    loadFromLocal(recommendation = false) {
        const storageKey = recommendation ? 'recommendedBooks' : 'books';
        const storedBooks = localStorage.getItem(storageKey);
        if (storedBooks.length > 2 && recommendation) {
            this.bookRecs = JSON.parse(storedBooks);
            this.bookRecs.forEach(book => this.addBookItem(book, recommendation));
            document.querySelector('.recommendedBooksTitle').classList.add('visible');
            document.querySelector('.clearRecommendations').classList.add('visible');
        }
        else if (storedBooks) {
            this.books = JSON.parse(storedBooks);
            this.books.forEach(book => this.addBookItem(book));
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
        } else {
            li.addEventListener('click', () => {
                const searchBtn = li.querySelector('.search-btn');
                const textToCopy = `${bookData.title} by ${bookData.author}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    searchBtn.textContent = "Copied!";
                    setTimeout(() => {
                        searchBtn.textContent = "Search";
                    }, 700); // Change back after half a second
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        }

        if (recommendation && this.bookRecs.length === 0) {
            document.querySelector('.recommendedBooksTitle').classList.add('visible');
            document.querySelector('.clearRecommendations').classList.add('visible');
            
        }
    
        titleSpan.textContent = bookData.title;
        titleSpan.classList.add('title-text');
        authorSpan.textContent = ` by ${bookData.author}`;
        deleteBtn.textContent = 'Delete';
        authorSpan.classList.add('author-text');
    
        deleteBtn.addEventListener('click', () => {
            this.removeBook(bookData, li, recommendation);
        });
    
        li.appendChild(titleSpan);
        li.appendChild(authorSpan);
        if (recommendation) {
            const searchBtn = document.createElement('button');
            searchBtn.textContent = 'Search';
            searchBtn.classList.add('search-btn');
            searchBtn.addEventListener('click', () => {
                const query = encodeURIComponent(`${bookData.title} by ${bookData.author}`);
                window.open(`https://www.google.com/search?tbm=bks&q=${query}`, '_blank');
            });
            li.appendChild(searchBtn);
        }
        li.appendChild(deleteBtn);
    
        bookList.appendChild(li);

        
    }
    
    removeBook(bookData, bookItem, recommendation = false) {
        const bookList = document.getElementById('book-list');
        const recommendationList = document.getElementById('book-recs');

        let index = -1
        if (recommendation){
            recommendationList.removeChild(bookItem);
            index = this.bookRecs.findIndex(book => book.title === bookData.title && book.author === bookData.author);
            if (index !== -1) this.bookRecs.splice(index, 1);
            localStorage.setItem('recommendedBooks', JSON.stringify(this.bookRecs));
            if (this.bookRecs.length === 0) {
                document.querySelector('.recommendedBooksTitle').classList.remove('visible');
                document.querySelector('.clearRecommendations').classList.remove('visible');
            }
            
        } 
        else {
            bookList.removeChild(bookItem);
            index = this.books.findIndex(book => book.title === bookData.title && book.author === bookData.author);
            if (index !== -1) this.books.splice(index, 1);
            localStorage.setItem('books', JSON.stringify(this.books));
        }

    
        if (this.authService.isAuthenticated) {
            if (!recommendation) this.bookService.deleteBook(bookData);
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

    async recommendBooks() {
        const checkedBooks = document.querySelectorAll('#book-list li.selected');
        const recommendBtn = document.getElementById('recommend');

        

        let booksToBaseRecommendationOn = [];
        let booksToNotRecommend = [];
        if (checkedBooks.length === 0) {
            alert('Please select at least one book to base recommendations on.');
            return;
        }

        recommendBtn.textContent = 'Loading...';

        checkedBooks.forEach(book => {
          const title = book.querySelector('.title-text').textContent;
          const author = book.querySelector('.author-text').textContent.substring(4);
          
            booksToBaseRecommendationOn.push({ 
                title: title,
                author: author 
            });

        });
        booksToNotRecommend.push(...this.bookRecs);

    // Filter this.books to find unselected books
        this.books.forEach(book => {
            const isBookSelected = booksToBaseRecommendationOn.some(selectedBook => 
                selectedBook.title === book.title && selectedBook.author === book.author
            );
            if (!isBookSelected) {
                booksToNotRecommend.push(book);
            }
        });

        console.log('Books to Base Recommendation On:', booksToBaseRecommendationOn);
        console.log('Books Not to Recommend:', booksToNotRecommend);

        const recommendedBooks = await this.bookService.fetchRecommendations(booksToBaseRecommendationOn, booksToNotRecommend);

        recommendedBooks.forEach(book => {
            this.addRecommendation(book);
        })

        recommendBtn.textContent = 'Recommend!';
    }

    async clearRecommendations() {
        console.log('Clearing recommendations...');
        const bookRecs = document.getElementById('book-recs');
        bookRecs.innerHTML = '';
        this.bookRecs = [];
        localStorage.setItem('recommendedBooks', JSON.stringify(this.bookRecs));
        document.querySelector('.recommendedBooksTitle').classList.remove('visible');
        document.querySelector('.clearRecommendations').classList.remove('visible');
    }

    
}



