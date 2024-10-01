export type MessageT = {
  msgId: string;
  userId: string;
  chatId: string;
  text: string;
  sender: string;
  moduleId: string;
  moduleTitle?: string;
  createdAt: string;
  sequence: number;
};

export interface IPromptContext {
  data: MessageT[];
  chatId: string;
  prompt: string;
  isLoading: boolean;
  setData: (data: any) => void;
  moduleList: string[];
  currentModuleId: string;
}
