const inputTitle = document.getElementById('input-title');
const inputAuthor = document.getElementById('input-author');
const addBookBtn = document.getElementById('add-book');
const bookList = document.getElementById('book-list');

addBookBtn.addEventListener('click', addTask);

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
        event.preventDefault(); 
    }
}

inputTitle.addEventListener('keypress', handleKeyPress);
inputAuthor.addEventListener('keypress', handleKeyPress);
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

    titleSpan.textContent = title;
    authorSpan.textContent = ` by ${author}`;
    deleteBtn.textContent = 'Delete';
    authorSpan.classList.add('author-text');

    deleteBtn.addEventListener('click', () => {
        bookList.removeChild(li);
    });

    titleSpan.addEventListener('click', () => {
        li.classList.toggle('done');
    });

    li.appendChild(titleSpan);
    li.appendChild(authorSpan);
    li.appendChild(deleteBtn);

    return li;
}