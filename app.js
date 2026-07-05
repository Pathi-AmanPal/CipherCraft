/**
 * CipherCraft – Cryptographic Encryption Workstation
 * Developed by: Pathi Aman Pal
 * Cybersecurity Student | Chandigarh University
 *
 * Application Logic (app.js) — v1.1
 *
 * Changes in v1.1:
 *   - RSA key generation upgraded from 1024-bit to 2048-bit
 *   - Added Download Output functionality
 *   - Added Clear Workspace functionality
 *   - Added live Encryption Metrics panel
 *   - Enhanced educational sidebar with real-world usage examples
 */
// ─────────────────────────────────────────────
//  GLOBAL STATE
// ─────────────────────────────────────────────

// Tracks whether we are in 'encrypt' or 'decrypt' mode
let currentMode = 'encrypt';


// ─────────────────────────────────────────────
//  MODE SWITCHER (Encrypt / Decrypt tabs)
// ─────────────────────────────────────────────

/**
 * Switches the workspace between Encryption and Decryption modes.
 * Updates labels, the action button text, and clears previous output.
 */
function setMode(mode) {
  currentMode = mode;

  // Toggle active class on both tab buttons
  document.getElementById('tabEncrypt').classList.toggle('active', mode === 'encrypt');
  document.getElementById('tabDecrypt').classList.toggle('active', mode === 'decrypt');

  // Update the dynamic labels and the primary action button
  const labelInput  = document.getElementById('labelInputText');
  const labelOutput = document.getElementById('labelOutputText');
  const actionBtn   = document.getElementById('actionBtn');

  if (mode === 'encrypt') {
    labelInput.textContent  = 'Plaintext (Text to Encrypt)';
    labelOutput.textContent = 'Ciphertext (Encrypted Result)';
    actionBtn.innerHTML     = '<i class="ti ti-lock"></i> Encrypt Text';
  } else {
    labelInput.textContent  = 'Ciphertext (Text to Decrypt)';
    labelOutput.textContent = 'Plaintext (Decrypted Result)';
    actionBtn.innerHTML     = '<i class="ti ti-lock-open"></i> Decrypt Text';
  }

  // Clear previous output when switching modes to avoid confusion
  document.getElementById('outputText').value = '';
  resetMetrics();
}


// ─────────────────────────────────────────────
//  ALGORITHM SELECTOR HANDLER
// ─────────────────────────────────────────────

/**
 * Responds to changes in the algorithm dropdown.
 * Shows the correct key input section and updates the educational sidebar.
 */
function handleAlgorithmChange() {
  const algo = document.getElementById('algoSelect').value;

  // Hide all key config sections first
  document.getElementById('keyConfigSymmetric').style.display = 'none';
  document.getElementById('keyConfigRSA').style.display       = 'none';

  // Show only the relevant key config for the selected algorithm
  if (algo === 'AES' || algo === 'DES') {
    document.getElementById('keyConfigSymmetric').style.display = 'block';

    // Adjust the key label to be algorithm-specific
    const symmetricKeyLabel = document.getElementById('symmetricKeyLabel');
    if (algo === 'AES') {
      symmetricKeyLabel.textContent = 'Passphrase / Encryption Key (AES-256)';
    } else {
      symmetricKeyLabel.textContent = 'Encryption Key (DES — 56-bit, Legacy)';
    }
  } else if (algo === 'RSA') {
    document.getElementById('keyConfigRSA').style.display = 'block';
  }

  // Refresh the educational intelligence sidebar
  updateIntelSidebar(algo);

  // Highlight the active row in the comparison table
  updateComparisonHighlight(algo);
}


// ─────────────────────────────────────────────
//  COMPARISON TABLE HIGHLIGHT
// ─────────────────────────────────────────────

/**
 * Highlights the row in the Algorithm Comparison table that matches
 * the currently selected algorithm.
 */
function updateComparisonHighlight(algo) {
  const rowMap = { AES: 'cmpRowAES', DES: 'cmpRowDES', RSA: 'cmpRowRSA' };

  Object.values(rowMap).forEach(id => {
    document.getElementById(id).classList.remove('active-row');
  });

  if (rowMap[algo]) {
    document.getElementById(rowMap[algo]).classList.add('active-row');
  }
}


// ─────────────────────────────────────────────
//  REFERENCE DESK TAB SWITCHER
// ─────────────────────────────────────────────

/**
 * Switches the Reference Desk panel tabs.
 * Updates active class on buttons and showing/hiding content blocks.
 */
