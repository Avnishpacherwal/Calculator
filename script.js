// Get DOM(Document Object Model) elements
let input = document.getElementById('InputBox');
let buttons = document.querySelectorAll('button');
let historyBox = document.getElementById('history');

// Initialize input string
let string = "";

/**
 * Updates the input box and cursor position
 * @param {number|null} cursorPos - Position to place the cursor
 */

function updateInput(cursorPos = null) {
    input.value = string;
    input.focus();

    if (cursorPos !== null && input.selectionStart === input.selectionEnd) {
        input.setSelectionRange(cursorPos, cursorPos);
    }

    input.scrollLeft = input.scrollWidth;
}

/**
 * Inserts a value at the current cursor position
 * @param {string} value - The value to insert
 */

function insertAtCursor(value) {
    let start = input.selectionStart;
    let end = input.selectionEnd;

    string = string.slice(0, start) + value + string.slice(end);
    updateInput(start + value.length);
}

/**
 * Deletes the selected text or one character before the cursor
 */

function deleteAtCursor() {
    let start = input.selectionStart;
    let end = input.selectionEnd;

    if (start !== end) {
        string = string.slice(0, start) + string.slice(end);
        updateInput(start);
    } else if (start > 0) {
        string = string.slice(0, start - 1) + string.slice(start);
        updateInput(start - 1);
    }
}

/**
 * Deletes one character forward from the cursor or selection
 */

function deleteForward() {
    let start = input.selectionStart;
    let end = input.selectionEnd;

    if (start !== end) {
        string = string.slice(0, start) + string.slice(end);
        updateInput(start);
    } else if (start < string.length) {
        string = string.slice(0, start) + string.slice(start + 1);
        updateInput(start);
    }
}

// Handle button clicking
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.innerText;

        if (value === '=') {
            try {
                historyBox.innerText = string + " =";
                let result = eval(string);

                // Handle invalid results
                if (result === Infinity || isNaN(result)) {
                    string = "Math Error";
                } else {
                    string = result.toString();
                }

                updateInput(string.length);
            } catch {
                // Catches any evaluation errors
                string = "Math Error";
                updateInput(string.length);
            }
        } else if (value === 'AC') {
            // Clear all
            string = "";
            historyBox.innerText = "";
            updateInput(0);
        } else if (value === 'DEL') {
            // Backspace
            deleteAtCursor();
        } else {
            // Insert number/operator
            insertAtCursor(value);
        }
    });
});

// Handle keyboard input
input.addEventListener("keydown", function (e) {
    const key = e.key;

    // Allow copy/paste/undo
    if (e.ctrlKey && ["a", "c", "v", "x", "z", "y"].includes(key.toLowerCase())) {
        return;
    }

    if (key === "Enter" || key === "=") {
        document.querySelector(".EqlBtn").click();
        e.preventDefault();
    } else if (key === "Backspace" || key === "Escape") {
        // Delete backward
        deleteAtCursor();
        e.preventDefault();
    } else if (key === "Delete") {
        // Delete forward
        deleteForward();
        e.preventDefault();
    } else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
        // Allow arrow key navigation
    } else if (["+", "-", "*", "/", "%", "."].includes(key) || (key >= "0" && key <= "9")) {
        // Insert character at cursor
        insertAtCursor(key);
        e.preventDefault();
    } else {
        // Prevent invalid keys
        e.preventDefault();
    }
});
