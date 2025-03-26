import { injectable, inject } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution, ViewContainer, WidgetManager, ApplicationShell, KeybindingRegistry, KeybindingContext, Command, CommandRegistry } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';

const ToggleSecondaryViewCommand: Command = {
    id: 'optima.toggleSecondaryView',
    label: 'Toggle Secondary Sidebar'
};

@injectable()
export class OptimaExtensionConfiguration implements FrontendApplicationContribution {
    constructor(
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(WidgetManager) private readonly widgetManager: WidgetManager,
        @inject(ApplicationShell) private readonly shell: ApplicationShell,
        @inject(KeybindingRegistry) private readonly keybindings: KeybindingRegistry,
        @inject(CommandRegistry) private readonly commands: CommandRegistry
    ) { }

    async onStart(): Promise<void> {
        // Wait for workspace to be ready
        await this.workspaceService.ready;

        // Register toggle command
        this.registerCommands();

        // Ensure the widget is created and shown
        await this.showOptimaAI();

        // Add listener to ensure proper position when IDE restarts
        this.shell.onDidChangeCurrentWidget(() => {
            this.ensureProperPosition();
        });
    }

    private registerCommands(): void {
        // Register toggle command
        this.commands.registerCommand(ToggleSecondaryViewCommand, {
            execute: () => this.toggleSecondaryView()
        });

        // Register keybinding (Ctrl/Cmd + B)
        this.keybindings.registerKeybinding({
            command: ToggleSecondaryViewCommand.id,
            keybinding: 'ctrlcmd+b'
        });
    }

    private async toggleSecondaryView(): Promise<void> {
        const rightArea = this.shell.getWidgets('right');
        const isVisible = rightArea.length > 0 && rightArea.some(w => this.shell.isVisible('right', w));

        if (isVisible) {
            // Hide the sidebar
            rightArea.forEach(widget => {
                this.shell.collapsePanel('right');
            });
        } else {
            // Show the sidebar and ensure Optima AI is properly positioned
            await this.showOptimaAI();
        }
    }

    private async showOptimaAI(): Promise<void> {
        try {
            // Create or get the widget
            const viewContainer = await this.widgetManager.getOrCreateWidget<ViewContainer>('optima-ai-container');
            if (viewContainer) {
                // Set the title and icon
                viewContainer.setTitle({
                    label: 'Optima AI',
                    iconClass: 'optima-ai-icon',
                    closable: false // Make it non-closable
                });
                
                // Configure for right sidebar
                viewContainer.options = {
                    ...viewContainer.options,
                    area: 'right',
                    rank: 1, // High priority to show at top
                    mode: 'split-right' // Force split to right
                };

                // Show in right area if not already visible
                if (!this.shell.isVisible('right', viewContainer)) {
                    await this.shell.addWidget(viewContainer, {
                        area: 'right',
                        mode: 'split-right',
                        ref: null
                    });
                }

                // Activate the widget
                await this.shell.activateWidget(viewContainer.id);
            }
        } catch (error) {
            console.error('Failed to show Optima AI:', error);
        }
    }

    private async ensureProperPosition(): Promise<void> {
        const viewContainer = await this.widgetManager.getOrCreateWidget<ViewContainer>('optima-ai-container');
        if (viewContainer && this.shell.isVisible('right', viewContainer)) {
            // Ensure it's in the right position when visible
            viewContainer.options = {
                ...viewContainer.options,
                area: 'right',
                rank: 1,
                mode: 'split-right'
            };
        }
    }
} 