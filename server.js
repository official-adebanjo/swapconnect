const path = require("path");

const currentDir = __dirname;
const appDir = path.join(currentDir, "apps", "frontend");

// Set the working directory to the app directory so Next.js finds the .next folder
process.chdir(appDir);

// Require the actual server.js file
require("./server.js");
