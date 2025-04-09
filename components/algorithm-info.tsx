import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InfoIcon } from "lucide-react"

export default function AlgorithmInfo() {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <InfoIcon className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium">About Encryption Algorithms</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="aes">
          <AccordionTrigger>AES-256 (Advanced Encryption Standard)</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-400 text-sm">
              AES-256 is a symmetric encryption algorithm that uses the same key for both encryption and decryption.
              With a 256-bit key length, it provides strong security and is widely used for sensitive data. Keep your
              encryption key secure, as anyone with the key can decrypt your data.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rsa">
          <AccordionTrigger>RSA (Rivest–Shamir–Adleman)</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-400 text-sm">
              RSA is an asymmetric encryption algorithm that uses a pair of keys: a public key for encryption and a
              private key for decryption. It's commonly used for secure data transmission. In this application, we use a
              simplified implementation for educational purposes. For production use, consider using a dedicated
              cryptography library.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sha">
          <AccordionTrigger>SHA-256 (Secure Hash Algorithm)</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-400 text-sm">
              SHA-256 is a cryptographic hash function that generates a unique 256-bit (32-byte) hash. It's one-way,
              meaning you cannot decrypt or reverse the hash to get the original data. It's commonly used for data
              integrity verification, password storage, and digital signatures.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger>Security Best Practices</AccordionTrigger>
          <AccordionContent>
            <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
              <li>Never share your encryption keys with untrusted parties.</li>
              <li>Store encryption keys securely, separate from the encrypted data.</li>
              <li>For highly sensitive data, consider using multiple layers of encryption.</li>
              <li>This application processes all data in your browser - nothing is sent to any server.</li>
              <li>For production applications, consider using established cryptography libraries and frameworks.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="key-security">
          <AccordionTrigger>Key Management Security</AccordionTrigger>
          <AccordionContent>
            <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
              <li>Your encryption keys are hidden by default to protect them from shoulder surfing.</li>
              <li>Use the eye icon to toggle visibility only when you're in a secure environment.</li>
              <li>Keys are never stored on our servers - they remain in your browser only.</li>
              <li>For maximum security, store your encryption keys in a password manager.</li>
              <li>Consider using different keys for different sensitive documents.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
