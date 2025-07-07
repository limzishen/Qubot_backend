const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jepzprwhpuepgcwyozfj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log(supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;