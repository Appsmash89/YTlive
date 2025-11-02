import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-keywords-from-stream.ts';
import '@/ai/flows/analyze-comments-for-keywords.ts';