// Conectar sitio web con proyecto de Supabase
const SUPABASE_URL = 'https://cposxttngcfgdfhcodtg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tF5C3pGR-f1iRTeJVWZJ8w_THgEnNz1';

const clienteSupabase = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;