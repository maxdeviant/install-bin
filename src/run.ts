import { spawnSync } from 'child_process';
import { makeInstaller, MakeInstallerParams } from './installer';
import { Logger } from './logger';

const hideBin = (argv: string[]) => argv.slice(2);

export const run = async (params: MakeInstallerParams) => {
  const logger = new Logger(params.logLevel ?? 'info');

  const { install, binaryPath } = makeInstaller(params);

  await install();

  const result = spawnSync(binaryPath, hideBin(process.argv), {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.error) {
    logger.error(result.error);
    return process.exit(1);
  }

  process.exit(result.status || 0);
};
