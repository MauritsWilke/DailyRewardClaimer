export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const Log = (message: string) => console.log(`> ${message}`);
