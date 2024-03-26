

const inputTitle = document.getElementById('input-title');
const inputAuthor = document.getElementById('input-author');
const addBookBtn = document.getElementById('add-book');
const bookList = document.getElementById('book-list');
const recommendBtn = document.getElementById('recommend');
const signInButton = document.getElementById('login');

let isAuthenticated = false

document.addEventListener('DOMContentLoaded', checkAuthStatus);

addBookBtn.addEventListener('click', addBook);
inputTitle.addEventListener('keypress', handleKeyPress);
inputAuthor.addEventListener('keypress', handleKeyPress);
recommendBtn.addEventListener('click', recommendBooks);

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
        window.location.reload();
        console.log('User authenticated!');
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

function checkAuthStatus() {
    fetch('http://localhost:3000/auth/status', { credentials: 'include' }) // Ensure credentials are sent with the request
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          updateSignInButton(true);
          isAuthenticated = true;
        } else {
          updateSignInButton(false);
          isAuthenticated = false;
        }
      })
      .catch(error => console.error('Error:', error));
}


function recommendBooks() {
    const checkedBooks = document.querySelectorAll('#book-list li.done');
    checkedBooks.forEach(book => {
      const title = book.querySelector('span:nth-child(2)').textContent;
      const author = book.querySelector('.author-text').textContent;
      console.log(`Title: ${title}, Author: ${author}`);
    });
}

function addBook() {
    const bookTitle = inputTitle.value.trim();
    const authorName = inputAuthor.value.trim();

    if (bookTitle && authorName) {
        addBookItem(bookTitle, authorName);
        inputTitle.value = '';
        inputAuthor.value = '';
    }

    if (isAuthenticated){
        postBook(bookTitle, authorName);
    }
}

function addBookItem(title, author) {
    const li = document.createElement('li');
    const titleSpan = document.createElement('span');
    const authorSpan = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        li.classList.toggle('done');
    });

    titleSpan.textContent = title;
    authorSpan.textContent = ` by ${author}`;
    deleteBtn.textContent = 'Delete';
    authorSpan.classList.add('author-text');

    deleteBtn.addEventListener('click', () => {
        bookList.removeChild(li);
    });

    li.appendChild(checkbox);
    li.appendChild(titleSpan);
    li.appendChild(authorSpan);
    li.appendChild(deleteBtn);

    bookList.appendChild(li);

}

async function postBook(bookTitle, authorName) {
    const bookData = {
        title: bookTitle,
        author: authorName
    };

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
