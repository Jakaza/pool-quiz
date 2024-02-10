# Pool-Quiz API / Web Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Description

Pool-Quiz API is a Pool of Questions Database that provides a collection of trivia questions for developers to integrate into their projects. 
It covers various categories and difficulty levels, making it a versatile resource for creating trivia games or adding trivia features to applications.
Users can also logg in and create their own questions where they can publish or make them private

## Table of Contents

- [Usage](#usage)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Usage

To use the Pool-Quiz API, you can make HTTP requests to the provided endpoints. The API returns JSON-formatted trivia questions that you can then use in your application.
Use of this API does not require a API Key, just generate the URL to use it in your own application to retrieve trivia questions.

<!--
```bash
# Example API request
curl https://pool-quiz.com/api?amount=10&type=multiple
```

## Endpoints

### GET `/api`

#### Parameters

- `amount` (optional): The number of questions to retrieve. Default is 1.
- `category` (optional): The category of the questions (e.g., General Knowledge, Science, IT). Default is any.
- `difficulty` (optional): The difficulty level of the questions (easy, medium, hard). Default is any.
- `type` (optional): The type of questions (multiple choice, true/false). Default is multiple choice.

#### Example

```bash
# Retrieve 5 General Knowledge questions of medium difficulty
curl https://pool-quiz/api?amount=5&category=9&difficulty=medium&type=multiple
```

## Installation - Coming Soon (Plan)

To integrate the Pool-Quiz API into your project, you can use any programming language that supports HTTP requests. Here's an example using JavaScript with the `fetch` function:

```javascript
// Example code
fetch('https://pool-quiz.com/api.php?amount=10&type=multiple')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching trivia questions:', error));
```
-->
## Contributing - Coming Soon (Plan)


## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

---
