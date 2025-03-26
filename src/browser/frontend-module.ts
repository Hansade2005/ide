import { ContainerModule } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { OptimaExtensionConfiguration } from './optima-extension-configuration';

export default new ContainerModule(bind => {
    bind(OptimaExtensionConfiguration).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(OptimaExtensionConfiguration);
}); 