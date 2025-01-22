import { CacheEngine } from '@cache/cacheengine';
import { configService, ProviderSession } from '@config/env.config';
import { eventEmitter } from '@config/event.config';
import { Logger } from '@config/logger.config';

import { CallController } from './controllers/call.controller';
import { ChatController } from './controllers/chat.controller';
import { GroupController } from './controllers/group.controller';
import { InstanceController } from './controllers/instance.controller';
import { LabelController } from './controllers/label.controller';
import { ProxyController } from './controllers/proxy.controller';
import { SendMessageController } from './controllers/sendMessage.controller';
import { SettingsController } from './controllers/settings.controller';
import { TemplateController } from './controllers/template.controller';
import { ChannelController } from './integrations/channel/channel.controller';
import { EvolutionController } from './integrations/channel/evolution/evolution.controller';
import { MetaController } from './integrations/channel/meta/meta.controller';
import { BaileysController } from './integrations/channel/whatsapp/baileys.controller';
import { EventManager } from './integrations/event/event.manager';
import { S3Controller } from './integrations/storage/s3/controllers/s3.controller';
import { S3Service } from './integrations/storage/s3/services/s3.service';
import { ProviderFiles } from './provider/sessions';
import { PrismaRepository } from './repository/repository.service';
import { CacheService } from './services/cache.service';
import { WAMonitoringService } from './services/monitor.service';
import { ProxyService } from './services/proxy.service';
import { SettingsService } from './services/settings.service';
import { TemplateService } from './services/template.service';

const logger = new Logger('WA MODULE');

export const cache = new CacheService(new CacheEngine(configService, 'instance').getEngine());
const baileysCache = new CacheService(new CacheEngine(configService, 'baileys').getEngine());

let providerFiles: ProviderFiles = null;
if (configService.get<ProviderSession>('PROVIDER').ENABLED) {
  providerFiles = new ProviderFiles(configService);
}

export const prismaRepository = new PrismaRepository(configService);

export const waMonitor = new WAMonitoringService(
  eventEmitter,
  configService,
  prismaRepository,
  providerFiles,
  cache,
  baileysCache,
);

const s3Service = new S3Service(prismaRepository);
export const s3Controller = new S3Controller(s3Service);

const templateService = new TemplateService(waMonitor, prismaRepository, configService);
export const templateController = new TemplateController(templateService);

const proxyService = new ProxyService(waMonitor);
export const proxyController = new ProxyController(proxyService, waMonitor);

const settingsService = new SettingsService(waMonitor);
export const settingsController = new SettingsController(settingsService);

export const instanceController = new InstanceController(
  waMonitor,
  configService,
  prismaRepository,
  eventEmitter,
  settingsService,
  proxyController,
  cache,
  baileysCache,
  providerFiles,
);
export const sendMessageController = new SendMessageController(waMonitor);
export const callController = new CallController(waMonitor);
export const chatController = new ChatController(waMonitor);
export const groupController = new GroupController(waMonitor);
export const labelController = new LabelController(waMonitor);

export const eventManager = new EventManager(prismaRepository, waMonitor);
export const channelController = new ChannelController(prismaRepository, waMonitor);

// channels
export const evolutionController = new EvolutionController(prismaRepository, waMonitor);
export const metaController = new MetaController(prismaRepository, waMonitor);
export const baileysController = new BaileysController(waMonitor);

logger.info('Module - ON');
