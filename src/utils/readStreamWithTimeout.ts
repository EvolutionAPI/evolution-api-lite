import { promisify } from 'util';

export async function readStreamWithTimeout(stream: any, timeout: number = 30_000) {
  const setTimeoutPromise = promisify(setTimeout);

  let buffer = Buffer.from([]);
  const chunks = [];
  const timer: any = setTimeoutPromise(timeout).then(() => {
    stream.destroy(new Error('Stream timeout'));
  });

  try {
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    buffer = Buffer.concat(chunks);
  } finally {
    clearTimeout(timer);
  }

  return buffer;
}
