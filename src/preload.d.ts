export {};

declare global {
  interface Window {
    api: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      loadJson: (string) => Promise<any>;
      // adicione outras funções expostas pelo preload aqui
    };
  }
}