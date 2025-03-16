

document.addEventListener("DOMContentLoaded", function () {
  // duplicate line function
  function duplicateLine(cm) {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    cm.replaceRange(line + "\n", { line: cursor.line + 1, ch: 0 });
    cm.setCursor(cursor.line + 1, line.length);
  }

  // HTML Editor
  const htmlEditor = CodeMirror(document.getElementById("html-code"), {
    mode: "text/html",
    lineNumbers: true,
    lineWrapping: true,
    theme: "material",
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    lint: true,
    gutters: ["CodeMirror-lint-markers"],
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-D": duplicateLine, // duplicate line
      "Ctrl-F": function (cm) {
        //find
        const query = prompt("Find:");
        if (query) {
          const cursor = cm.getSearchCursor(query);
          if (cursor.findNext()) {
            cm.setSelection(cursor.from(), cursor.to());
            cm.scrollIntoView(cursor.from());
          } else {
            alert("No matches found.");
          }
        }
      },
    },
    hintOptions: {
      hint: customHtmlHint,
      completeSingle: false,
    },
  });

  // CSS Editor
  const cssEditor = CodeMirror(document.getElementById("css-code"), {
    mode: "text/css",
    lineNumbers: true,
    lineWrapping: true,
    theme: "material",
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    lint: true,
    gutters: ["CodeMirror-lint-markers"],
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-D": duplicateLine, // duplicate line function
    },
    hintOptions: { hint: customCssHint },
  });

  // JavaScript Editor
  const jsEditor = CodeMirror(document.getElementById("js-code"), {
    mode: "text/javascript",
    lineNumbers: true,
    lineWrapping: true,
    theme: "material",
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    lint: true,
    gutters: ["CodeMirror-lint-markers"],
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-D": duplicateLine, //duplicate line function
    },
    hintOptions: { hint: customJsHint },
  });

  /* 
    // HTML Hint function 
    function customHtmlHint(editor) {
        const keywords = [
            "div", "span", "p", "a", "img", "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "form", "input", "button", "label", "script", "style"
        ];
        return CodeMirror.hint.anyword(editor, { words: keywords });
    }

    // CSS Hint function
    function customCssHint(editor) {
        const properties = [
            "color", "background-color", "margin", "padding", "border",
            "font-size", "display", "flex", "grid", "width", "height", "position"
        ];
        return CodeMirror.hint.anyword(editor, { words: properties });
    }

    // JavaScript Hint function
    function customJsHint(editor) {
        const jsKeywords = [
            "function", "return", "if", "else", "for", "while",
            "var", "let", "const", "console", "log", "document",
            "getElementById", "addEventListener"
        ];
        return CodeMirror.hint.anyword(editor, { words: jsKeywords });
    } 
 */

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  function setupBracesCompletion(editor) {
    editor.on("inputRead", function (editor, change) {
      const cursor = editor.getCursor();
      if (change.text[0] === "{") {
        editor.replaceRange("}", cursor);
        editor.setCursor(cursor.line, cursor.ch - 1);
      } /* else if (change.text[0] === "(") {
                editor.replaceRange(")", cursor);
                editor.setCursor(cursor.line, cursor.ch - 1);
            } */ else if (change.text[0] === "[") {
        editor.replaceRange("]", cursor);
        editor.setCursor(cursor.line, cursor.ch - 1);
      }
    });
  }

  setupBracesCompletion(cssEditor);
  setupBracesCompletion(jsEditor);

  jsEditor.on("inputRead", function (editor, change) {
    const cursor = editor.getCursor();
    const currentLine = editor.getLine(cursor.line);
    const wordBeforeCursor = currentLine.slice(0, cursor.ch).trim();

    if (change.text[0] === "{") {
      editor.replaceRange("}", cursor);
      editor.setCursor(cursor.line, cursor.ch - 1);
    } else if (change.text[0] === "(") {
      editor.replaceRange(")", cursor);
      editor.setCursor(cursor.line, cursor.ch - 1);
    } else if (change.text[0] === "[") {
      editor.replaceRange("]", cursor);
      editor.setCursor(cursor.line, cursor.ch - 1);
    }

    if (
      change.text[0] === "" &&
      change.from.ch > 0 &&
      change.from.line === cursor.line
    ) {
      const words = wordBeforeCursor.split(" ");
      if (words[words.length - 1] === "function" && change.origin === "enter") {
        const functionTemplate = "function myFunction() {\n    \n}";
        editor.replaceRange(functionTemplate, cursor);
        editor.setCursor(cursor.line + 1, 4);
        change.preventDefault();
      }
    }
  });

  const jsErrorMessages = document.getElementById("js-error-messages");
  const cssErrorMessages = document.getElementById("css-error-messages");
  const htmlErrorMessages = document.getElementById("html-error-messages");

  let accumulatedErrors = []; // Array to store error messages

  function resetErrorDisplays() {
    jsErrorMessages.innerHTML = "";
    cssErrorMessages.innerHTML = "";
    htmlErrorMessages.innerHTML = "";
    jsErrorMessages.style.display = "none";
    cssErrorMessages.style.display = "none";
    htmlErrorMessages.style.display = "none";
    document.getElementById("js-error-icon").style.display = "none";
    document.getElementById("css-error-icon").style.display = "none";
    document.getElementById("html-error-icon").style.display = "none";
    accumulatedErrors = [];
  }

  function resetLineStyles(editor) {
    const lineCount = editor.lineCount();
    for (let i = 0; i < lineCount; i++) {
      editor.removeLineClass(i, "background", "error");
    }
  }

  function validateHtml(html) {
    const errors = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const openTags = [];
    const selfClosingTags = [
      "br",
      "img",
      "input",
      "hr",
      "meta",
      "link",
      "source",
      "track",
      "wbr",
    ];

    Array.from(doc.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.nodeName.toLowerCase();
        openTags.push(tagName);
        if (
          !selfClosingTags.includes(tagName) &&
          !html.includes(`</${tagName}>`)
        ) {
          errors.push({ line: 1, message: `Unclosed tag: <${tagName}>` });
        }
      }
    });

    /*  const unclosedTags = openTags.filter(tag => !selfClosingTags.includes(tag) && !html.includes(`</${tag}>`));
        unclosedTags.forEach(tag => {
            errors.push({ line: 1, message: `Unclosed tag: <${tag}>` });
        }); */

    const invalidNesting = [
      { parent: "div", child: "p" },
      { parent: "ul", child: "li" },
    ];

    for (const rule of invalidNesting) {
      if (openTags.includes(rule.child) && !openTags.includes(rule.parent)) {
        errors.push({
          line: 1,
          message: `Invalid nesting: <${rule.child}> inside <${rule.parent}>`,
        });
      }
    }

    return errors;
  }

  function validateCss(css) {
    const errors = [];
    const lines = css.split("\n");
    const validProperties = [
      "align-content",
      "align-items",
      "align-self",
      "animation",
      "background",
      "background-color",
      "background-image",
      "border",
      "border-radius",
      "border-color",
      "border-style",
      "border-width",
      "box-shadow",
      "color",
      "display",
      "flex",
      "flex-direction",
      "flex-wrap",
      "font",
      "font-size",
      "font-weight",
      "grid",
      "grid-template-columns",
      "grid-template-rows",
      "height",
      "margin",
      "padding",
      "position",
      "text-align",
      "text-decoration",
      "width",
      "z-index",
      "opacity",
      "overflow",
      "visibility",
      "transition",
      "transform",
      "white-space",
      "line-height",
      "letter-spacing",
      "word-spacing",
      "background-size",
      "background-repeat",
      "border-collapse",
      "border-spacing",
      "list-style",
      "outline",
      "overflow-x",
      "overflow-y",
      "text-transform",
      "vertical-align",
      "text-shadow",
      "filter",
      "cursor",
      "pointer-events",
      "clip",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
      "object-fit",
      "object-position",
      "resize",
      "text-overflow",
      "box-sizing",
      "font-family",
      "margin-bottom",
      "justify-content",
      "margin-top",
    ];

    const cssPropertyValueRegex = /^[a-zA-Z-]+:\s*[^;]+;$/;

    let inBlock = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.endsWith("{")) {
        inBlock = true;
        return;
      } else if (trimmedLine === "}") {
        inBlock = false;
        return;
      }

      if (inBlock) {
        if (trimmedLine) {
          if (!cssPropertyValueRegex.test(trimmedLine)) {
            errors.push({
              line: index + 1,
              message: "Invalid CSS syntax: Must be 'property: value;' format.",
            });
          } else {
            const [property] = trimmedLine.split(":");
            const trimmedProperty = property.trim();

            if (!validProperties.includes(trimmedProperty)) {
              errors.push({
                line: index + 1,
                message: `Invalid CSS property: ${trimmedProperty}`,
              });
            }
          }
        }
      } /*  else if (trimmedLine) {
                errors.push({
                    line: index + 1,
                    message: "CSS properties should be inside a rule block.",
                });
            } */
    });

    return errors;
  }

  function validateJavaScript(js) {
    const errors = [];
    const lines = js.split("\n");
    let openBraces = 0;
    let openParens = 0;
    let openBrackets = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) return;

      openBraces += (trimmedLine.match(/{/g) || []).length;
      openBraces -= (trimmedLine.match(/}/g) || []).length;
      openParens += (trimmedLine.match(/\(/g) || []).length;
      openParens -= (trimmedLine.match(/\)/g) || []).length;
      openBrackets += (trimmedLine.match(/\[/g) || []).length;
      openBrackets -= (trimmedLine.match(/]/g) || []).length;

      if (openBraces < 0 || openParens < 0 || openBrackets < 0) {
        errors.push({
          line: index + 1,
          message: "Unmatched parentheses or braces.",
        });
      }
    });

    if (openBraces > 0) {
      errors.push({ line: lines.length, message: "Unmatched opening braces." });
    }
    if (openParens > 0) {
      errors.push({
        line: lines.length,
        message: "Unmatched opening parentheses.",
      });
    }
    if (openBrackets > 0) {
      errors.push({
        line: lines.length,
        message: "Unmatched opening brackets.",
      });
    }

    return errors;
  }

  function displayErrorIcons(htmlErrors, cssErrors, jsErrors) {
    document.getElementById("html-error-icon").style.display =
      htmlErrors.length > 0 ? "inline" : "none";
    document.getElementById("css-error-icon").style.display =
      cssErrors.length > 0 ? "inline" : "none";
    document.getElementById("js-error-icon").style.display =
      jsErrors.length > 0 ? "inline" : "none";

    if (htmlErrors.length > 0) {
      htmlErrors.forEach((err) => {
        accumulatedErrors.push(
          `HTML Error on line ${err.line}: ${err.message}`
        );
      });
    }
    if (cssErrors.length > 0) {
      cssErrors.forEach((err) => {
        accumulatedErrors.push(`CSS Error on line ${err.line}: ${err.message}`);
      });
    }
    if (jsErrors.length > 0) {
      jsErrors.forEach((err) => {
        accumulatedErrors.push(
          `JavaScript Error on line ${err.line}: ${err.message}`
        );
      });
    }
  }

  document
    .getElementById("speak-errors")
    .addEventListener("click", function () {
      const htmlErrors = htmlErrorMessages.innerHTML.trim();
      const cssErrors = cssErrorMessages.innerHTML.trim();
      const jsErrors = jsErrorMessages.innerHTML.trim();

      let messages = [];

      if (htmlErrors) {
        messages.push(`HTML Errors: ${htmlErrors}`);
      }
      if (cssErrors) {
        messages.push(`CSS Errors: ${cssErrors}`);
      }
      if (jsErrors) {
        messages.push(`JavaScript Errors: ${jsErrors}`);
      }

      if (messages.length > 0) {
        speak(messages.join(". "));
      } else {
        speak("No errors to report.");
      }
    });

  window.run = function () {
    let output = document.getElementById("output");
    let htmlCode = htmlEditor.getValue();
    let cssCode = cssEditor.getValue();
    let jsCode = jsEditor.getValue();
    resetErrorDisplays();

    resetLineStyles(htmlEditor);
    resetLineStyles(cssEditor);
    resetLineStyles(jsEditor);

    const htmlErrors = validateHtml(htmlCode);
    const jsErrors = validateJavaScript(jsCode);
    const cssErrors = validateCss(cssCode);

    if (htmlErrors.length > 0) {
      htmlErrors.forEach(({ line, message }) => {
        htmlEditor.addLineClass(line - 1, "line-error", "error");
        htmlErrorMessages.innerHTML += `HTML Error on line ${line}: ${message}<br>`;
      });
    }

    if (jsErrors.length > 0) {
      jsErrors.forEach(({ line, message }) => {
        jsEditor.addLineClass(line - 1, "line-error", "error");
        jsErrorMessages.innerHTML += `${message}<br>`;
      });
    }

    if (cssErrors.length > 0) {
      cssErrors.forEach(({ line, message }) => {
        cssEditor.addLineClass(line - 1, "line-error", "error");
        cssErrorMessages.innerHTML += `CSS Error on line ${line}: ${message}<br>`;
      });
    }

    displayErrorIcons(htmlErrors, cssErrors, jsErrors);

    // Stop speaking if there are no errors
    if (
      htmlErrors.length === 0 &&
      cssErrors.length === 0 &&
      jsErrors.length === 0
    ) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      try {
        output.contentDocument.open();
        output.contentDocument.write(
          `<html>
                        <head>
                          <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                            body {
                                color: #1f1f1f;
                                background-color: white;
                            }
                            ${cssCode}
                            </style>
                        </head>
                        <body>
                            ${htmlCode}
                            <script>${jsCode}<\/script>
                        </body>
                    </html>`
        );
        output.contentDocument.close();
        /*  speak("Code executed successfully!"); */
      } catch (error) {
        jsErrorMessages.innerHTML = `Runtime Error: ${error.message}`;
        document.getElementById("js-error-icon").style.display = "inline";
        speak(`Runtime Error: ${error.message}`);
      }
    }
  };
  function customHtmlHint(editor) {
    const keywords = [
      "div",
      "span",
      "p",
      "a",
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "form",
      "input",
      "button",
      "label",
      "script",
      "style",
    ];
    return CodeMirror.hint.anyword(editor, { words: keywords });
  }

  function customCssHint(editor) {
    const properties = [
      "color",
      "background-color",
      "margin",
      "padding",
      "border",
      "font-size",
      "display",
      "flex",
      "grid",
      "width",
      "height",
      "position",
    ];
    return CodeMirror.hint.anyword(editor, { words: properties });
  }

  function customJsHint(editor) {
    const jsKeywords = [
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "var",
      "let",
      "const",
      "console",
      "log",
      "document",
      "getElementById",
      "addEventListener",
    ];
    return CodeMirror.hint.anyword(editor, { words: jsKeywords });
  }

  document
    .getElementById("html-error-icon")
    .addEventListener("click", function () {
      htmlErrorMessages.style.display =
        htmlErrorMessages.style.display === "none" ||
        htmlErrorMessages.style.display === ""
          ? "block"
          : "none";
    });

  document
    .getElementById("css-error-icon")
    .addEventListener("click", function () {
      cssErrorMessages.style.display =
        cssErrorMessages.style.display === "none" ||
        cssErrorMessages.style.display === ""
          ? "block"
          : "none";
    });

  document
    .getElementById("js-error-icon")
    .addEventListener("click", function () {
      jsErrorMessages.style.display =
        jsErrorMessages.style.display === "none" ||
        jsErrorMessages.style.display === ""
          ? "block"
          : "none";
    });

  function displayErrorIcons(htmlErrors, cssErrors, jsErrors) {
    // error emojis
    document.getElementById("html-error-icon").style.display =
      htmlErrors.length > 0 ? "inline" : "none";
    document.getElementById("css-error-icon").style.display =
      cssErrors.length > 0 ? "inline" : "none";
    document.getElementById("js-error-icon").style.display =
      jsErrors.length > 0 ? "inline" : "none";
  }
});

