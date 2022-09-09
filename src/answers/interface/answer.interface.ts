export type AnswerId = {
  id: string;
};

export type AnswerBody = {
  body: string;
  questionId: string;
  createdAt: string;
  updatedAt: string;
};

export type Answer = AnswerId & AnswerBody;
