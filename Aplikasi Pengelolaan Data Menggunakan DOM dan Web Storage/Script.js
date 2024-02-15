document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('inputBook');
    const titleInput = document.getElementById('inputBookTitle');
    const authorInput = document.getElementById('inputBookAuthor');
    const yearInput = document.getElementById('inputBookYear');
    const inputCompleteCheckbox = document.getElementById('inputBookIsComplete');
    const unfinishedList = document.getElementById('incompleteBookshelfList');
    const finishedList = document.getElementById('completeBookshelfList');

    bookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    function addBook() {
        const title = titleInput.value;
        const author = authorInput.value;
        const year = parseInt(yearInput.value);
        const isComplete = inputCompleteCheckbox.checked;
        const book = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };
        const bookElement = createBookElement(book);
        if (isComplete) {
            finishedList.appendChild(bookElement);
        } else {
            unfinishedList.appendChild(bookElement);
        }
        updateLocalStorage();
        resetForm();
    }

    function createBookElement(book) {
        const book_item = document.createElement('article');
        book_item.classList.add('book_item');
        book_item.dataset.id = book.id;

        const title = document.createElement('h3');
        title.textContent = book.title;

        const author = document.createElement('p');
        author.textContent = `Penulis:${book.author}`;

        const year = document.createElement('p');
        year.textContent = `Tahun:${book.year}`;

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action');

        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.textContent = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        finishButton.addEventListener('click', function () {
            toggleBookStatus(book, book_item);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.textContent = 'Hapus buku';
        deleteButton.addEventListener('click', function () {
            deleteBook(book.id);
        });

        actionDiv.appendChild(finishButton);
        actionDiv.appendChild(deleteButton);
        book_item.appendChild(title);
        book_item.appendChild(title);
        book_item.appendChild(author);
        book_item.appendChild(year);
        book_item.appendChild(actionDiv);
        return book_item;
    }

    function deleteBook(bookId) {
        const bookElement = document.querySelector(`[data-id="${bookId}"]`);
        bookElement.parentElement.removeChild(bookElement);
        updateLocalStorage();
    }

    function toggleBookStatus(book, bookElement) {
        book.isComplete = !book.isComplete;
        bookElement.querySelector('.green').textContent = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
        if (book.isComplete) {
            finishedList.appendChild(bookElement);
        } else {
            unfinishedList.appendChild(bookElement);
        }
        updateLocalStorage();
    }

    function resetForm() {
        titleInput.value = '';
        authorInput.value = '';
        yearInput.value = '';
        inputCompleteCheckbox.checked = false;
    }

    function updateLocalStorage() {
        const unfinishedBooks = Array.from(unfinishedList.children).map(parseBookElement);
        const finishedBooks = Array.from(finishedList.children).map(parseBookElement);
        localStorage.setItem('unfinishedBooks', JSON.stringify(unfinishedBooks));
        localStorage.setItem('finishedBooks', JSON.stringify(finishedBooks));
    }

    function parseBookElement(bookElement) {
        const id = +bookElement.dataset.id;
        const title = bookElement.querySelector('h3').textContent;
        const author = bookElement.querySelector('p:nth-child(2)').textContent.substring(8);
        const year = parseInt(bookElement.querySelector('p:nth-child(3)').textContent.substring(6));
        const isComplete = bookElement.querySelector('.green').textContent === 'Belum selesai di Baca';
        return { id, title, author, year, isComplete };
    }

    function loadBooksFromLocalStorage() {
        const unfinishedBooks = JSON.parse(localStorage.getItem('unfinishedBooks')) || [];
        const finishedBooks = JSON.parse(localStorage.getItem('finishedBooks')) || [];
        unfinishedBooks.forEach(book => {
            const bookElement = createBookElement(book);
            unfinishedList.appendChild(bookElement);
        });

        finishedBooks.forEach(book => {
            const bookElement = createBookElement(book);
            finishedList.appendChild(bookElement);
        });
    }
    loadBooksFromLocalStorage();
});
