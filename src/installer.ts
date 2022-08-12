import axios, { AxiosRequestConfig } from 'axios';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import tar from 'tar';
import { Binary } from './binary';
import { Logger, LogLevelFilterString } from './logger';

export interface MakeInstallerParams {
  root: string;
  binary: Binary;
  logLevel?: LogLevelFilterString;
  requestConfig?: AxiosRequestConfig;
}

export const makeInstaller = ({
  root,
  binary,
  logLevel = 'info',
  requestConfig,
}: MakeInstallerParams) => {
  const logger = new Logger(logLevel);

  const installDirectory = path.join(root, 'node_modules', '.bin');
  const binaryPath = path.join(installDirectory, binary.name);

  const install = async () => {
    logger.trace({ installDirectory, binaryPath });

    if (existsSync(binaryPath)) {
      logger.info(`${binary.name} already installed, skipping installation.`);
      return;
    }

    if (existsSync(installDirectory)) {
      logger.debug(`Installation directory already exists, purging directory`);
      await fs.rm(installDirectory, { recursive: true, force: true });
    }

    await fs.mkdir(installDirectory, { recursive: true });

    logger.info(`Downloading ${binary.url}`);

    try {
      const res = await axios.get(binary.url, {
        ...requestConfig,
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        res.data
          .pipe(tar.extract({ strip: 0, cwd: installDirectory }))
          .on('finish', resolve)
          .on('error', reject);
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred.';

      logger.error(`Binary download failed: ${message}`);
      process.exit(1);
    }
  };

  return { install, binaryPath };
};
