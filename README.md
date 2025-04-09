# Fardo Encryption

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A secure, browser-based encryption application for protecting your sensitive files and text. Fardo Encryption performs all cryptographic operations directly in your browser, ensuring your data never leaves your device.

![Fardo Encryption Screenshot](https://placeholder.svg?height=400&width=800)

## Features

- **Text Encryption/Decryption**: Secure your messages with AES-256 or RSA encryption
- **File Encryption/Decryption**: Protect sensitive files with strong encryption
- **SHA-256 Hashing**: Generate secure hashes for data verification
- **Secure Sharing**: Share encrypted content with others via secure links
- **Customizable Interface**: Personalize your application with custom logo settings
- **Client-side Processing**: All encryption happens in your browser - no data is sent to servers
- **Responsive Design**: Works on desktop and mobile devices

## Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Vercel account (for deployment)
- Upstash Redis account (for storing shared snippets)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fardo-encryption.git
cd fardo-encryption