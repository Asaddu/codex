import bot from './assets/bot.svg';
import user from './assets/user.svg';

const languageSelector = document.querySelector('#language');
const lessonSelector = document.querySelector('#lesson-selector');
const chatContainer = document.querySelector('#chat-container');
const lessonContainer = document.querySelector('#lesson-container');
const chatApp = document.querySelector('#chat-app');
const form = document.querySelector('form');

const lessonsEn = [
  {
    title: "Hello, World!",
    prerequisites: "Install an IDE or code editor of your choice",
    introduction: "In this lesson, you will learn how to write your first JavaScript program",
    lesson: `console.log("Hello, World!");`,
    exercise: "Write a program that outputs your name"
  },
  {
    title: "Simple Calculator",
    prerequisites: "Basic knowledge of JavaScript variables and arithmetic operators",
    introduction: "In this lesson, you will learn how to write a simple calculator program in JavaScript",
    lesson: `
    const num1 = 5;
    const num2 = 10;

    console.log(num1 + num2);
    console.log(num1 - num2);
    console.log(num1 * num2);
    console.log(num1 / num2);
    `,
    exercise: "Write a program that allows the user to input two numbers and perform addition, subtraction, multiplication, and division"
  },
  {
    title: "Guess the Number",
    prerequisites: "Basic knowledge of JavaScript variables and conditional statements",
    introduction: "In this lesson, you will learn how to write a simple guessing game in JavaScript",
    lesson: `
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const guess = prompt("Guess a number between 1 and 10:");
  
    if (guess == randomNumber) {
      console.log("You guessed it right!");
    } else {
      console.log("Wrong guess. The correct number was " + randomNumber);
    }
    `,
    exercise: "Enhance the program to allow the user to have multiple attempts to guess the number"
  },
  {
    title: "Array Statistics",
    prerequisites: "Basic knowledge of JavaScript arrays and loop constructs",
    introduction: "In this lesson, you will learn how to find the minimum, maximum, and average of an array of numbers in JavaScript",
    lesson: `
    const numbers = [1, 2, 3, 4, 5];
  
    let min = numbers[0];
    let max = numbers[0];
    let sum = 0;
  
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] < min) {
        min = numbers[i];
      }
      if (numbers[i] > max) {
        max = numbers[i];
      }
      sum += numbers[i];
    }
  
    console.log("Minimum: " + min);
    console.log("Maximum: " + max);
    console.log("Average: " + sum / numbers.length);
    `,
    exercise: "Write a program that allows the user to input an array of numbers and outputs the minimum, maximum, and average"
  },
  {
    title: "Conway's Game of Life",
    prerequisites: "Basic knowledge of JavaScript functions and arrays",
    introduction: "In this lesson, you will learn how to write an implementation of Conway's Game of Life using JavaScript",
    lesson: `    const width = 50;    const height = 50;    let grid = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push(Math.round(Math.random()));
      }
      grid.push(row);
    }

    const getNeighbors = (grid, x, y) => {
      let neighbors = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          let row = (x + i + height) % height;
          let col = (y + j + width) % width;
          neighbors += grid[row][col];
        }
      }
      return neighbors;
    };

    const updateGrid = (grid) => {
      let newGrid = [];
      for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
          let neighbors = getNeighbors(grid, i, j);
          if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
            row.push(0);
          } else if (grid[i][j] === 0 && neighbors === 3) {
            row.push(1);
          } else {
            row.push(grid[i][j]);
          }
        }
        newGrid.push(row);
      }
      return newGrid;
    };

    console.log(grid);
    grid = updateGrid(grid);
    console.log(grid);
    `,
    exercise: "Write a program that displays the grid on the page and updates it every second using `setInterval`"
  }
];


let loadInterval;

// function to handle language selection
const handleLanguageSelect = (e) => {
  const selectedLanguage = e.target.value;
  switch (selectedLanguage) {
    case "en":
      // logic for English
      break;
    case "sin":
      // logic for Sinhala
      break;
  }
  lessonSelector.style.display = 'block';
}

languageSelector.addEventListener('change', handleLanguageSelect);

// function to handle lesson selection
const handleLessonSelect = (e) => {
  const selectedLesson = e.target.value;
  if (selectedLesson) {
    chatApp.style.display = 'block';
    lessonContainer.style.display = 'block';
    const selectedLessonObject = lessonsEn.find(lesson => lesson.title === selectedLesson);

    if (selectedLessonObject) {
      lessonContainer.innerHTML = `
        <h3>${selectedLessonObject.title}</h3>
        <p><strong>Prerequisites:</strong> ${selectedLessonObject.prerequisites}</p>
        <p><strong>Introduction:</strong> ${selectedLessonObject.introduction}</p>
        <pre><code>${selectedLessonObject.lesson}</code></pre>
        <p><strong>Exercise:</strong> ${selectedLessonObject.exercise}</p>
      `;
    }
  }
}




lessonSelector.addEventListener('change', handleLessonSelect);

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server -> bot's response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';
  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})