import { EventInstanceMixin } from '@api/integrations/event/event.dto';

export type Constructor<T = {}> = new (...args: any[]) => T;

export class IntegrationDto extends EventInstanceMixin(class {}) {}
