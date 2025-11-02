"use server";

import {
  analyzeCommentsForKeywords,
  AnalyzeCommentsForKeywordsInput,
  AnalyzeCommentsForKeywordsOutput,
} from "@/ai/flows/analyze-comments-for-keywords";
import {
  suggestKeywordsFromStream,
  SuggestKeywordsFromStreamInput,
  SuggestKeywordsFromStreamOutput,
} from "@/ai/flows/suggest-keywords-from-stream";

export async function analyzeCommentAction(
  input: AnalyzeCommentsForKeywordsInput
): Promise<AnalyzeCommentsForKeywordsOutput> {
  return analyzeCommentsForKeywords(input);
}

export async function suggestKeywordsAction(
  input: SuggestKeywordsFromStreamInput
): Promise<SuggestKeywordsFromStreamOutput> {
  return suggestKeywordsFromStream(input);
}
