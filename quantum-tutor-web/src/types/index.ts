export type ModuleT = {
  moduleId: string;
  status: boolean;
  message: Array<MessageT>;
};

export type MessageT = {
  msgId: string;
  chatId: string;
  text: string;
  sender: string;
  moduleId: string;
  createdAt: string;
  sequence: number;
};

export type DataT = { module: ModuleT } | { message: MessageT };

export interface IPromptContext {
  data: DataT[];
  chatId: string;
  prompt: string;
  isLoading: boolean;
}
