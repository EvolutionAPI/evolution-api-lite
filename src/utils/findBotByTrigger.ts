import { advancedOperatorsSearch } from './advancedOperatorsSearch';

export const findBotByTrigger = async (
  botRepository: any,
  settingsRepository: any,
  content: string,
  instanceId: string,
) => {
  // Check for triggerType 'all'
  const findTriggerAll = await botRepository.findFirst({
    where: {
      enabled: true,
      triggerType: 'all',
      instanceId: instanceId,
    },
  });

  if (findTriggerAll) return findTriggerAll;

  const findTriggerAdvanced = await botRepository.findMany({
    where: {
      enabled: true,
      triggerType: 'advanced',
      instanceId: instanceId,
    },
  });
  for (const advanced of findTriggerAdvanced) {
    if (advancedOperatorsSearch(content, advanced.triggerValue)) {
      return advanced;
    }
  }

  // Check for exact match
  const findTriggerEquals = await botRepository.findFirst({
    where: {
      enabled: true,
      triggerType: 'keyword',
      triggerOperator: 'equals',
      triggerValue: content,
      instanceId: instanceId,
    },
  });

  if (findTriggerEquals) return findTriggerEquals;

  // Check for regex match
  const findRegex = await botRepository.findMany({
    where: {
      enabled: true,
      triggerType: 'keyword',
      triggerOperator: 'regex',
      instanceId: instanceId,
    },
  });

  let findTriggerRegex = null;

  for (const regex of findRegex) {
    const regexValue = new RegExp(regex.triggerValue);

    if (regexValue.test(content)) {
      findTriggerRegex = regex;
      break;
    }
  }

  if (findTriggerRegex) return findTriggerRegex;

  // Check for startsWith match
  const findStartsWith = await botRepository.findMany({
    where: {
      enabled: true,
      triggerType: 'keyword',
      triggerOperator: 'startsWith',
      instanceId: instanceId,
    },
  });

  let findTriggerStartsWith = null;

  for (const startsWith of findStartsWith) {
    if (content.startsWith(startsWith.triggerValue)) {
      findTriggerStartsWith = startsWith;
      break;
    }
  }

  if (findTriggerStartsWith) return findTriggerStartsWith;

  // Check for endsWith match
  const findEndsWith = await botRepository.findMany({
    where: {
      enabled: true,
      triggerType: 'keyword',
      triggerOperator: 'endsWith',
      instanceId: instanceId,
    },
  });

  let findTriggerEndsWith = null;

  for (const endsWith of findEndsWith) {
    if (content.endsWith(endsWith.triggerValue)) {
      findTriggerEndsWith = endsWith;
      break;
    }
  }

  if (findTriggerEndsWith) return findTriggerEndsWith;

  // Check for contains match
  const findContains = await botRepository.findMany({
    where: {
      enabled: true,
      triggerType: 'keyword',
      triggerOperator: 'contains',
      instanceId: instanceId,
    },
  });

  let findTriggerContains = null;

  for (const contains of findContains) {
    if (content.includes(contains.triggerValue)) {
      findTriggerContains = contains;
      break;
    }
  }

  if (findTriggerContains) return findTriggerContains;

  const fallback = await settingsRepository.findFirst({
    where: {
      instanceId: instanceId,
    },
  });

  if (fallback?.openaiIdFallback) {
    const findFallback = await botRepository.findFirst({
      where: {
        id: fallback.openaiIdFallback,
      },
    });

    if (findFallback) return findFallback;
  }

  return null;
};
