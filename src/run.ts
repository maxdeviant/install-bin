import { spawnSync } from 'child_process';
import { makeInstaller, MakeInstallerParams } from './installer';

const hideBin = (argv: string[]) => argv.slice(2);

export const run = async (params: MakeInstallerParams) => {
  const { install, binaryPath } = makeInstaller(params);

  await install();

  const result = spawnSync(binaryPath, hideBin(process.argv), {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(result.error);
    return process.exit(1);
  }

  process.exit(result.status || 0);
};
