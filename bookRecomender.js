require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

async function recommendBooks(booksToBaseRecommendationOn, booksToNotRecommend, numberOfBooksToRecommend) {
  try {
    

    const prompt = `Recommend ${numberOfBooksToRecommend} books based on these books: ${booksToBaseRecommendationOn}` +
        (booksToNotRecommend && booksToNotRecommend.length > 0 ? `. Do not include the following books (they may have been already recommended to the user): ${booksToNotRecommend}` : '') +
        `. Please list each recommended book in a list following this format [{title: 'book1', author: 'author1'}, ...] i need your response to basically just be a json object only in a single line.`;


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
