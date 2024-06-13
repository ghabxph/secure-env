import { Command } from 'commander';
import { encryptEnv } from './functions';
import { serve } from './server';

/**
 * Main entry point for the application.
 * Parses command-line options and executes the corresponding function.
 * 
 * @async
 * @function
 */
const program = new Command();

program
  .option('--encrypt', 'Encrypt the .env file')
  .option('--serve', 'Run secure env server and wait for connection.');

program.parse(process.argv);

const options = program.opts();

(async () => {
  if (options.encrypt) {
    await encryptEnv();
  } else if (options.serve) {
    await serve();
  } else {
    console.log('Please specify an option: --encrypt or --serve');
  }
})();
