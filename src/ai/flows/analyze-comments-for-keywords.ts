'use server';

/**
 * @fileOverview Analyzes comments from a YouTube Live stream for predefined keywords or phrases.
 *
 * - analyzeCommentsForKeywords - A function that analyzes comments for keywords.
 * - AnalyzeCommentsForKeywordsInput - The input type for the analyzeCommentsForKeywords function.
 * - AnalyzeCommentsForKeywordsOutput - The return type for the analyzeCommentsForKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommentsForKeywordsInputSchema = z.object({
  comment: z.string().describe('A comment from the YouTube Live stream.'),
  keywords: z
    .array(z.string())
    .describe('An array of predefined keywords or phrases to look for.'),
});
export type AnalyzeCommentsForKeywordsInput = z.infer<
  typeof AnalyzeCommentsForKeywordsInputSchema
>;

const AnalyzeCommentsForKeywordsOutputSchema = z.object({
  command: z
    .string()
    .optional()
    .describe(
      'The command to execute based on the identified keywords, or undefined if no keywords were found.'
    ),
  feedback: z
    .string()
    .optional()
    .describe(
      'The feedback to display in the UI, describing the command executed or why no command was executed.'
    ),
});
export type AnalyzeCommentsForKeywordsOutput = z.infer<
  typeof AnalyzeCommentsForKeywordsOutputSchema
>;

export async function analyzeCommentsForKeywords(
  input: AnalyzeCommentsForKeywordsInput
): Promise<AnalyzeCommentsForKeywordsOutput> {
  return analyzeCommentsForKeywordsFlow(input);
}

const analyzeCommentsForKeywordsPrompt = ai.definePrompt({
  name: 'analyzeCommentsForKeywordsPrompt',
  input: {schema: AnalyzeCommentsForKeywordsInputSchema},
  output: {schema: AnalyzeCommentsForKeywordsOutputSchema},
  prompt: `You are an AI assistant designed to analyze user comments from a YouTube Live stream and identify predefined keywords or phrases.

  Your task is to determine if the provided comment contains any of the specified keywords.

  If a keyword is found, you should identify the corresponding software input command and provide feedback for the user interface.

  If no keywords are found, indicate that no command should be executed and provide a message to the user interface.

  Comment: {{{comment}}}
  Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Output a JSON object with the following keys:
  - command: The software input command to execute (string, optional).
  - feedback: The feedback message to display in the UI (string, optional).

  If no keywords are found in the comment, set command to undefined and provide feedback indicating that no command was executed.

  Example 1: Comment: "increase brightness", Keywords: ["increase brightness", "decrease brightness"], Output: { command: "brightnessUp", feedback: "Increasing brightness" }
  Example 2: Comment: "random comment", Keywords: ["increase brightness", "decrease brightness"], Output: { command: undefined, feedback: "No command executed" }`,
});

const analyzeCommentsForKeywordsFlow = ai.defineFlow(
  {
    name: 'analyzeCommentsForKeywordsFlow',
    inputSchema: AnalyzeCommentsForKeywordsInputSchema,
    outputSchema: AnalyzeCommentsForKeywordsOutputSchema,
  },
  async input => {
    const {output} = await analyzeCommentsForKeywordsPrompt(input);
    return output!;
  }
);
