require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

async function recommendBooks(booksToBaseRecommendationOn, booksToNotRecommend, numberOfBooksToRecommend) {
    // Format the booksToBaseRecommendationOn array into a string
  const formattedBooksToBase = booksToBaseRecommendationOn.map(book => `${book.title} by ${book.author}`).join(', ');

  // Format the booksToNotRecommend array into a string
  const formattedBooksToNotRecommend = booksToNotRecommend && booksToNotRecommend.length > 0 
    ? booksToNotRecommend.map(book => `${book.title} by ${book.author}`).join(', ')
    : null;

  // Create the prompt
  const prompt = `Recommend ${numberOfBooksToRecommend} books based on these books: ${formattedBooksToBase}` +
    (formattedBooksToNotRecommend ? `. Do not include the following books (they may have been already recommended to the user): ${formattedBooksToNotRecommend}` : '') +
    `. Please list each recommended book following this exact format [{"title": "book1", "author": "author1"}, {"title": "book2", "author": "author2"}...]. Your response needs to be valid JSON for a list of objects (double quotes on strings and keys), output in a single line.`;
    
  try {
    

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 256,
      top_p: 1,
    });

    const bookData = response.choices[0].message.content
    return bookData;

  } catch (err) {
    console.error('Error fetching recommendations:', err);
    throw err;
  }
}

module.exports = recommendBooks;
