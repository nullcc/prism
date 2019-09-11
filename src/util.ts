import * as fs from 'fs';
import { join } from 'path';

export const getFilesInDir = (dir: string): string[] => {
  let filePaths: string[] = [];
  const getFile = (dirPath: string) => {
    let files = fs.readdirSync(dirPath);
    files.forEach((filePath: string) => {
      let fPath = join(dirPath, filePath);
      let stat = fs.statSync(fPath);
      if(stat.isDirectory()) {
        getFile(fPath);
      }
      if (stat.isFile()) {
        filePaths.push(fPath);
      }
    });
  };
  getFile(dir);
  return filePaths;
};
