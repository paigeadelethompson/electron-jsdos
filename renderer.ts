export {};

declare const Dos: any;

declare global {
  interface Window {
    electronAPI: {
      readWin98Image: () => Uint8Array;
    };
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("dos") as HTMLCanvasElement;

  Dos(canvas, {
    wdosboxUrl: "./dist/vendor/jsdos/wdosbox.js",
    wasmUrl: "./dist/vendor/jsdos/wdosbox.wasm",
    pathPrefix: "./dist/vendor/jsdos/"
  }).ready(async (fs: any, main: any) => {
    console.log("js-dos ready");

    try {
      const buf = window.electronAPI.readWin98Image();

      fs.createFile("win98.img", buf);

      console.log("win98.img loaded");

      main([
        "-c",
        "imgmount c win98.img -t hdd -size 512,63,16,1024",
        "-c",
        "boot -l c"
      ]);
    } catch (err) {
      console.error("Image load failed", err);
    }
  });
});
