import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import inquirer from 'inquirer';

/**
 * Generates the absolute path for a given file in the current working directory.
 * 
 * @param {string} file - The filename or relative path.
 * @returns {string} The absolute path of the file.
 */
export function f(file: string): string {
  return path.join(process.cwd(), file);
}

/**
 * Encrypts the contents of the .env file using AES-256 encryption and saves the result to a .env.encrypted file.
 * Prompts the user for an encryption password.
 * 
 * @async
 * @function encryptEnv
 * @returns {Promise<void>} A promise that resolves when the encryption is complete.
 */
export async function encryptEnv(): Promise<void> {
  // Read the .env file
  const envFilePath = f('.env');
  const encryptedFilePath = f('.env.encrypted');

  if (!fs.existsSync(envFilePath)) {
    console.error(`File not found: ${envFilePath}`);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envFilePath, 'utf8');

  // Prompt the user for the encryption password
  const { password } = await inquirer.prompt({
    type: 'password',
    name: 'password',
    message: 'Enter the encryption password:',
    mask: '*',
  });

  // Encrypt the contents using AES-256
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(String(password)).digest();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(envContent, 'utf8'), cipher.final()]);

  // Write the IV and encrypted contents to .env.encrypted file as raw bytes
  const encryptedContent = Buffer.concat([iv, encrypted]);
  fs.writeFileSync(encryptedFilePath, encryptedContent);

  console.log(`.env file encrypted and saved to ${encryptedFilePath}`);
}

/**
 * Decrypts the contents of the .env.encrypted file using AES-256 decryption and converts it into a JSON object.
 * Prompts the user for a decryption password.
 * 
 * @async
 * @function decryptEnv
 * @returns {Promise<Record<string, string>>} A promise that resolves to a JSON object representing the environment variables.
 */
export async function decryptEnv(): Promise<Record<string, string>> {
  // Define file paths
  const encryptedFilePath = f('.env.encrypted');

  if (!fs.existsSync(encryptedFilePath)) {
    console.error(`File not found: ${encryptedFilePath}`);
    process.exit(1);
  }

  // Read the encrypted file
  const encryptedContent = fs.readFileSync(encryptedFilePath);

  // Prompt the user for the decryption password
  const { password } = await inquirer.prompt({
    type: 'password',
    name: 'password',
    message: 'Enter the decryption password:',
    mask: '*',
  });

  // Extract the IV and encrypted content
  const iv = encryptedContent.subarray(0, 16);
  const encryptedText = encryptedContent.subarray(16);

  // Decrypt the contents using AES-256
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(String(password)).digest();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  const decryptedString = decrypted.toString('utf-8');

  // Convert the decrypted string into a JSON object
  const envObject = decryptedString.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key) {
      acc[key.trim()] = value ? value.trim() : '';
    }
    return acc;
  }, {} as Record<string, string>);

  return envObject;
}
