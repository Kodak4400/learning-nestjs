export type QuestionId = {
  id: string;
};

export type QuestionBody = {
  title: string;
  body: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Question = QuestionId & QuestionBody;
