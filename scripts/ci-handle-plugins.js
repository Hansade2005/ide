/**
 * CI Plugin Handler
 * This script handles plugin downloads for CI environments where local plugins aren't available
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create plugins directory if it doesn't exist
const pluginsDir = path.resolve(__dirname, '../plugins');
if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
    console.log('Created plugins directory');
}

// Read the package.json to get plugin information
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

// Create a modified package.json for CI without local plugins
const ciPackageJson = { ...packageJson };

// Filter out local plugins
if (ciPackageJson.theiaPlugins) {
    const originalPlugins = { ...ciPackageJson.theiaPlugins };
    ciPackageJson.theiaPlugins = {};
    
    for (const [pluginId, pluginUrl] of Object.entries(originalPlugins)) {
        if (!pluginUrl.startsWith('local:')) {
            ciPackageJson.theiaPlugins[pluginId] = pluginUrl;
            console.log(`Keeping remote plugin: ${pluginId} -> ${pluginUrl}`);
        } else {
            console.log(`Skipping local plugin: ${pluginId} -> ${pluginUrl}`);
        }
    }
}

// Write the modified package.json to a temporary file
const ciPackageJsonPath = path.resolve(__dirname, '../package.json.ci');
fs.writeFileSync(ciPackageJsonPath, JSON.stringify(ciPackageJson, null, 2));

try {
    // Run the plugin download command with the modified package.json
    console.log('Downloading remote plugins...');
    execSync(`yarn theia download:plugins --rate-limit=5 --parallel=false`, {
        env: { ...process.env, THEIA_PACKAGE_JSON: ciPackageJsonPath },
        stdio: 'inherit'
    });
    console.log('Plugin download completed successfully');
} catch (error) {
    console.error('Error downloading plugins:', error.message);
    // Continue anyway
    process.exit(0);
} finally {
    // Remove temporary package.json
    fs.unlinkSync(ciPackageJsonPath);
} 