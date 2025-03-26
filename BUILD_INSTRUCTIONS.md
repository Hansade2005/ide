# Building Our Custom Theia-Based IDE

This guide provides step-by-step instructions for building our custom IDE using Theia Blueprint as the base.

## Prerequisites

1. Install the following tools:
   ```bash
   # Node.js (v16 or later recommended)
   # Git
   # Yarn (preferred over npm)
   # Python (for node-gyp)
   # Visual Studio Build Tools (for Windows)
   ```

2. System Requirements:
   - Windows 10/11, macOS, or Linux
   - At least 8GB RAM
   - 20GB free disk space

## Step 1: Clone and Setup

```bash
# Clone Theia Blueprint repository
git clone https://github.com/eclipse-theia/theia-blueprint.git custom-ide

# Navigate to project directory
cd custom-ide

# Install dependencies
yarn
```

## Step 2: Configure the IDE

1. Update `package.json`:
   ```json
   {
     "name": "custom-african-ide",
     "productName": "Custom African IDE",
     "version": "1.0.0",
     "description": "Custom IDE for African Developers",
     "theia": {
       "frontend": {
         "config": {
           "applicationName": "Custom African IDE",
           "preferences": {
             "files.autoSave": "on"
           }
         }
       }
     }
   }
   ```

2. Configure branding in `electron-builder.yml`:
   ```yaml
   appId: com.custom.african.ide
   productName: Custom African IDE
   copyright: Copyright © 2024
   ```

## Step 3: Add Essential Extensions

1. Update `package.json` dependencies:
   ```json
   {
     "dependencies": {
       "@theia/core": "latest",
       "@theia/editor": "latest",
       "@theia/terminal": "latest",
       "@theia/navigator": "latest",
       "@theia/preferences": "latest",
       "@theia/git": "latest",
       "@theia/file-search": "latest",
       "@theia/markers": "latest",
       "@theia/preview": "latest",
       "@theia/callhierarchy": "latest",
       "@theia/outline-view": "latest",
       "@theia/plugin-ext-vscode": "latest",
       "@theia/search-in-workspace": "latest",
       "@theia/task": "latest"
     }
   }
   ```

## Step 4: Build the Application

```bash
# Build the application
yarn build

# Package the application
yarn package
```

## Step 5: Development Workflow

1. Start development server:
   ```bash
   yarn start
   ```

2. Watch for changes:
   ```bash
   yarn watch
   ```

3. Run tests:
   ```bash
   yarn test
   ```

## Step 6: Adding Custom Features

1. Create custom extension:
   ```bash
   yo theia-extension custom-feature
   ```

2. Implement features in:
   - `src/browser/` - Frontend code
   - `src/node/` - Backend code
   - `src/common/` - Shared code

3. Register extension in `package.json`:
   ```json
   {
     "dependencies": {
       "custom-feature": "0.0.1"
     }
   }
   ```

## Step 7: VS Code Extension Integration

1. Add VS Code extensions in `package.json`:
   ```json
   {
     "theiaPlugins": {
       "vscode-builtin-typescript": "https://github.com/theia-ide/vscode-builtin-extensions/releases/download/v1.39.1-prel/typescript-1.39.1-prel.vsix",
       "vscode-builtin-json": "https://github.com/theia-ide/vscode-builtin-extensions/releases/download/v1.39.1-prel/json-1.39.1-prel.vsix"
     }
   }
   ```

## Step 8: Packaging and Distribution

1. Configure electron-builder:
   ```yaml
   directories:
     output: dist
   files:
     - from: .
       filter:
         - package.json
         - lib
         - src-gen
   win:
     target:
       - nsis
       - zip
   mac:
     target:
       - dmg
   linux:
     target:
       - deb
       - AppImage
   ```

2. Build installers:
   ```bash
   yarn package
   ```

## Step 9: Adding Chat Integration

1. Create chat extension:
   ```typescript
   // src/browser/chat/chat-frontend-module.ts
   import { ContainerModule } from '@theia/core/shared/inversify';
   import { ChatWidget } from './chat-widget';
   import { ChatService } from './chat-service';
   
   export default new ContainerModule(bind => {
     bind(ChatWidget).toSelf();
     bind(ChatService).toSelf().inSingletonScope();
   });
   ```

2. Implement chat widget:
   ```typescript
   // src/browser/chat/chat-widget.ts
   import { Widget } from '@theia/core/lib/browser';
   
   export class ChatWidget extends Widget {
     static readonly ID = 'chat-widget';
     
     constructor() {
       super();
       this.id = ChatWidget.ID;
       this.title.label = 'Chat';
       this.title.closable = true;
       this.title.iconClass = 'fa fa-comments';
     }
   }
   ```

## Step 10: Testing and Quality Assurance

1. Run linter:
   ```bash
   yarn lint
   ```

2. Run unit tests:
   ```bash
   yarn test
   ```

3. Run integration tests:
   ```bash
   yarn test:integration
   ```

## Troubleshooting

Common issues and solutions:

1. Build failures:
   ```bash
   # Clear build artifacts
   yarn clean
   
   # Clear dependency cache
   yarn clean:node_modules
   
   # Reinstall dependencies
   yarn
   ```

2. Runtime errors:
   - Check console logs in DevTools (Ctrl+Shift+I)
   - Verify extension compatibility
   - Check system requirements

## Resources

- Theia Documentation: https://theia-ide.org/docs/
- Blueprint Repository: https://github.com/eclipse-theia/theia-blueprint
- VS Code Extensions: https://open-vsx.org/

## Next Steps

1. Implement custom themes
2. Add language support
3. Configure auto-updates
4. Set up telemetry
5. Implement marketplace integration 