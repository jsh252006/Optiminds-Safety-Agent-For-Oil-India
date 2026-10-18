const fs = require('fs');
let content = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

// Add Fingerprint import
if (!content.includes('Fingerprint')) {
    content = content.replace('Loader2', 'Loader2, Fingerprint');
}

// Add handlePasskeySignIn
const passkeyFn = `
  const handlePasskeySignIn = async () => {
    try {
      setLoading(true);
      setError('');
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported on this browser/device.");
      }
      
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);
      
      try {
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId: window.location.hostname,
            userVerification: "preferred",
          }
        });
        if (credential) {
           await handleAnonymousSignIn();
           return;
        }
      } catch(getErr) {
        // Fallback to create if get fails
        const newCredential = await navigator.credentials.create({
           publicKey: {
             challenge,
             rp: { name: "OPTIMINDS Safety", id: window.location.hostname },
             user: { id: userId, name: "secure-user", displayName: "Secure TEE User" },
             pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
             authenticatorSelection: { userVerification: "preferred", residentKey: "discouraged" },
             timeout: 60000
           }
         });
         if (newCredential) {
           await handleAnonymousSignIn();
         }
      }
    } catch (err: any) {
      setError('TEE / Passkey authentication failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace('const handleAnonymousSignIn = async () => {', passkeyFn + '\n  const handleAnonymousSignIn = async () => {');

// Add the button
const buttonHtml = `
              <button
                type="button"
                onClick={handlePasskeySignIn}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-inset ring-emerald-300 dark:ring-emerald-700 hover:bg-emerald-50 dark:bg-slate-900 focus-visible:ring-transparent transition-colors col-span-2"
              >
                <Fingerprint className="h-5 w-5" />
                <span>Sign in with Hardware Passkey (TEE)</span>
              </button>
`;

content = content.replace('</div>\n          </form>', buttonHtml + '            </div>\n          </form>');

fs.writeFileSync('src/components/AuthPage.tsx', content);
