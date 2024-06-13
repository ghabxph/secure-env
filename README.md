# Secure Environment Variable Manager

This project provides utilities to encrypt and decrypt environment variables stored in a `.env` file using AES-256 encryption. It includes a Fastify server to serve the decrypted environment variables, which is designed to shut down after handling a single request.

## Features

- **Encrypt Environment Variables**: Encrypts the contents of a `.env` file and saves the encrypted data to a `.env.encrypted` file.
- **Decrypt Environment Variables**: Decrypts the contents of a `.env.encrypted` file and converts it into a JSON object.
- **Serve Environment Variables**: Starts a Fastify server that serves the decrypted environment variables and shuts down after handling a single request.

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ghabxph/secure-env.git
   cd secure-env
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

## Usage

### Encrypting Environment Variables

To encrypt the `.env` file, run:

```bash
yarn start --encrypt
```

You will be prompted to enter an encryption password. The encrypted data will be saved to `.env.encrypted`.

### Decrypting and Serving Environment Variables

To decrypt the `.env.encrypted` file and start the server, run:

```bash
yarn start --serve
```

You will be prompted to enter the decryption password. The Fastify server will start and serve the decrypted environment variables at `0.0.0.0:56123`. The server will shut down after handling a single request.

### Command-Line Options

- `--encrypt`: Encrypt the `.env` file.
- `--serve`: Run the secure environment variable server and wait for a connection.

## Project Structure

- `src/functions.ts`: Contains functions to encrypt and decrypt environment variables.
- `src/server.ts`: Contains the Fastify server setup.
- `src/index.ts`: Entry point for the application, handling command-line options.

## Example `.env` File

Create a `.env` file in the root directory with the following content:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or features.

## Acknowledgements

- [Fastify](https://www.fastify.io/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/)
