# Math Balloon Game

This is a simple math game where you pop balloons that correctly answer arithmetic questions. The project has been refactored to use TypeScript for the game logic.

## Technologies Used

- HTML5
- CSS3
- TypeScript
- Node.js (for the build process)

## Project Structure

- \`index.html\`: The main HTML file (located in the project root).
- \`style.css\`: Contains all the styles for the game (located in the project root).
- \`src/\`: Contains the TypeScript source code.
  - \`src/game.ts\`: The core game logic.
- \`dist/\`: Contains the compiled JavaScript output.
  - \`dist/game.js\`: The compiled JavaScript file, linked by \`index.html\`.
- \`package.json\`: Defines project dependencies and scripts.
- \`tsconfig.json\`: Configuration for the TypeScript compiler.

## Setup and Running the Game

1.  **Clone the repository (if you haven't already):**
    \`\`\`bash
    git clone <repository-url>
    cd <repository-directory>
    \`\`\`

2.  **Install dependencies:**
    This will install TypeScript and other necessary development tools.
    \`\`\`bash
    npm install
    \`\`\`

3.  **Build the project:**
    This will compile the TypeScript code in \`src/\` and output the JavaScript file to \`dist/\`.
    \`\`\`bash
    npm run build
    \`\`\`

4.  **Run the game:**
    Open the \`index.html\` file in your web browser.
    \`\`\`
    # On macOS
    open index.html

    # On Windows
    start index.html

    # On Linux
    xdg-open index.html
    \`\`\`
    Alternatively, you can usually just double-click the \`index.html\` file in your file explorer.

## Development

If you make changes to the TypeScript code in \`src/game.ts\`, you will need to rebuild the project using \`npm run build\` to see your changes reflected in the game.
