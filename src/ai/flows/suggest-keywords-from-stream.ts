'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing YouTube Live stream comments
 * and suggesting new keywords to enhance command recognition in the software.
 *
 * @exports suggestKeywordsFromStream - Function to trigger the keyword suggestion flow.
 * @exports SuggestKeywordsFromStreamInput - Input type for the suggestKeywordsFromStream function.
 * @exports SuggestKeywordsFromStreamOutput - Output type for the suggestKeywordsFromStream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKeywordsFromStreamInputSchema = z.object({
  comments: z
    .string()
    .describe(
      'A string containing the concatenated comments from the YouTube Live stream.'
    ),
  existingKeywords: z
    .string()
    .describe('A comma separated string of the existing keywords being listened for.'),
});
export type SuggestKeywordsFromStreamInput = z.infer<
  typeof SuggestKeywordsFromStreamInputSchema
>;

const SuggestKeywordsFromStreamOutputSchema = z.object({
  suggestedKeywords: z
    .string()
    .describe(
      'A comma separated string of suggested keywords extracted from the comments.'
    ),
});
export type SuggestKeywordsFromStreamOutput = z.infer<
  typeof SuggestKeywordsFromStreamOutputSchema
>;

export async function suggestKeywordsFromStream(
  input: SuggestKeywordsFromStreamInput
): Promise<SuggestKeywordsFromStreamOutput> {
  return suggestKeywordsFromStreamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKeywordsFromStreamPrompt',
  input: {schema: SuggestKeywordsFromStreamInputSchema},
  output: {schema: SuggestKeywordsFromStreamOutputSchema},
  prompt: `You are an AI assistant designed to analyze user comments from a YouTube Live stream and suggest new keywords that could enhance command recognition for a software.

You are provided with the existing keywords and the stream of comments. Identify potential new keywords or phrases that users are employing in the comments which are not covered by the existing keywords.

Existing Keywords: {{{existingKeywords}}}

Comments: {{{comments}}}

Suggested Keywords: Give me a comma separated list of keywords. Do not respond with anything else.  It should only be a comma separated list of keywords.

Here are some examples.

Existing Keywords: up, down, left, right

Comments: move upwards, go down now, turn left please, right now!

Suggested Keywords: upwards, now, turn
`,
});

const suggestKeywordsFromStreamFlow = ai.defineFlow(
  {
    name: 'suggestKeywordsFromStreamFlow',
    inputSchema: SuggestKeywordsFromStreamInputSchema,
    outputSchema: SuggestKeywordsFromStreamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
