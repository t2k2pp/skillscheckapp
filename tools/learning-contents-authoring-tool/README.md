# Learning Contents Authoring Tool

This is a web-based authoring tool for creating and managing learning content (quizzes, flashcards, etc.).

It provides a user-friendly interface to edit the JSON-based question sets located in the `/public/question-sets` directory of the main application.

## Features

- List and manage all available question sets.
- Create, edit, and delete question sets.
- Edit quiz metadata and individual questions.
- Upload and manage thumbnail images for question sets.

## Setup and Usage

1.  **Navigate to the tool's directory:**
    ```sh
    cd tools/learning-contents-authoring-tool
    ```

2.  **Install dependencies:**
    This will install the dependencies for both the frontend application and the backend server.
    ```sh
    npm install
    ```

3.  **Run the development servers:**
    You will need to open **two separate terminals** in this directory.

    -   **In Terminal 1,** start the backend server:
        ```sh
        npm run server
        ```
        You should see a message like `Authoring tool backend listening at http://localhost:3001`.

    -   **In Terminal 2,** start the frontend server:
        ```sh
        npm start
        ```
        This will open the application in your browser, usually at `http://localhost:5173` or a similar address.

4.  **Open the application:**
    If it doesn't open automatically, navigate to the URL provided by the `npm start` command (e.g., `http://localhost:5173`).

## Configuration

The path to the learning contents directory (`question-sets`) can be configured in the `config.json` file.

By default, it uses a relative path:
```json
{
  "questionSetPath": "../../public/question-sets"
}
```

If you move the `public` directory or the tool itself, you can update this path to point to the correct location relative to the `server.cjs` file.
