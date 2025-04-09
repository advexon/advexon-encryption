```markdown project="Fardo Encryption" file="README.md"
...
```

2. Install dependencies:


```shellscript
npm install
# or
yarn install
```

3. Set up environment variables:


Create a `.env.local` file in the root directory with the following variables:

```plaintext
KV_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_redis_token
KV_REST_API_READ_ONLY_TOKEN=your_upstash_redis_readonly_token
```

4. Run the development server:


```shellscript
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Deployment

The easiest way to deploy Fardo Encryption is using Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add the required environment variables
4. Deploy


[

](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ffardo-encryption)

## Usage

### Text Encryption

1. Navigate to the Text Encryption tab
2. Select your encryption algorithm (AES-256, RSA, or SHA-256)
3. Enter the text you want to encrypt
4. Generate or enter an encryption key
5. Click "Encrypt Text"
6. Copy or share the encrypted result


```javascript
// Example of using the encryption utility in your own code
import { encryptText, generateKey } from "@/lib/crypto-utils";

const text = "Sensitive information";
const key = await generateKey("AES-256");
const encryptedText = await encryptText(text, key, "AES-256");
```

### File Encryption

1. Navigate to the File Encryption tab
2. Select your encryption algorithm
3. Upload the file you want to encrypt
4. Generate or enter an encryption key
5. Click "Encrypt File"
6. Download the encrypted file


### Sharing Encrypted Content

1. After encrypting text, click the "Share" button
2. Copy the generated link
3. Share the link with your recipient
4. Share the encryption key through a separate secure channel
5. The recipient can access the encrypted content and decrypt it with the key


## Security

Fardo Encryption uses industry-standard cryptographic algorithms:

- **AES-256**: Advanced Encryption Standard with 256-bit key length for symmetric encryption
- **RSA**: Public-key cryptography for asymmetric encryption
- **SHA-256**: Secure Hash Algorithm for one-way hashing


All cryptographic operations are performed client-side in the browser using the Web Cryptography API. Your data and encryption keys never leave your device.

## Customization

### Logo Settings

You can customize the application logo:

1. Navigate to `/settings/logo`
2. Upload a custom logo
3. Adjust size and display settings
4. Save your configuration


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework used
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Upstash Redis](https://upstash.com/) - For storing shared snippets
- [Web Cryptography API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - For cryptographic operations


## Contact

Project Link: https://github.com/advexon/advexon-encryption

---

Made with ❤️ by Siyovush Mirzoev.

```plaintext

This README provides a comprehensive overview of the Fardo Encryption project, including installation instructions, usage examples, security information, and contribution guidelines. You can customize it further with your specific project details, screenshots, and contact information.

```
