# BookRecommender

A web application designed to help users discover book recommendations based on books they input.

Live Application: [Book Recommender](https://bookrecommender-o3nk.onrender.com/).
note: may take up to 50 seconds to load (on render free teir only starts the app when there is activity)

## Features

- **Book List Management**: Easily add books to your personalized list.
- **Selection Highlighting**: Click on book entries to select them; selected entries will be highlighted in blue.
- **Get Recommendations**: Click on "Recommend!", receive three curated book recommendations.
- **Quick Search**: Use the "Search" button to look up detailed information about each recommendation on Google Books.
- **Clipboard Copy**: Clicking a recommendation entry automatically copies the title and author to your clipboard.
- **Clear Recommendations**: Remove all recommendations with the "Clear Recommendations" button.
- **Persistent Storage**: Books added to your Booklist are saved in local storage for quick access without login.
- **Cloud Storage with Login**: For a more permanent storage solution, logging in allows books to be saved to a MongoDB database using Mongoose.
- **Secure Authentication**: Google OAuth2 is used for a secure sign-in experience.

## Live Access

- **Express Server**: Hosted on render.com's free tier; please be patient with the initial load time, as it may be a bit slow.

## Local Development

To run the project locally, switch to the `forlocalhost` branch. Make sure you have a `.env` file at the root with the following keys set:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-uri
SESSION_SECRET=your-session-secret
OPEN_AI_API_KEY=your-openai-api-key
```

Replace `your-google-client-id`, `your-google-client-secret`, `your-mongodb-uri`, `your-session-secret`, and `your-openai-api-key` with your actual configuration values.

## Setup and Running Locally

1. Clone the repository and switch to the `forlocalhost` branch.
2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    npm start
    ```

4. Run the front end from localhost:3000

Remember to ensure that all the services and databases that the application depends on are accessible from your local setup.
