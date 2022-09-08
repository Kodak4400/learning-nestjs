export type QuestionId = {
  id: string;
};

export type QuestionBody = {
  title: string;
  question: string;
};

export type Question = QuestionId & QuestionBody;
