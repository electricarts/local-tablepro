import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const addons = path.join(os.homedir(), 'Library', 'Application Support', 'Local', 'addons');
const destination = path.join(addons, 'local-tablepro');
const operation = process.argv[2];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (operation === 'link') {
  if (!fs.existsSync(addons)) {
    fail(`Local's add-ons directory does not exist: ${addons}`);
  } else if (fs.existsSync(destination) || fs.lstatSync(destination, { throwIfNoEntry: false })) {
    fail(`Refusing to replace an existing add-on: ${destination}`);
  } else {
    fs.symlinkSync(project, destination, 'dir');
    console.log(`Linked ${destination} to ${project}`);
  }
} else if (operation === 'unlink') {
  const stat = fs.lstatSync(destination, { throwIfNoEntry: false });
  if (!stat?.isSymbolicLink()) {
    fail(`Refusing to remove a path that is not a symbolic link: ${destination}`);
  } else if (fs.realpathSync(destination) !== project) {
    fail(`Refusing to remove a symbolic link owned by another project: ${destination}`);
  } else {
    fs.unlinkSync(destination);
    console.log(`Removed development link ${destination}`);
  }
} else {
  fail('Usage: node scripts/addon-link.mjs link|unlink');
}
