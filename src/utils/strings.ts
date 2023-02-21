import { Md5 } from 'ts-md5';

export const hashAny = (...data: any[]): string => {
  const json_str = JSON.stringify(data);
  return Md5.hashStr(json_str);
};

export function hideMiddleChars(str: string) {
  if (!str) return;
  if (str?.length <= 12) return str;
  let start = str.slice(0, 6);
  let end = str.slice(-6);
  let middle = '*'.repeat(3);
  return start + middle + end;
}

export function splitChars(str: string) {
  if (!str) return;
  return str?.split(':')[1];
}

export const validResourcesName = (str: string): boolean => {
  if (!str) return false;
  let pattern = /^[a-z0-9]+([-.][a-z0-9]+)*$/;
  return pattern.test(str);
};
