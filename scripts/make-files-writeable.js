/**
 * A simple script to make files writeable.
 * This helps with CI environments and plugins that need write permissions.
 * JavaScript version for Windows compatibility.
 */
const fs = require('fs');
const path = require('path');

// Get the directory from the command line arguments
const directory = process.argv[2] || 'plugins';

const dirPath = path.resolve(process.cwd(), directory);

// Check if directory exists
if (!fs.existsSync(dirPath)) {
    console.warn(`Directory ${dirPath} does not exist. Creating it.`);
    fs.mkdirSync(dirPath, { recursive: true });
}

// Function to recursively make files writeable
function makeWriteable(dir) {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(dir, entry.name);
            
            try {
                // Make the file writeable (add user write permission)
                const currentMode = fs.statSync(entryPath).mode;
                // Add write permission (0o200 in octal)
                fs.chmodSync(entryPath, currentMode | 0o200);
                
                if (entry.isDirectory()) {
                    makeWriteable(entryPath);
                }
            } catch (err) {
                console.warn(`Error changing permissions for ${entryPath}: ${err.message}`);
                // Continue despite errors
            }
        }
    } catch (error) {
        console.warn(`Error processing directory ${dir}: ${error.message}`);
        // Continue despite errors
    }
}

console.log(`Making files in ${dirPath} writeable...`);
makeWriteable(dirPath);
console.log('Done making files writeable'); 