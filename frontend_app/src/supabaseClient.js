import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://jbiwztlpxvwthdmpnrqv.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaXd6dGxweHZ3dGhkbXBucnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjA2MTIsImV4cCI6MjA2NzczNjYxMn0.ad4uDFlf5P93D-AzijiqQNR-8y5J5jlyWogO8ZrW6Fw';

// PUBLIC_INTERFACE
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
