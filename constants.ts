
import { ChatMessage, MessageSender } from './types';

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    sender: MessageSender.AI,
    text: "Welcome to Ebo Search! I'm your AI assistant. Tell me what you'd like to do or find. For example, 'Find top-rated restaurants near me' or 'Summarize the latest news on AI development'."
  }
];

export const DEEP_ACTION_PROMPTS = [
    {
        title: "I want to read papers about GLI Agent.",
        subtitle: "Please help me find ten papers and summarize them into a report.",
        prompt: "Find 10 academic papers about 'GLI Agent', then provide a summary report of their key findings.",
    },
    {
        title: "Help me find 10 tech KOLs on Twitter with over 50k exposure in the past two weeks.",
        subtitle: "",
        prompt: "Identify 10 influential tech Key Opinion Leaders (KOLs) on Twitter who have had over 50,000 impressions in the last two weeks.",
    },
    {
        title: "Search for beginner home fat-burning workouts and weekly training frequency.",
        subtitle: "",
        prompt: "Find effective at-home fat-burning workouts suitable for beginners, and suggest a recommended weekly training frequency.",
    },
];
