# Learning-NestJS

## 構築に必要なもの

- NestJS(Adapter: Fastify)
- DB => dev:SQLite, prod:未定
- Template => Handlebars(Hotwire(Turbo))
- Logger => pino, pino-http
- ORM => Prisma

## 設計

### 作るもの

簡単な StackOverflow に似せたフォーム

### 画面設計（仮）

- トップ画面: トップ & Questions リスト（'/'）
- Question 表示画面 1: Questions リスト（'/questions'）
- Question 作成画面 1: Question 作成入力フォーム（'/questions/ask'）
- Question 作成画面 2: Question 作成入力フォーム（'/questions/confirm'）
- Question 作成画面 3: Question 作成入力フォーム（'/questions/completed'）
- Questions 表示画面 1: Questions 表示画面（'/questions/:id'）
- 404 エラー画面
- その他エラー画面

### MVC 設計

#### app

- Controller / Service
  - Get('')
  - Get('/questions') => questions / findAll()
  - Get('/questions/ask')
  - Get('/questions/confirm')
  - Get('/questions/completed') => questions / create()
  - Get('/questions/:id/:title') => questions / findById()

#### question

- Service
  - findAll()
  - findById()
  - create()
  - patch() => 要検討
  - delete() => 要検討

### DB（Model）

```ts
model Question {
  id  String @id
  title String
  question String
}
```

### DTO

```ts
export class CreateQuestionDto {
  title: string;
  question: string;
}
```

## Prisma(SQLite)

```
yarn prisma migrate dev --name init
sqlite3 db/sqlitedb.db
.schema
```
