import { customAlphabet } from 'nanoid'

export default function(length = 12) {
  return customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length)();
}
