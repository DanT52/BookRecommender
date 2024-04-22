class BookService {
    async fetchRecommendations(booksToBaseRecommendationOn, booksToNotRecommend) {
        try {
            const response = await fetch('https://bookrecommender-o3nk.onrender.com/recommendations', {
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

