import * as OneSignal from '@onesignal/node-onesignal';

export function convertLanguageStringMap(map?: OneSignal.LanguageStringMap): {
  [language: string]: string;
} {
  if (!map) {
    return {};
  }
  return Object.fromEntries(Object.entries(map));
}
