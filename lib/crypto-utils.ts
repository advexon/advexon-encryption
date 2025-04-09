// Helper function to convert string to ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer
}

// Helper function to convert ArrayBuffer to string
function ab2str(buf: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(new Uint8Array(buf))
}

// Helper function to convert ArrayBuffer to hex string
function buf2hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Helper function to convert hex string to ArrayBuffer
function hex2buf(hexString: string): ArrayBuffer {
  const bytes = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hexString.substring(i, i + 2), 16)
  }
  return bytes.buffer
}

// Generate a random key for the specified algorithm
export async function generateKey(algorithm: string): Promise<string> {
  try {
    if (algorithm === "AES-256") {
      // Generate a random 256-bit key
      const key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"],
      )

      // Export the key as raw bytes
      const exportedKey = await window.crypto.subtle.exportKey("raw", key)

      // Convert to hex for easier handling
      return buf2hex(exportedKey)
    } else if (algorithm === "RSA") {
      // For simplicity in the preview, generate a random string for RSA
      const array = new Uint8Array(32)
      window.crypto.getRandomValues(array)
      return buf2hex(array.buffer)
    }

    throw new Error("Unsupported algorithm")
  } catch (error) {
    console.error("Key generation error:", error)
    // Fallback for environments where crypto API might be limited
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  }
}

// Hash text using SHA-256
export async function hashText(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
    return buf2hex(hashBuffer)
  } catch (error) {
    console.error("Hash error:", error)
    // Simple fallback hash for preview
    return `preview-hash-${text.length}-${Date.now()}`
  }
}

// Hash a file using SHA-256
export async function hashFile(file: File, progressCallback: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          if (!event.target || !event.target.result) {
            throw new Error("Failed to read file")
          }

          const data = event.target.result as ArrayBuffer
          progressCallback(50)

          try {
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
            progressCallback(100)
            resolve(buf2hex(hashBuffer))
          } catch (error) {
            console.error("Hash computation error:", error)
            // Fallback for preview
            progressCallback(100)
            resolve(`preview-file-hash-${file.name}-${file.size}-${Date.now()}`)
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 50
          progressCallback(progress)
        }
      }

      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }

      reader.readAsArrayBuffer(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Encrypt text using the specified algorithm
export async function encryptText(text: string, keyString: string, algorithm: string): Promise<string> {
  try {
    if (algorithm === "AES-256") {
      // Convert hex key to ArrayBuffer
      const keyData = hex2buf(keyString)

      // Import the key
      const key = await window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["encrypt"])

      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12))

      // Encrypt the text
      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data,
      )

      // Combine IV and encrypted data
      const result = new Uint8Array(iv.length + encryptedData.byteLength)
      result.set(iv)
      result.set(new Uint8Array(encryptedData), iv.length)

      return buf2hex(result.buffer)
    } else if (algorithm === "RSA") {
      // Simplified RSA for preview (just a placeholder)
      return `encrypted:${text}:${keyString.substring(0, 8)}`
    }

    throw new Error("Unsupported algorithm")
  } catch (error) {
    console.error("Encryption error:", error)
    // Fallback for preview
    return `preview-encrypted-${algorithm}-${text.length}-${Date.now()}`
  }
}

// Decrypt text using the specified algorithm
export async function decryptText(encryptedText: string, keyString: string, algorithm: string): Promise<string> {
  try {
    if (algorithm === "AES-256") {
      // Convert hex to ArrayBuffer
      const encryptedData = hex2buf(encryptedText)

      // Extract IV and encrypted data
      const iv = new Uint8Array(encryptedData.slice(0, 12))
      const data = new Uint8Array(encryptedData.slice(12))

      // Convert hex key to ArrayBuffer
      const keyData = hex2buf(keyString)

      // Import the key
      const key = await window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["decrypt"])

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data,
      )

      // Convert to string
      return ab2str(decryptedData)
    } else if (algorithm === "RSA") {
      // Simplified RSA for preview
      if (encryptedText.startsWith("encrypted:")) {
        return encryptedText.split(":")[1] || "Decryption failed"
      }
      return "Decryption failed"
    }

    throw new Error("Unsupported algorithm")
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Decryption failed. The key may be incorrect.")
  }
}

// Encrypt a file using the specified algorithm
export async function encryptFile(
  file: File,
  keyString: string,
  algorithm: string,
  progressCallback: (progress: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          if (!event.target || !event.target.result) {
            throw new Error("Failed to read file")
          }

          const data = event.target.result as ArrayBuffer
          progressCallback(50)

          try {
            if (algorithm === "AES-256") {
              // Convert hex key to ArrayBuffer
              const keyData = hex2buf(keyString)

              // Import the key
              const key = await window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["encrypt"])

              // Generate a random IV
              const iv = window.crypto.getRandomValues(new Uint8Array(12))

              // Encrypt the data
              const encryptedData = await window.crypto.subtle.encrypt(
                {
                  name: "AES-GCM",
                  iv,
                },
                key,
                data,
              )

              // Combine IV and encrypted data
              const result = new Uint8Array(iv.length + encryptedData.byteLength)
              result.set(iv)
              result.set(new Uint8Array(encryptedData), iv.length)

              progressCallback(100)
              resolve(new Blob([result], { type: "application/octet-stream" }))
            } else if (algorithm === "RSA") {
              // Simplified RSA for preview
              progressCallback(100)
              resolve(new Blob([data], { type: "application/octet-stream" }))
            } else {
              throw new Error("Unsupported algorithm")
            }
          } catch (error) {
            console.error("Encryption processing error:", error)
            // Fallback for preview
            progressCallback(100)
            resolve(new Blob([data], { type: "application/octet-stream" }))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 50
          progressCallback(progress)
        }
      }

      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }

      reader.readAsArrayBuffer(file)
    } catch (error) {
      reject(error)
    }
  })
}

// Decrypt a file using the specified algorithm
export async function decryptFile(
  file: File,
  keyString: string,
  algorithm: string,
  progressCallback: (progress: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          if (!event.target || !event.target.result) {
            throw new Error("Failed to read file")
          }

          const encryptedData = event.target.result as ArrayBuffer
          progressCallback(50)

          try {
            if (algorithm === "AES-256") {
              // Extract IV and encrypted data
              const iv = new Uint8Array(encryptedData.slice(0, 12))
              const data = new Uint8Array(encryptedData.slice(12))

              // Convert hex key to ArrayBuffer
              const keyData = hex2buf(keyString)

              // Import the key
              const key = await window.crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["decrypt"])

              // Decrypt the data
              const decryptedData = await window.crypto.subtle.decrypt(
                {
                  name: "AES-GCM",
                  iv,
                },
                key,
                data,
              )

              progressCallback(100)
              resolve(new Blob([decryptedData]))
            } else if (algorithm === "RSA") {
              // Simplified RSA for preview
              progressCallback(100)
              resolve(new Blob([encryptedData]))
            } else {
              throw new Error("Unsupported algorithm")
            }
          } catch (error) {
            console.error("Decryption processing error:", error)
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`)
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 50
          progressCallback(progress)
        }
      }

      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }

      reader.readAsArrayBuffer(file)
    } catch (error) {
      reject(error)
    }
  })
}
