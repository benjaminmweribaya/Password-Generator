# Password Generator

## Overview
The **Password Generator** is a simple web application that generates strong and secure passwords based on user preferences. It features a password strength indicator with a visual progress bar, a password visibility toggle, and the ability to exclude similar characters for better readability.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Styling:** CSS for layout and animations
- **Logic Implementation:** JavaScript for password generation and strength evaluation

## Features
### 1. **Customizable Password Generation**
Users can specify:
- Password length (default: 12 characters)
- Inclusion of uppercase letters
- Inclusion of numbers
- Inclusion of special characters
- Exclusion of similar characters (e.g., `I`, `l`, `1`, `O`, `0`)

### 2. **Password Strength Indicator**
- Uses a scoring system to evaluate password strength based on length and complexity.
- Displays a visual progress bar with color-coded indicators:
  - **Red (Weak)**
  - **Orange (Fair)**
  - **Yellow (Good)**
  - **Light Green (Strong)**
  - **Green (Very Strong)**

### 3. **Password Visibility Toggle**
- By default, the password is hidden (`type="password"`).
- Users can toggle visibility using a button (👁 → 🙈).

### 4. **Copy to Clipboard Feature**
- Users can copy the generated password to the clipboard with a single button click.

## File Structure
```
password-generator/
│── index.html       # Main UI structure
│── styles.css       # Styling for UI components
│── script.js        # Core JavaScript logic
│── README.md        # Documentation (this file)
```

## Setup & Installation
### **1. Clone the Repository**
```sh
git clone https://github.com/benjaminmweribaya/password-generator.git
cd password-generator
```

### **2. Open in a Browser**
Simply open `index.html` in any modern web browser.

## How to Use
1. Select your desired password length.
2. Choose which character types to include.
3. Click **Generate Password**.
4. View the **password strength indicator**.
5. Use the **visibility toggle** to view/hide the password.
6. Click **Copy** to save the password to the clipboard.

## Password Strength Logic
The strength is calculated based on the following:
- **1 point** for at least 8 characters
- **1 point** for at least 12 characters
- **1 point** for uppercase letters
- **1 point** for numbers
- **1 point** for special characters

| Strength Level | Score |
|---------------|-------|
| Weak          | 0-1   |
| Fair          | 2     |
| Good         | 3     |
| Strong       | 4     |
| Very Strong  | 5     |

## Future Improvements
- Save generated passwords locally for easy retrieval.
- Allow batch generation of multiple passwords.
- Dark mode toggle for better accessibility.
- Integration with a password manager API.

## License
This project is licensed under the MIT License.

## Author
Developed by [Benjamin Baya](https://github.com/benjaminmweribaya).

