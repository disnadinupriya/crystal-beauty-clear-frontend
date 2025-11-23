import { createClient } from "@supabase/supabase-js";

// ඔබේ Supabase URL සහ Key එක මෙතැනට දමන්න (Environment variables භාවිතා කිරීම වඩාත් සුදුසුයි)
const supabaseUrl = "https://guaxykwlwvybejqayzfg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXh5a3dsd3Z5YmVqcWF5emZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3OTMsImV4cCI6MjA2OTk5Mjc5M30.29sck266mcjaHW8OeJeGgbWcOVl88yu6CiF687Odi3k";

export const supabase = createClient(supabaseUrl, supabaseKey);