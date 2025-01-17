import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

// サービスドメインからプロトコルとドメイン部分を取り除く
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
  .replace(/^https?:\/\//, '')  // プロトコル部分を削除
  .replace(/\.microcms\.io\/?$/, '')  // .microcms.ioを削除
  .replace(/^([^.]+).*$/, '$1');  // サブドメインのみを取得

export const client = createClient({
  serviceDomain,
  apiKey: process.env.MICROCMS_API_KEY,
});