import * as forge from 'node-forge';

// PEM to DER
export async function pemToDer(file: File): Promise<Blob> {
  const text = await file.text();
  const pem = text.trim();
  
  // Check if it's a certificate or key
  if (pem.includes('BEGIN CERTIFICATE')) {
    const cert = forge.pki.certificateFromPem(pem);
    const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
    return new Blob([stringToArrayBuffer(der)], { type: 'application/x-x509-ca-cert' });
  } else if (pem.includes('BEGIN PRIVATE KEY') || pem.includes('BEGIN RSA PRIVATE KEY')) {
    const key = forge.pki.privateKeyFromPem(pem);
    const der = forge.asn1.toDer(forge.pki.privateKeyToAsn1(key)).getBytes();
    return new Blob([stringToArrayBuffer(der)], { type: 'application/pkcs8' });
  } else if (pem.includes('BEGIN PUBLIC KEY')) {
    const key = forge.pki.publicKeyFromPem(pem);
    const der = forge.asn1.toDer(forge.pki.publicKeyToAsn1(key)).getBytes();
    return new Blob([stringToArrayBuffer(der)], { type: 'application/x-spki' });
  }
  
  throw new Error('Unsupported PEM format');
}

// DER to PEM
export async function derToPem(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const der = arrayBufferToString(arrayBuffer);
  
  try {
    // Try as certificate
    const asn1 = forge.asn1.fromDer(der);
    const cert = forge.pki.certificateFromAsn1(asn1);
    const pem = forge.pki.certificateToPem(cert);
    return new Blob([pem], { type: 'application/x-pem-file' });
  } catch {
    try {
      // Try as private key
      const asn1 = forge.asn1.fromDer(der);
      const key = forge.pki.privateKeyFromAsn1(asn1);
      const pem = forge.pki.privateKeyToPem(key);
      return new Blob([pem], { type: 'application/x-pem-file' });
    } catch {
      throw new Error('Could not parse DER file');
    }
  }
}

// PEM to CRT (same as PEM, just different extension)
export async function pemToCrt(file: File): Promise<Blob> {
  const text = await file.text();
  return new Blob([text], { type: 'application/x-x509-ca-cert' });
}

// CRT to PEM
export async function crtToPem(file: File): Promise<Blob> {
  const text = await file.text();
  return new Blob([text], { type: 'application/x-pem-file' });
}

// CER to PEM (CER can be DER or PEM format)
export async function cerToPem(file: File): Promise<Blob> {
  const text = await file.text();
  
  // Check if already PEM format
  if (text.includes('BEGIN CERTIFICATE')) {
    return new Blob([text], { type: 'application/x-pem-file' });
  }
  
  // Otherwise treat as DER
  return await derToPem(file);
}

// PEM to CER
export async function pemToCer(file: File): Promise<Blob> {
  const text = await file.text();
  
  if (text.includes('BEGIN CERTIFICATE')) {
    const cert = forge.pki.certificateFromPem(text);
    const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
    return new Blob([stringToArrayBuffer(der)], { type: 'application/pkix-cert' });
  }
  
  throw new Error('Invalid PEM certificate');
}

// PFX/P12 to PEM
export async function pfxToPem(file: File, password: string = ''): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const p12Der = arrayBufferToString(arrayBuffer);
  const p12Asn1 = forge.asn1.fromDer(p12Der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
  
  let pemContent = '';
  
  // Extract certificate
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  if (certBags[forge.pki.oids.certBag]) {
    certBags[forge.pki.oids.certBag].forEach((bag: any) => {
      if (bag.cert) {
        pemContent += forge.pki.certificateToPem(bag.cert) + '\n';
      }
    });
  }
  
  // Extract private key
  const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  if (keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]) {
    keyBags[forge.pki.oids.pkcs8ShroudedKeyBag].forEach((bag: any) => {
      if (bag.key) {
        pemContent += forge.pki.privateKeyToPem(bag.key) + '\n';
      }
    });
  }
  
  return new Blob([pemContent], { type: 'application/x-pem-file' });
}

