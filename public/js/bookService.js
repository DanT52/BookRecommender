class BookService {
    async postBook(bookData) {
        try {
            const response = await fetch('/add-book', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async fetchMyBooks() {
        console.log("fetching books...");
        try {
            const response = await fetch('/my-books', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const books = await response.json();
            console.log('Fetched Books:', books);
            return books; // return books to handle them in the caller
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    async deleteBook(bookData) {
        try {
            const response = await fetch('/delete-book', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            console.log('Delete result:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async fetchRecommendations(booksToBaseRecommendationOn, booksToNotRecommend) {
        try {
            const response = await fetch('/recommendations', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booksToBaseRecommendationOn, booksToNotRecommend })
            });
            if (!response.ok) throw new Error('Network response was not ok');

            const recommendations = await JSON.parse(await response.json())


            console.log('Recommendations:', recommendations);
            return recommendations;
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

