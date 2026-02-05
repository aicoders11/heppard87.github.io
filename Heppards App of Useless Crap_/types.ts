
export type MessageAuthor = 'user' | 'lumina';

export interface Message {
  author: MessageAuthor;
  content: string;
  image?: string;
}

export enum GameMode {
  Chat = 'Chat',
  VoiceChat = 'Voice Chat',
  DreamArchitect = 'Dream Architect',
  ColorMood = 'Color-Mood Game',
  InfiniteStory = 'Infinite Story RPG',
  SensoryMirror = 'The Sensory Mirror',
  UnsettlingSecret = 'The Unsettling Secret',
  BoredomBuster = 'The Boredom Button',
  DoodleFight = 'Doodle-Fight',
  ImageEdit = 'Image Edit',
  Fidgets = 'Sensory Fidgets',
}
