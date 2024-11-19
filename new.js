const startButton = document.getElementById("start-button");
const codeEditor = document.getElementById("code-editor");

// Check if the browser supports the Web Speech API
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.continuous = true; // Keep recognizing until stopped
  recognition.interimResults = true; // Show interim results

  // Custom command to code snippet mapping
  const commandMap = {
    "create a function": `function myFunction() {\n    // Your code here\n}`,
    "create a for loop": `for (let i = 0; i < 10; i++) {\n    // Loop code here\n}`,
    "create an if statement": `if (condition) {\n    // Your code here\n}`,
    "create a variable": `let myVariable = value;`,
    "create a variable called ": (name) => `let ${name} = value;`,
    // Add more custom commands as needed
  };

  // Start voice recognition when the button is clicked
  startButton.addEventListener("click", () => {
    recognition.start();
  });

  // Handle the result
  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript.toLowerCase();
      if (event.results[i].isFinal) {
        let matched = false;
        // Check for dynamic commands
        for (const command in commandMap) {
          if (transcript.startsWith(command)) {
            const remainder = transcript.replace(command, "").trim();
            const snippet =
              typeof commandMap[command] === "function"
                ? commandMap[command](remainder)
                : commandMap[command];
            codeEditor.value += snippet + "\n";
            matched = true;
            break;
          }
        }
        if (!matched) {
          codeEditor.value += transcript;
        }
      }
    }
  };

  // Provide feedback when recognition ends or encounters an error
  recognition.onend = () => {
    console.log("Recognition ended.");
  };

  recognition.onerror = (event) => {
    console.error("Recognition error: ", event.error);
  };
} else {
  alert("Your browser does not support the Web Speech API.");
}

// Example: "create a variable called x"
const commandMap = {
  "create a function": `function myFunction() {
    // Your code here
}`,
  "create a variable called ": (name) => `let ${name} = value;`,
};

recognition.onresult = (event) => {
  let transcript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript.toLowerCase();
    if (event.results[i].isFinal) {
      // Check for dynamic commands
      for (const command in commandMap) {
        if (transcript.startsWith(command)) {
          const remainder = transcript.replace(command, "").trim();
          const snippet =
            typeof commandMap[command] === "function"
              ? commandMap[command](remainder)
              : commandMap[command];
          codeEditor.value += snippet + "\n";
          return;
        }
      }
      // Default behavior: just add the text
      codeEditor.value += transcript;
    }
  }
};

recognition.onresult = (event) => {
  let transcript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript.toLowerCase();
    if (event.results[i].isFinal) {
      let matched = false;
      // Check for dynamic commands
      for (const command in commandMap) {
        if (transcript.startsWith(command)) {
          const remainder = transcript.replace(command, "").trim();
          const snippet =
            typeof commandMap[command] === "function"
              ? commandMap[command](remainder)
              : commandMap[command];
          codeEditor.value += snippet + "\n";
          matched = true;
          break;
        }
      }
      if (!matched) {
        codeEditor.value += transcript;
      }
    }
  }
};

// Provide feedback when recognition ends or encounters an error
recognition.onend = () => {
  console.log("Recognition ended.");
};

recognition.onerror = (event) => {
  console.error("Recognition error: ", event.error);
};



