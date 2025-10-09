const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const size = 12;

type CryptoLike = Pick<Crypto, 'getRandomValues'>;

declare global {
  interface Window {
    msCrypto?: CryptoLike;
  }
}

function resolveCrypto(): CryptoLike | undefined {
  if (typeof globalThis === 'object' && globalThis) {
    if ('crypto' in globalThis && globalThis.crypto) {
      return globalThis.crypto;
    }
    if ('msCrypto' in globalThis) {
      const maybe = (globalThis as Window).msCrypto;
      if (maybe) {
        return maybe;
      }
    }
  }
  return undefined;
}

export function nanoid(): string {
  let id = '';
  const cryptoObj = resolveCrypto();
  if (cryptoObj) {
    const values = new Uint32Array(size);
    cryptoObj.getRandomValues(values);
    for (let index = 0; index < size; index += 1) {
      const charIndex = values[index] % alphabet.length;
      id += alphabet.charAt(charIndex);
    }
    return id;
  }
  for (let index = 0; index < size; index += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    id += alphabet.charAt(randomIndex);
  }
  return id;
}
