import axios from 'axios';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import tar from 'tar';
import { Binary } from './binary';

export interface MakeInstallerParams {
  root: string;
  binary: Binary;
}

export const makeInstaller = ({ root, binary }: MakeInstallerParams) => {
  const installDirectory = path.join(root, 'node_modules', '.bin');
  const binaryPath = path.join(installDirectory, binary.name);

  const install = async () => {
    if (existsSync(binaryPath)) {
      return;
    }

    if (existsSync(installDirectory)) {
      await fs.rm(installDirectory, { recursive: true, force: true });
    }

    await fs.mkdir(installDirectory, { recursive: true });

    console.log(`Downloading ${binary.url}`);

    const res = await axios.get(binary.url, { responseType: 'stream' });

    await new Promise((resolve, reject) => {
      res.data
        .pipe(tar.extract({ strip: 0, cwd: installDirectory }))
        .on('finish', resolve)
        .on('error', reject);
    }).catch(err => {
      console.error(`Failed to download: ${err}`);
    });
  };

  return { install, binaryPath };
};
