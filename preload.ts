import { contextBridge } from "electron";
import fs from "fs";
import path from "path";

contextBridge.exposeInMainWorld("electronAPI", {
  readWin98Image: () => {
    const imgPath = path.join(process.cwd(), "win98.img");
    return fs.readFileSync(imgPath);
  }
});
