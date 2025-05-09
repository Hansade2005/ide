/********************************************************************************
 * Copyright (C) 2025 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

/**
 * A simple script to make files writeable.
 * This helps with CI environments and plugins that need write permissions.
 */
import * as fs from 'fs';
import * as path from 'path';

// Get the directory from the command line arguments
const directory = process.argv[2];

if (!directory) {
    console.error('Please provide a directory as an argument');
    process.exit(1);
}

const dirPath = path.resolve(process.cwd(), directory);

// Check if directory exists
if (!fs.existsSync(dirPath)) {
    console.warn(`Directory ${dirPath} does not exist. Creating it.`);
    fs.mkdirSync(dirPath, { recursive: true });
}

// Function to recursively make files writeable
function makeWriteable(dir: string): void {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(dir, entry.name);
            
            try {
                // Make the file writeable (add user write permission)
                fs.chmodSync(entryPath, fs.constants.S_IRUSR | fs.constants.S_IWUSR | fs.constants.S_IRGRP | fs.constants.S_IROTH);
                
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
