
export enum MessageSender {
  USER,
  AI,
}

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  sources?: Source[];
  isThinking?: boolean;
}
