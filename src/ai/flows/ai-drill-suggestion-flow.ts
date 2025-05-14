'use server';
/**
 * @fileOverview AI-powered drill suggestion agent for soccer coaches.
 *
 * - suggestDrills - A function that suggests drills based on team and player statistics.
 * - SuggestDrillsInput - The input type for the suggestDrills function.
 * - SuggestDrillsOutput - The return type for the suggestDrills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDrillsInputSchema = z.object({
  teamName: z.string().describe('The name of the soccer team.'),
  teamStatistics: z.string().describe('Overall statistics for the team (e.g., average goals per game, pass accuracy).'),
  playerStatistics: z.string().describe('Statistics for individual players, including their positions, strengths, and weaknesses.'),
  focusArea: z.string().describe('The area of focus for the drills (e.g., passing, shooting, defense).'),
});
export type SuggestDrillsInput = z.infer<typeof SuggestDrillsInputSchema>;

const SuggestDrillsOutputSchema = z.object({
  drillSuggestions: z.string().describe('A list of suggested drills with descriptions, tailored to the team and focus area.'),
  workoutPlan: z.string().describe('A workout plan on how to implement the drills during the practice.'),
});
export type SuggestDrillsOutput = z.infer<typeof SuggestDrillsOutputSchema>;

export async function suggestDrills(input: SuggestDrillsInput): Promise<SuggestDrillsOutput> {
  return suggestDrillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDrillsPrompt',
  input: {schema: SuggestDrillsInputSchema},
  output: {schema: SuggestDrillsOutputSchema},
  prompt: `You are an expert soccer coach. Based on the team statistics, player statistics and focus area, suggest drills and a workout plan.

Team Name: {{{teamName}}}
Team Statistics: {{{teamStatistics}}}
Player Statistics: {{{playerStatistics}}}
Focus Area: {{{focusArea}}}

Consider all these factors and generate a list of drills that can improve the team's performance in the specified focus area.  Also, provide a workout plan, describing how to implement the drills during practice.
`,
});

const suggestDrillsFlow = ai.defineFlow(
  {
    name: 'suggestDrillsFlow',
    inputSchema: SuggestDrillsInputSchema,
    outputSchema: SuggestDrillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
