export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // No-op: database removed
  }
}

export const onRequestError = () => undefined;
