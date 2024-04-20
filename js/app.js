

const inputTitle = document.getElementById('input-title');
const inputAuthor = document.getElementById('input-author');
const addBookBtn = document.getElementById('add-book');
const bookList = document.getElementById('book-list');
const recommendBtn = document.getElementById('recommend');
const signInButton = document.getElementById('login');

let isAuthenticated = false
let inputBooks = []

document.addEventListener('DOMContentLoaded', domLoaded);

addBookBtn.addEventListener('click', addBook);
inputTitle.addEventListener('keypress', handleKeyPress);
inputAuthor.addEventListener('keypress', handleKeyPress);
//recommendBtn.addEventListener('click', recommendBooks);

async function domLoaded() {

    await checkAuthStatus(); // Wait for authentication status check to complete

    if (isAuthenticated) {
        fetchMyBooks();
    }
}


function updateSignInButton(isLoggedIn) {
    if (isLoggedIn) {
      signInButton.textContent = 'Sign Out';
      signInButton.removeEventListener('click', initiateGoogleOAuth);
      signInButton.addEventListener('click', signOut);
    } else {
      signInButton.textContent = 'Login with Google';
      signInButton.removeEventListener('click', signOut);
      signInButton.addEventListener('click', initiateGoogleOAuth);
    }
}
window.addEventListener('message', (event) => {
    // Make sure the message is from your popup and contains the expected data
    if (event.origin === 'http://localhost:5500' && event.data === 'authenticated') {
        console.log('User authenticated!');
        window.location.reload();
      // Here, you can update the UI accordingly
    }
});

function initiateGoogleOAuth() {
    window.open('http://localhost:3000/auth/google', 'GoogleOAuthLogin', 'width=500,height=600');
}
  
function signOut() {
    fetch('http://localhost:3000/auth/logout', { credentials: 'include' })
    setTimeout(() => {
        window.location.reload();
    }, 1000);

}


function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addBook();
        event.preventDefault(); 
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch('http://localhost:3000/auth/status', { credentials: 'include' });
        const data = await response.json();
        isAuthenticated = data.isAuthenticated; // Update isAuthenticated based on response
        updateSignInButton(isAuthenticated);
    } catch (error) {
        console.error('Error:', error);
        isAuthenticated = false; // Assume not authenticated if there's an error
        updateSignInButton(false);
    }
}



function addBook() {
    const bookTitle = inputTitle.value.trim();
    const authorName = inputAuthor.value.trim();

    if (!(bookTitle && authorName)) {
        return;
    }

    const bookData = {
        title: inputTitle.value.trim(),
        author: inputAuthor.value.trim()
    };

    if (inputBooks.some(book => book.title === bookData.title && book.author === bookData.author)) {
        alert("Book already in list.");
        return;
    }
    inputBooks.push(bookData)
    
    addBookItem(bookData);
    inputTitle.value = '';
    inputAuthor.value = '';
    
    if (isAuthenticated){
        postBook(bookData);
    }
}

function addBookItem(bookData) {
    const li = document.createElement('li');
    const titleSpan = document.createElement('span');
    const authorSpan = document.createElement('span');
    const deleteBtn = document.createElement('button');

    li.addEventListener('click', () => {
        li.classList.toggle('done');

    });
    

    titleSpan.textContent = bookData.title;
    authorSpan.textContent = ` by ${bookData.author}`;
    deleteBtn.textContent = 'Delete';
    authorSpan.classList.add('author-text');

    deleteBtn.addEventListener('click', function() {
        removeBook(bookData, li);
    });


    li.appendChild(titleSpan);
    li.appendChild(authorSpan);
    li.appendChild(deleteBtn);

    bookList.appendChild(li);

}

function removeBook(bookData, bookItem) {
    bookList.removeChild(bookItem);
    const index = inputBooks.findIndex(book => book.title === bookData.title && book.author === bookData.author);

    if (index !== -1) {
        inputBooks.splice(index, 1);
    }

    if (isAuthenticated) {
        deleteBook(bookData);
    }

}

async function postBook(bookData) {

    try {
        const response = await fetch('http://localhost:3000/add-book', {
            method: 'POST',
            credentials: 'include', // Include cookies for authentication
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData) // Convert the bookData object into a JSON string
        });
        
        const data = await response.json(); // Parse the JSON response

        // Handle response data from the server
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchMyBooks() {
    console.log("fetchingbooks...")
    try {
        // Make a GET request to the /my-books endpoint
        const response = await fetch('http://localhost:3000/my-books', {
            method: 'GET',
            credentials: 'include', // Necessary for including the session cookie with the request
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const books = await response.json(); // Parse the JSON response

        console.log('Fetched Books:', books);
        books.forEach(book => {
            const bookData = {
                title: book.title,
                author: book.author
            };
            inputBooks.push(bookData)
            addBookItem(bookData)
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

async function deleteBook(bookData) {
    try {
        const response = await fetch('http://localhost:3000/delete-book', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Delete result:', result);
    } catch (error) {
        console.error('Error:', error);
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
