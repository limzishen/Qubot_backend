// src/config/supaClient.js
const { createClient } = require('@supabase/supabase-js');
const { JwksClient } = require('jwks-rsa');

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'UNDEFINED');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'SET' : 'UNDEFINED');
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables! Check .env file.');
  console.error('Current values:');
  console.error('  SUPABASE_URL:', supabaseUrl);
  console.error('  SUPABASE_ANON_KEY:', supabaseAnonKey);
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey);
  process.exit(1);
}

// Initialize Supabase Admin Client (used for secure operations like fetching user details)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Configure JWKS client for JWT verification
const jwksClient = new JwksClient({
  jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

// Helper function to get the public key for JWT verification
function getSigningKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseAdmin, // Export the admin client
  getSigningKey, // Export the key retrieval function for JWT verification
};