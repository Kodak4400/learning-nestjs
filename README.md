# Learning-NestJS

以下を使って、NestJS でなにか作る。。。

- NestJS(Adapter: Fastify)
- DB => dev:SQLite, prod:未定
- Template => Handlebars
- Logger => pino, pino-http
- ORM => Prisma

# 設計

## 作るもの

なんか、簡単なアンケートフォーム

## 構成

### 画面（仮）

- トップ画面: アンケートリスト（'/'）
- アンケート画面 1: アンケート入力フォーム（'/:id'）
- アンケート画面 2: アンケート入力確認画面（'/:id/confirm'）
- アンケート画面 3: アンケート完了画面（'/:id/completed'）
- アンケート画面 4: アンケート回答済み画面（'/:id/answered'）
- アンケート画面 5: アンケート期限切れ画面（'/:id/expired'）
- 404 エラー画面
- その他エラー画面

### アンケートフォームの内容

保留

### NestJS（仮）

Controller / Service / Module

- survey 　かなぁ、、、

#### survey

- Controller
  - Get('') => findAll()
  - Get(':id') => findById()
  - Post('') => create()
    // - Patch(':id') => 要検討
    // - Delete(':id') => 要検討