function switchRefTab(tabName) {
  const buttons = document.querySelectorAll('.ref-tab-btn');
  const contents = document.querySelectorAll('.ref-tab-content');

  const tabMap = {
    specs: 'refTabSpecs',
    compare: 'refTabCompare',
    implementation: 'refTabImplementation'
  };

  const activeId = tabMap[tabName];

  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabName)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  contents.forEach(content => {
    if (content.id === activeId) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}


// ─────────────────────────────────────────────
//  EDUCATIONAL SIDEBAR UPDATER
// ─────────────────────────────────────────────

/**
 * Populates the right-side educational panel (specs, description,
 * real-world usage, and Python code snippet) based on the selected algorithm.
 */
function updateIntelSidebar(algo) {
  const statusBadge  = document.getElementById('intelStatus');
  const typeEl       = document.getElementById('intelType');
  const sizeEl       = document.getElementById('intelSize');
  const speedEl      = document.getElementById('intelSpeed');
  const descEl       = document.getElementById('intelDesc');
  const usageTextEl  = document.getElementById('intelUsageText');
  const codeEl       = document.getElementById('intelCode');

  if (algo === 'AES') {
    statusBadge.textContent = 'Secure (Standard)';
    statusBadge.className   = 'status-badge secure';
    typeEl.textContent      = 'Symmetric (Same key)';
    sizeEl.textContent      = '128, 192, or 256 bits';
    speedEl.textContent     = 'Fast (Hardware Accelerated)';

    descEl.textContent = 'Advanced Encryption Standard (AES) is the global standard for symmetric encryption. It uses a substitution-permutation network across multiple rounds (10, 12, or 14 depending on key size) and is extremely resistant to brute force. Adopted by NIST in 2001, it replaced the vulnerable DES cipher and is now trusted by governments, financial institutions, and software developers worldwide.';

    usageTextEl.textContent = 'HTTPS/TLS, VPNs, Full-Disk Encryption (BitLocker, FileVault), Wi-Fi Security (WPA2/WPA3), Secure Messaging Apps (Signal, WhatsApp)';

    codeEl.textContent =
`# Python Example (PyCryptodome)
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

key = get_random_bytes(32)  # 256-bit key
cipher = AES.new(key, AES.MODE_GCM)
ciphertext, tag = cipher.encrypt_and_digest(b"Hello World")`;

  } else if (algo === 'DES') {
    statusBadge.textContent = 'Legacy / Vulnerable';
    statusBadge.className   = 'status-badge insecure';
    typeEl.textContent      = 'Symmetric (Same key)';
    sizeEl.textContent      = '56 bits (Weak)';
    speedEl.textContent     = 'Moderate';

    descEl.textContent = 'Data Encryption Standard (DES) is a block cipher developed in the 1970s using a Feistel network structure. Because its key size is only 56 bits (providing just 2^56 combinations), it can be brute-forced within hours using modern hardware. DES is officially deprecated and should never be used in new systems. It is included here strictly for historical and educational comparison purposes.';

    usageTextEl.textContent = 'Historical banking systems (pre-2000s), early ATM networks, legacy government communications. Now replaced by AES in all modern systems.';

    codeEl.textContent =
`# Python Example (PyCryptodome)
from Crypto.Cipher import DES

key = b'8bytesky'  # 56-bit equivalent key
cipher = DES.new(key, DES.MODE_ECB)
# Message length must be a multiple of 8 bytes (padding needed)
ciphertext = cipher.encrypt(b"SecretMg")`;

  } else if (algo === 'RSA') {
    statusBadge.textContent = 'Secure (Asymmetric)';
    statusBadge.className   = 'status-badge secure';
    typeEl.textContent      = 'Asymmetric (Dual keys)';
    sizeEl.textContent      = '2048, 3072, or 4096 bits';
    speedEl.textContent     = 'Slow (Math Intensive)';

    descEl.textContent = 'RSA (Rivest-Shamir-Adleman) is an asymmetric algorithm built on the mathematical difficulty of factoring very large semiprime numbers. A Public Key (shareable) is used to encrypt, and only the matching Private Key can decrypt. This eliminates the key-sharing problem of symmetric ciphers. RSA key sizes of 2048-bit or higher are considered secure for general use today.';

    usageTextEl.textContent = 'Digital Certificates (SSL/TLS), SSH Authentication, PGP Email Encryption, Secure Key Exchange, Code Signing, Digital Signatures';

    codeEl.textContent =
`# Python Example (Cryptography library)
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Generate a 2048-bit RSA key pair
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()

# Encrypt using the public key
ciphertext = public_key.encrypt(
    b"Hello RSA",
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)`;
  }
}


// ─────────────────────────────────────────────
//  RSA KEY GENERATION (2048-bit)
// ─────────────────────────────────────────────

/**
 * Generates a 2048-bit RSA keypair locally in the browser using JSEncrypt.
 * The keys are output in PEM format into the Public/Private Key textareas.
 *
 * Note: 2048-bit generation takes a few seconds in the browser — the button
 * shows a loading state to signal the user that work is happening.
 */
function generateRSAKeys() {
  const btn          = document.getElementById('btnGenerateRSA');
  const originalHTML = btn.innerHTML;

  // Show loading state while key generation runs
  btn.innerHTML = '<i class="ti ti-loader"></i> Generating 2048-bit keys...';
  btn.disabled  = true;

  // Use setTimeout so the browser renders the loading state before the
  // CPU-intensive key generation blocks the thread
  setTimeout(() => {
    try {
      const crypt = new JSEncrypt({ default_key_size: 2048 });

      // getKey() triggers the keypair generation synchronously
      crypt.getKey();

      const pubKey  = crypt.getPublicKey();
      const privKey = crypt.getPrivateKey();

      if (!pubKey || !privKey) {
        throw new Error('Key generation returned empty keys.');
      }

      document.getElementById('rsaPublicKey').value  = pubKey;
      document.getElementById('rsaPrivateKey').value = privKey;

      showToast('2048-bit RSA Keypair Generated Successfully!');
    } catch (err) {
      console.error(err);
      showToast('Key generation failed: ' + err.message, 'error');
    } finally {
      btn.innerHTML = originalHTML;
      btn.disabled  = false;
    }
  }, 80);
}


// ─────────────────────────────────────────────
//  CORE PROCESS — ENCRYPT / DECRYPT
// ─────────────────────────────────────────────

/**
 * Reads the input text and the current algorithm + key settings,
 * runs the appropriate encrypt or decrypt operation, and writes
 * the result to the output textarea. Also updates the metrics panel.
 */
function processText() {
  const algo       = document.getElementById('algoSelect').value;
  const inputText  = document.getElementById('inputText').value;
  const outputField = document.getElementById('outputText');

  if (!inputText.trim()) {
    showToast('Please enter input text.', 'warning');
    return;
  }

  outputField.value = '';

  try {

    // ── AES ──────────────────────────────────
    if (algo === 'AES') {
      const key = document.getElementById('symmetricKey').value;
      if (!key) { showToast('Please enter an encryption key.', 'warning'); return; }

      if (currentMode === 'encrypt') {
        // CryptoJS.AES.encrypt returns a CipherParams object; .toString() gives Base64
        outputField.value = CryptoJS.AES.encrypt(inputText, key).toString();
        showToast('Text encrypted with AES-256!');
      } else {
        const decrypted = CryptoJS.AES.decrypt(inputText, key);
        const plain     = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plain) throw new Error('Decryption failed. Wrong key or malformed ciphertext.');
        outputField.value = plain;
        showToast('Text decrypted successfully!');
      }

    // ── DES ──────────────────────────────────
    } else if (algo === 'DES') {
      const key = document.getElementById('symmetricKey').value;
      if (!key) { showToast('Please enter an encryption key.', 'warning'); return; }

      if (currentMode === 'encrypt') {
        outputField.value = CryptoJS.DES.encrypt(inputText, key).toString();
        showToast('Text encrypted with DES (56-bit)!');
      } else {
        const decrypted = CryptoJS.DES.decrypt(inputText, key);
        const plain     = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plain) throw new Error('Decryption failed. Wrong key or malformed ciphertext.');
        outputField.value = plain;
        showToast('Text decrypted successfully!');
      }

    // ── RSA ──────────────────────────────────
    } else if (algo === 'RSA') {
      if (currentMode === 'encrypt') {
        const pubKey = document.getElementById('rsaPublicKey').value;
        if (!pubKey.trim()) { showToast('Please enter the RSA Public Key.', 'warning'); return; }

        const crypt     = new JSEncrypt();
        crypt.setPublicKey(pubKey);
        const encrypted = crypt.encrypt(inputText);

        if (!encrypted) throw new Error('RSA Encryption failed. Check the public key format.');
        outputField.value = encrypted;
        showToast('Text encrypted with RSA!');

      } else {
        const privKey = document.getElementById('rsaPrivateKey').value;
        if (!privKey.trim()) { showToast('Please enter the RSA Private Key.', 'warning'); return; }

        const crypt     = new JSEncrypt();
        crypt.setPrivateKey(privKey);
        const decrypted = crypt.decrypt(inputText);

        if (!decrypted) throw new Error('RSA Decryption failed. Check private key or ciphertext.');
        outputField.value = decrypted;
        showToast('Text decrypted successfully!');
      }
    }

    // Update metrics panel after a successful operation
    updateMetrics(inputText, outputField.value, algo, currentMode);

  } catch (err) {
    console.error(err);
    showToast(err.message || 'Operation failed.', 'error');
    outputField.value = 'ERROR: ' + (err.message || 'Failed to process. Check your key inputs.');
  }
}


