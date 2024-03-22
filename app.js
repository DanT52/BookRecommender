const inputTitle = document.getElementById('input-title');
const inputAuthor = document.getElementById('input-author');
const addBookBtn = document.getElementById('add-book');
const bookList = document.getElementById('book-list');
const recommendBtn = document.getElementById('recommend');

addBookBtn.addEventListener('click', addTask);

inputTitle.addEventListener('keypress', handleKeyPress);
inputAuthor.addEventListener('keypress', handleKeyPress);
recommendBtn.addEventListener('click', recommendBooks);

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
        event.preventDefault(); 
    }
}


function recommendBooks() {
    const checkedBooks = document.querySelectorAll('#book-list li.done');
    checkedBooks.forEach(book => {
      const title = book.querySelector('span:nth-child(2)').textContent;
      const author = book.querySelector('.author-text').textContent;
      console.log(`Title: ${title}, Author: ${author}`);
    });
}

function addTask() {
    const bookTitle = inputTitle.value.trim();
    const authorName = inputAuthor.value.trim();
    if (bookTitle && authorName) {
        const bookItem = addBookItem(bookTitle, authorName);
        bookList.appendChild(bookItem);
        inputTitle.value = '';
        inputAuthor.value = '';
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

    return li;
}