// PEM to PFX/P12
export async function pemToPfx(certFile: File, keyFile?: File, password: string = ''): Promise<Blob> {
  const certPem = await certFile.text();
  const cert = forge.pki.certificateFromPem(certPem);
  
  let privateKey: forge.pki.rsa.PrivateKey | null = null;
  
  if (keyFile) {
    const keyPem = await keyFile.text();
    privateKey = forge.pki.privateKeyFromPem(keyPem);
  } else if (certPem.includes('BEGIN PRIVATE KEY') || certPem.includes('BEGIN RSA PRIVATE KEY')) {
    // Key might be in same file as cert
    privateKey = forge.pki.privateKeyFromPem(certPem);
  }
  
  if (!privateKey) {
    throw new Error('Private key required for PFX conversion');
  }
  
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    privateKey,
    [cert],
    password,
    { algorithm: '3des' }
  );
  
  const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
  return new Blob([stringToArrayBuffer(p12Der)], { type: 'application/x-pkcs12' });
}

// P7B to PEM
export async function p7bToPem(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const p7bDer = arrayBufferToString(arrayBuffer);
  const p7Asn1 = forge.asn1.fromDer(p7bDer);
  const p7 = forge.pkcs7.messageFromAsn1(p7Asn1);
  
  let pemContent = '';
  
  if (p7.certificates) {
    p7.certificates.forEach((cert: any) => {
      pemContent += forge.pki.certificateToPem(cert) + '\n';
    });
  }
  
  return new Blob([pemContent], { type: 'application/x-pem-file' });
}

// PEM to P7B
export async function pemToP7b(file: File): Promise<Blob> {
  const text = await file.text();
  const certs: forge.pki.Certificate[] = [];
  
  // Extract all certificates from PEM
  const certMatches = text.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
  
  if (certMatches) {
    certMatches.forEach(certPem => {
      certs.push(forge.pki.certificateFromPem(certPem));
    });
  }
  
  const p7 = forge.pkcs7.createSignedData();
  certs.forEach(cert => p7.addCertificate(cert));
  
  const p7Asn1 = p7.toAsn1();
  const p7Der = forge.asn1.toDer(p7Asn1).getBytes();
  
  return new Blob([stringToArrayBuffer(p7Der)], { type: 'application/x-pkcs7-certificates' });
}

// Extract public key from certificate
export async function extractPublicKey(file: File): Promise<Blob> {
  const text = await file.text();
  
  if (text.includes('BEGIN CERTIFICATE')) {
    const cert = forge.pki.certificateFromPem(text);
    const publicKeyPem = forge.pki.publicKeyToPem(cert.publicKey);
    return new Blob([publicKeyPem], { type: 'application/x-pem-file' });
  }
  
  throw new Error('Invalid certificate file');
}

// View certificate info (returns JSON)
export async function viewCertificateInfo(file: File): Promise<string> {
  const text = await file.text();
  
  if (text.includes('BEGIN CERTIFICATE')) {
    const cert = forge.pki.certificateFromPem(text);
    
    const info = {
      version: cert.version,
      serialNumber: cert.serialNumber,
      subject: cert.subject.attributes.map(attr => ({
        name: attr.name,
        value: attr.value,
      })),
      issuer: cert.issuer.attributes.map(attr => ({
        name: attr.name,
        value: attr.value,
      })),
      validity: {
        notBefore: cert.validity.notBefore,
        notAfter: cert.validity.notAfter,
      },
      signatureAlgorithm: cert.signatureOid,
      publicKey: {
        algorithm: 'RSA',
        bitSize: (cert.publicKey as any).n?.bitLength() || 'Unknown',
      },
    };
    
    return JSON.stringify(info, null, 2);
  }
  
  throw new Error('Invalid certificate file');
}

// Helper functions
function stringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBufferToString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}