// ─────────────────────────────────────────────
//  COPY OUTPUT
// ─────────────────────────────────────────────

/**
 * Copies the current output textarea value to the system clipboard.
 */
function copyOutput() {
  const outputText = document.getElementById('outputText').value;

  if (!outputText || outputText.startsWith('ERROR:')) {
    showToast('Nothing to copy.', 'warning');
    return;
  }

  navigator.clipboard.writeText(outputText)
    .then(() => {
      showToast('Output copied to clipboard!');

      // Brief visual confirmation on the button
      const copyBtn      = document.getElementById('copyBtn');
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML  = '<i class="ti ti-check"></i> Copied!';
      setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
    })
    .catch(() => showToast('Failed to copy. Please copy manually.', 'error'));
}


// ─────────────────────────────────────────────
//  DOWNLOAD OUTPUT
// ─────────────────────────────────────────────

/**
 * Downloads the current output text as a .txt file.
 * The filename includes today's date for easy identification.
 *
 * Filename format: ciphercraft-output-yyyy-mm-dd.txt
 */
function downloadOutput() {
  const outputText = document.getElementById('outputText').value;

  if (!outputText || outputText.startsWith('ERROR:')) {
    showToast('No valid output to download.', 'warning');
    return;
  }

  // Build the date-stamped filename
  const today    = new Date();
  const yyyy     = today.getFullYear();
  const mm       = String(today.getMonth() + 1).padStart(2, '0');
  const dd       = String(today.getDate()).padStart(2, '0');
  const filename = `ciphercraft-output-${yyyy}-${mm}-${dd}.txt`;

  // Create a temporary invisible anchor to trigger the browser download
  const blob = new Blob([outputText], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = url;
  link.download = filename;
  link.click();

  // Release the object URL after the download is triggered
  URL.revokeObjectURL(url);

  showToast(`Downloaded as "${filename}"`);
}


// ─────────────────────────────────────────────
//  CLEAR WORKSPACE
// ─────────────────────────────────────────────

/**
 * Resets all input and output fields across the workspace,
 * including the symmetric key, and both RSA key fields.
 */
function clearWorkspace() {
  document.getElementById('inputText').value     = '';
  document.getElementById('outputText').value    = '';
  document.getElementById('symmetricKey').value  = '';
  document.getElementById('rsaPublicKey').value  = '';
  document.getElementById('rsaPrivateKey').value = '';

  // Also reset the metrics display
  resetMetrics();

  showToast('Workspace cleared.');
}


// ─────────────────────────────────────────────
//  ENCRYPTION METRICS PANEL
// ─────────────────────────────────────────────

/**
 * Updates the Encryption Metrics panel after each successful operation.
 *
 * @param {string} input     - The raw input text
 * @param {string} output    - The result text (cipher or plain)
 * @param {string} algo      - The algorithm name: 'AES', 'DES', or 'RSA'
 * @param {string} mode      - The operation mode: 'encrypt' or 'decrypt'
 */
function updateMetrics(input, output, algo, mode) {
  document.getElementById('metInputLen').textContent  = input.length  + ' characters';
  document.getElementById('metOutputLen').textContent = output.length + ' characters';
  document.getElementById('metAlgo').textContent      = algo;
  document.getElementById('metMode').textContent      = mode === 'encrypt' ? 'Encryption' : 'Decryption';
}

/**
 * Resets the metrics panel back to dashes.
 */
function resetMetrics() {
  ['metInputLen', 'metOutputLen', 'metAlgo', 'metMode'].forEach(id => {
    document.getElementById(id).textContent = '—';
  });
}


// ─────────────────────────────────────────────
//  TOAST NOTIFICATIONS
// ─────────────────────────────────────────────

/**
 * Shows a temporary notification toast at the bottom-right corner.
 * Auto-dismisses after 2.5 seconds.
 *
 * @param {string} message         - Text to display in the toast
 * @param {string} [type='success'] - 'success', 'warning', or 'error'
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toastNotification');
  const icon  = toast.querySelector('.toast-icon');

  document.getElementById('toastMsg').textContent = message;

  // Swap the icon and color to match the message type
  if (type === 'error') {
    icon.className        = 'ti ti-circle-x toast-icon';
    icon.style.color      = 'var(--status-insecure)';
  } else if (type === 'warning') {
    icon.className        = 'ti ti-alert-triangle toast-icon';
    icon.style.color      = 'var(--status-warning)';
  } else {
    icon.className        = 'ti ti-circle-check toast-icon';
    icon.style.color      = 'var(--status-secure)';
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}


// ─────────────────────────────────────────────
//  INITIALIZATION
// ─────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  // Populate the sidebar with the default algorithm (AES) on first load
  handleAlgorithmChange();
});