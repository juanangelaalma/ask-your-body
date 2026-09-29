# Product Requirement Document
## Ask Your Body

**Version:** 0.1 — MVP  
**Product Type:** AI-powered interactive 3D anatomy experience  
**Platform:** Web  
**Base Project:** Human Atlas / BodyParts3D  
**Primary Mode:** Conversational + interactive 3D exploration

---

# 1. Product Overview

**Ask Your Body** adalah aplikasi edukasi tubuh manusia berbasis AI yang memungkinkan pengguna bertanya menggunakan bahasa natural dan mendapatkan jawaban melalui kombinasi:

- conversational explanation,
- interactive 3D anatomy,
- automatic camera movement,
- anatomical structure highlighting,
- layer visibility,
- structure isolation,
- dan step-by-step visual storytelling.

Berbeda dengan anatomy viewer tradisional yang mengharuskan pengguna mengetahui organ atau struktur apa yang ingin dicari, Ask Your Body dimulai dari **pertanyaan manusia**.

Contoh:

> "Kenapa setelah lari napas saya jadi cepat?"

AI tidak hanya menjawab dalam bentuk teks.

Aplikasi secara otomatis:

1. menyorot paru-paru,
2. melakukan zoom ke thoracic cavity,
3. menunjukkan diaphragm,
4. beralih ke jantung,
5. menunjukkan hubungan kerja paru-paru dan cardiovascular system,
6. menjelaskan proses tersebut dalam bahasa sederhana.

Dengan demikian:

**Human Atlas menjadi visual executor.**

Sedangkan AI menjadi:

**Interpreter + Planner + Narrator.**

---

# 2. Product Vision

Membuat cara memahami tubuh manusia terasa seperti:

> "berbicara langsung dengan tubuh manusia."

Bukan:

> search anatomy → pilih organ → baca artikel.

Tetapi:

> Ask → Explore → Understand.

---

# 3. Problem

Aplikasi anatomi yang ada umumnya memiliki pendekatan:

```text
Anatomical Structure
        ↓
Select Structure
        ↓
Read Description
```

Pendekatan tersebut mengasumsikan pengguna sudah mengetahui istilah anatomi yang ingin dicari.

Padahal pengguna awam lebih sering memiliki pertanyaan seperti:

- Kenapa jantung berdetak lebih cepat ketika olahraga?
- Kenapa tangan bisa kesemutan?
- Apa yang terjadi ketika kita menahan napas?
- Apa yang terjadi dalam tubuh ketika kita tidur?
- Kenapa lutut bekerja keras ketika naik tangga?
- Apa yang terjadi ketika kita makan?
- Bagaimana darah sampai ke otak?
- Apa yang terjadi ketika kita berlari 10 km?

Knowledge gap-nya adalah:

```text
Natural Human Question

        ↓

Anatomical Knowledge
```

Ask Your Body menjembatani gap tersebut menggunakan AI.

---

# 4. Product Principle

Produk memiliki empat prinsip utama.

## 4.1 Visual First

AI harus menggunakan visual jika visual tersebut membantu penjelasan.

Text bukan output utama.

Output utama adalah:

```text
Explanation
+
3D State
+
Camera
+
Highlight
+
Sequence
```

---

## 4.2 AI Does Not Control Three.js Directly

LLM tidak boleh menghasilkan:

```text
camera.position.x = 1.38
camera.position.y = 2.71
```

LLM hanya boleh menghasilkan **semantic commands**.

Contoh:

```json
{
  "action": "focus",
  "target": "heart"
}
```

Scene engine menentukan implementasi Three.js.

Tujuannya:

- deterministic,
- safe,
- testable,
- model agnostic,
- mudah di-debug.

---

## 4.3 Anatomy Must Be Grounded

AI tidak boleh mengarang struktur anatomi.

Semua structure yang digunakan harus berasal dari **Anatomy Registry** milik aplikasi.

```text
LLM
 ↓
Structure Resolver
 ↓
Known Anatomy ID
 ↓
Scene Executor
```

---

## 4.4 Education, Not Diagnosis

Ask Your Body adalah aplikasi edukasi.

Produk tidak boleh memosisikan dirinya sebagai:

- diagnostic tool,
- treatment recommendation engine,
- emergency assessment system,
- surgical planning software.

Pertanyaan medis dapat dijelaskan secara edukatif tanpa memberikan diagnosis personal.

---

# 5. Target Users

## Primary User

### Curious General User

Pengguna yang ingin memahami:

- bagaimana tubuh bekerja,
- efek olahraga,
- tidur,
- makanan,
- pernapasan,
- cedera umum,
- aktivitas tubuh sehari-hari.

Contoh:

> "Apa yang terjadi di tubuh saya setelah minum kopi?"

---

## Secondary User

### Students

- SMA
- mahasiswa keperawatan
- mahasiswa fisioterapi
- mahasiswa kedokteran tahap awal
- biology learners

---

## Future User

### Fitness / Sports Users

Contoh:

> "Otot apa yang bekerja saat badminton smash?"

---

# 6. Core Experience

Landing page memiliki satu fokus utama.

```text
────────────────────────────────────

        [ HUMAN BODY 3D ]



     Ask anything about your body

┌────────────────────────────────────┐
│ What happens when I run 10 km?    │
└────────────────────────────────────┘


Try:
[ Why do we breathe? ]
[ How does digestion work? ]
[ What happens when we sleep? ]

────────────────────────────────────
```

User tidak perlu terlebih dahulu memahami anatomy explorer.

---

# 7. Primary User Flow

User memasukkan:

> "Apa yang terjadi ketika saya berlari?"

System melakukan:

```text
User Question

      ↓

Intent Analyzer

      ↓

Knowledge / Anatomy Retrieval

      ↓

Anatomy Resolver

      ↓

Explanation Planner

      ↓

Scene Plan

      ↓

Scene Executor

      ↓

Narrative + 3D Animation
```

---

# 8. Example Experience

User:

> What happens inside my body when I run?

AI menghasilkan journey:

### Scene 1

**Heart**

Camera zoom ke thoracic cavity.

Heart highlighted.

Narration:

> Saat kamu mulai berlari, otot membutuhkan lebih banyak energi dan oksigen. Jantung meningkatkan jumlah darah yang dipompa.

---

### Scene 2

**Lungs**

Heart kembali normal.

Lungs highlighted.

Camera sedikit bergeser.

Narration:

> Paru-paru meningkatkan pertukaran oksigen agar kebutuhan tubuh terpenuhi.

---

### Scene 3

**Blood vessels**

Circulatory system muncul.

Narration:

> Darah membawa oksigen dari paru-paru menuju otot yang sedang bekerja.

---

### Scene 4

**Leg muscles**

Quadriceps + calf highlighted.

Narration:

> Otot kaki menggunakan oksigen dan energi tersebut untuk menghasilkan gerakan.

---

# 9. Core Features

## F1 — Ask Anything

User dapat mengirim pertanyaan natural language.

Support awal:

- English
- Bahasa Indonesia

Contoh:

> Why does my heart beat faster when I run?

> Bagaimana makanan bisa sampai ke lambung?

> Kenapa kita bernapas?

---

## F2 — AI Anatomy Planner

AI mengubah pertanyaan menjadi structured explanation plan.

Contoh:

```json
{
  "topic": "running physiology",
  "summary": "Running increases oxygen and energy demand.",
  "scenes": [
    {
      "title": "Heart",
      "structures": ["heart"],
      "actions": [
        {
          "type": "focus",
          "target": "heart"
        },
        {
          "type": "highlight",
          "target": "heart"
        }
      ],
      "narration": "Your heart beats faster..."
    }
  ]
}
```

---

# 10. Scene Action Language

Kita membuat abstraction layer bernama:

# Body Action Protocol

LLM tidak berinteraksi langsung dengan Three.js.

LLM hanya dapat menggunakan predefined actions.

---

## Supported Actions MVP

### focus

```json
{
  "type": "focus",
  "target": "heart"
}
```

Camera fokus pada struktur.

---

### highlight

```json
{
  "type": "highlight",
  "target": "heart"
}
```

Memberikan visual emphasis.

---

### isolate

```json
{
  "type": "isolate",
  "targets": [
    "heart",
    "lungs"
  ]
}
```

Hide struktur lain.

---

### show

```json
{
  "type": "show",
  "targets": [
    "heart"
  ]
}
```

---

### hide

```json
{
  "type": "hide",
  "targets": [
    "skin"
  ]
}
```

---

### show_system

```json
{
  "type": "show_system",
  "system": "circulatory"
}
```

---

### hide_system

```json
{
  "type": "hide_system",
  "system": "muscular"
}
```

---

### reset

```json
{
  "type": "reset"
}
```

Mengembalikan body ke default state.

---

### wait

```json
{
  "type": "wait",
  "duration": 1200
}
```

Digunakan untuk sequencing visual.

---

# 11. Scene Schema

Recommended schema:

```ts
type BodyJourney = {
  id: string;
  query: string;

  title: string;

  summary: string;

  scenes: BodyScene[];
};

type BodyScene = {
  id: string;

  title: string;

  narration: string;

  structures: AnatomyReference[];

  actions: BodyAction[];

  duration?: number;
};

type AnatomyReference = {
  conceptId: string;
  name: string;
};

type BodyAction =
  | FocusAction
  | HighlightAction
  | IsolateAction
  | ShowAction
  | HideAction
  | ShowSystemAction
  | HideSystemAction
  | ResetAction
  | WaitAction;
```

---

# 12. Anatomy Registry

Ini salah satu komponen terpenting.

Human Atlas memiliki ribuan structure.

Kita tidak mengirim seluruh anatomy catalog ke LLM setiap request.

Kita membuat:

```text
Anatomy Registry
```

Contoh:

```json
{
  "id": "FMA7088",
  "name": "Heart",
  "aliases": [
    "heart",
    "jantung"
  ],
  "system": "cardiovascular",
  "meshIds": [
    "bp3d_xxx"
  ]
}
```

---

# 13. Anatomy Search

Ketika Planner membutuhkan:

```text
heart
lungs
quadriceps
```

system melakukan:

```text
Planner

 ↓

Anatomy Search

 ↓

Candidate Structures

 ↓

Planner / Resolver

 ↓

Canonical IDs
```

Contoh:

```text
"heart"

↓

[
 Heart — FMA7088
 Wall of heart
 Left ventricle
 Right ventricle
]
```

Resolver memilih:

```text
FMA7088
```

---

# 14. Structure Resolver

LLM tidak diperbolehkan menggunakan structure yang belum tervalidasi.

Flow:

```text
LLM proposes concept

        ↓

Structure Resolver

        ↓

Anatomy Registry

        ↓

Exists?

 YES ─────────→ Scene Plan

 NO
 ↓

Fallback Search
```

Jika tetap tidak ditemukan:

```text
skip visual action
```

Bukan membuat anatomy ID palsu.

---

# 15. Architecture

Recommended architecture:

```text
                    ┌──────────────────┐
                    │       USER       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Chat / Query   │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Conversation Backend │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Intent Analyzer   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Anatomy Retriever  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │     AI Planner       │
                  │                      │
                  │ narrative + scenes   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Schema Validator   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Structure Resolver   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Scene Executor    │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Human Atlas Renderer │
                  │      Three.js        │
                  └──────────────────────┘
```

---

# 16. Frontend Architecture

Recommended:

```text
React
TypeScript
Three.js
Zustand
TanStack Query
shadcn/ui
```

Human Atlas existing renderer tetap dipertahankan sebisa mungkin.

Jangan rewrite renderer pada MVP.

---

## Main Application Layout

```text
┌────────────────────────────────────────────────────────────┐
│ Ask Your Body                                      Settings│
├─────────────────────────────────┬──────────────────────────┤
│                                 │                          │
│                                 │     Conversation         │
│                                 │                          │
│          3D BODY                │  AI explanation          │
│                                 │                          │
│                                 │  Scene timeline          │
│                                 │                          │
│                                 │                          │
├─────────────────────────────────┴──────────────────────────┤
│              Ask anything about your body...              │
└────────────────────────────────────────────────────────────┘
```

Desktop:

```text
3D: ~65%
Chat: ~35%
```

Mobile:

```text
3D Body

───────────────

Narration

───────────────

Chat input
```

---

# 17. Scene Store

Frontend memiliki global scene state.

Contoh:

```ts
interface BodySceneState {
  selectedStructures: string[];
  highlightedStructures: string[];
  hiddenStructures: string[];

  visibleSystems: string[];

  focusedStructure?: string;

  activeScene?: string;

  execute(action: BodyAction): Promise<void>;

  reset(): void;
}
```

---

# 18. Scene Executor

SceneExecutor menerjemahkan Body Action Protocol ke Human Atlas API.

Pseudo-code:

```ts
async function executeAction(action: BodyAction) {
  switch (action.type) {
    case "focus":
      return anatomy.focus(action.target);

    case "highlight":
      return anatomy.highlight(action.target);

    case "isolate":
      return anatomy.isolate(action.targets);

    case "show_system":
      return anatomy.showSystem(action.system);

    case "hide_system":
      return anatomy.hideSystem(action.system);

    case "reset":
      return anatomy.reset();
  }
}
```

AI tidak pernah menyentuh Three.js.

---

# 19. Scene Runner

Scene runner menjalankan action secara sequence.

```text
Scene

 ↓

Action 1
focus heart

 ↓

Action 2
highlight heart

 ↓

Narration

 ↓

Wait

 ↓

Next Scene
```

User dapat:

```text
← Previous
Pause
Next →
```

---

# 20. AI Architecture

Jangan menggunakan satu giant prompt.

Recommended architecture:

```text
User Question
     ↓
Query Understanding
     ↓
Anatomy Retrieval
     ↓
Journey Planner
     ↓
Schema Validation
     ↓
Narration
```

Untuk MVP, Query Understanding + Journey Planner masih bisa menggunakan **satu LLM request** apabila latency lebih penting.

Namun logical concern-nya tetap dipisahkan.

---

# 21. AI Input

Planner menerima:

```json
{
  "query": "What happens when I run?",
  "language": "en",
  "availableStructures": [
    {
      "id": "FMA7088",
      "name": "Heart"
    },
    {
      "id": "...",
      "name": "Lung"
    }
  ]
}
```

---

# 22. AI Output

LLM diwajibkan menggunakan structured output.

```json
{
  "title": "What happens when you run?",
  "summary": "Running increases energy and oxygen demand.",
  "scenes": [
    {
      "id": "scene-heart",
      "title": "Your heart works harder",
      "narration": "...",
      "structures": [
        {
          "conceptId": "FMA7088",
          "name": "Heart"
        }
      ],
      "actions": [
        {
          "type": "focus",
          "target": "FMA7088"
        },
        {
          "type": "highlight",
          "target": "FMA7088"
        }
      ]
    }
  ]
}
```

---

# 23. Knowledge Grounding

Untuk MVP jangan langsung membangun medical RAG system yang kompleks.

Gunakan dua source:

### Source A

Anatomy metadata dari Human Atlas.

### Source B

LLM knowledge untuk penjelasan fisiologi sederhana.

Kemudian fase berikutnya dapat menambahkan curated source seperti:

```text
OpenStax Anatomy & Physiology
NIH
MedlinePlus
NCBI
reputable medical textbooks
```

---

# 24. Conversation Context

System mempertahankan state conversation.

Contoh:

User:

> Why does my heart beat faster?

AI menjelaskan heart.

User:

> What about my lungs?

System mengetahui bahwa konteksnya masih:

```text
during exercise
```

Sehingga query internal:

```text
What happens to the lungs during exercise?
```

---

# 25. Follow-up Interaction

Setelah setiap journey:

```text
You may also want to explore:

[ What happens to your lungs? ]

[ Why do muscles get tired? ]

[ Where does energy come from? ]
```

Tujuannya membuat eksplorasi seperti knowledge graph.

---

# 26. Click Anatomy → Ask AI

Interaksi juga bisa berjalan dari arah sebaliknya.

User klik:

```text
Heart
```

Panel muncul:

```text
Heart

Ask about this structure

[ What does it do? ]
[ How does blood flow through it? ]
[ Why does heart rate increase? ]
```

Ini penting karena mempertahankan functionality Human Atlas asli.

---

# 27. Journey vs Chat

Kita bedakan dua mode response.

### Simple Answer

Jika pertanyaan:

> Apa nama tulang ini?

Tidak perlu membuat journey panjang.

Cukup:

```text
highlight → answer
```

---

### Guided Journey

Jika pertanyaan:

> Bagaimana makanan dicerna?

Maka:

```text
Mouth
 ↓
Esophagus
 ↓
Stomach
 ↓
Small intestine
 ↓
Large intestine
```

---

# 28. MVP Scope

MVP fokus hanya pada:

### Exploration

- anatomy viewer
- orbit
- zoom
- click structure
- search structure

### AI

- text question
- AI answer
- structured scene plan
- multi-scene journey

### Visual Actions

- focus
- highlight
- isolate
- show/hide
- system visibility
- reset

### Conversation

- contextual follow-up
- suggested questions

### Language

- English
- Bahasa Indonesia

---

# 29. Explicitly NOT MVP

Jangan implementasi dahulu:

- voice conversation
- text-to-speech
- diagnosis
- symptom checker
- user medical history
- health records
- augmented reality
- VR
- anatomy animation deformation
- blood flow simulation
- muscle contraction simulation
- organ animation
- pathology visualization
- female anatomy model
- personalized anatomy
- authentication
- subscription
- classroom dashboard
- multiplayer
- quizzes

Semua itu menarik tetapi akan memperlambat validasi core experience.

---

# 30. Key MVP Question

MVP sebenarnya hanya ingin menjawab satu pertanyaan:

> Apakah menjelaskan tubuh dengan AI yang secara otomatis mengendalikan 3D anatomy terasa jauh lebih mudah dipahami dibanding chatbot biasa?

Kalau jawabannya tidak, produk tidak perlu diperbesar.

---

# 31. Suggested MVP Demo Questions

Kita sebaiknya memastikan setidaknya 10 journey berikut bekerja sangat bagus.

### 1
What happens when I run?

### 2
How does breathing work?

### 3
How does blood circulate through the body?

### 4
What happens when I eat?

### 5
How does the heart work?

### 6
Why do we need lungs?

### 7
How does the brain control the body?

### 8
Why do muscles get tired?

### 9
What happens when I hold my breath?

### 10
What happens when I sleep?

Kalau 10 ini terasa magic, baru expand long-tail query.

---

# 32. Recommended Backend

Untuk speed development:

```text
Next.js / Node.js
      +
LLM Gateway
      +
PostgreSQL / Supabase
```

Tetapi karena existing Human Atlas adalah Vite React, MVP bahkan dapat dibuat sebagai:

```text
React / Vite
     ↓
API backend
     ↓
LLM
```

Tidak wajib migrasi langsung ke Next.js.

---

# 33. Suggested Project Structure

```text
src/

  anatomy/
    registry/
    search/
    resolver/

  viewer/
    renderer/
    camera/
    highlighting/
    visibility/

  ai/
    planner/
    prompts/
    schemas/

  journey/
    runner/
    executor/
    store/

  chat/
    components/
    hooks/

  api/
    client/

  shared/
    types/
```

---

# 34. Backend Structure

```text
server/

  routes/
    ask.ts

  ai/
    planner.ts
    prompts.ts

  anatomy/
    search.ts
    resolver.ts

  schemas/
    journey.ts

  safety/
    medical.ts
```

---

# 35. Suggested API

## POST /api/ask

Request:

```json
{
  "message": "What happens when I run?",
  "conversationId": "uuid"
}
```

Response:

```json
{
  "message": "Running causes several systems to work together...",
  "journey": {
    "title": "What happens when you run?",
    "scenes": []
  },
  "suggestions": [
    "Why does heart rate increase?",
    "Why do muscles get tired?"
  ]
}
```

---

# 36. Streaming Architecture

Ideal flow:

```text
User sends question

        ↓

AI starts streaming narration

        ↓

Journey metadata available

        ↓

Scene 1 begins

        ↓

remaining text continues
```

Tetapi MVP pertama sebaiknya:

```text
Request
 ↓
Complete structured response
 ↓
Execute journey
```

Lebih deterministic.

Streaming dapat ditambahkan setelah experience stabil.

---

# 37. Model Agnostic Layer

Karena AI hanya menghasilkan schema:

```text
BodyJourney
```

provider dapat diganti.

```text
OpenAI
Claude
Gemini
local model
etc
```

Semua wajib menghasilkan schema sama.

Pattern:

```text
Provider

 ↓

AI Adapter

 ↓

BodyJourneySchema

 ↓

Validator

 ↓

Executor
```

---

# 38. Validation

Gunakan schema validator seperti Zod.

```ts
const BodyActionSchema = z.discriminatedUnion("type", [
  FocusActionSchema,
  HighlightActionSchema,
  IsolateActionSchema,
  ShowActionSchema,
  HideActionSchema,
  ShowSystemSchema,
  HideSystemSchema,
  ResetSchema
]);
```

Tidak ada AI response yang dieksekusi sebelum lolos validator.

---

# 39. Fallback Strategy

Jika LLM menghasilkan:

```text
structure:
"pulmonary capillary network"
```

tetapi model tidak memiliki visual representation yang sesuai:

Resolver mencoba:

```text
pulmonary capillary network
 ↓
lung blood vessels
 ↓
lungs
```

Jika tetap tidak ditemukan:

```text
Narration remains
Visual action skipped
```

Jangan hallucinate mesh.

---

# 40. Camera Controller

AI hanya mengatakan:

```json
{
  "type": "focus",
  "target": "heart"
}
```

Camera Controller menghitung:

```text
mesh bounding box
 ↓
center
 ↓
camera distance
 ↓
optimal framing
 ↓
smooth interpolation
```

Contoh:

```ts
focusStructure(structure) {
  const bbox = getBoundingBox(structure);

  const center = bbox.getCenter();
  const size = bbox.getSize();

  cameraController.animateTo({
    target: center,
    distance: calculateDistance(size)
  });
}
```

---

# 41. Animation

Gunakan animation layer independen.

```text
Scene Command

 ↓

Animation Controller

 ├─ camera transition
 ├─ opacity transition
 ├─ highlight transition
 └─ explode transition
```

Tidak ada logic AI di sini.

---

# 42. Visual Highlight Strategy

MVP:

```text
selected structure
        ↓
emissive / color override
        ↓
slight glow
```

Structure lainnya:

```text
opacity 100%
```

Untuk focus mode:

```text
target       = 100%
context      = 15–30%
```

Sehingga anatomical context tetap terlihat.

---

# 43. Timeline

Guided journey memiliki timeline sederhana:

```text
● Heart
│
● Lungs
│
● Blood
│
● Muscles
```

User dapat memilih scene secara manual.

---

# 44. Chat ↔ Scene Synchronization

Setiap narration terkait scene tertentu.

Contoh:

```json
{
  "messageId": "m1",
  "sceneId": "heart"
}
```

Ketika user scroll ke paragraph "heart":

optional future:

```text
viewer automatically focuses heart
```

---

# 45. Suggested Data Tables

Jika menggunakan Supabase:

## conversations

```text
id
created_at
language
```

## messages

```text
id
conversation_id
role
content
journey_id
created_at
```

## journeys

```text
id
conversation_id
query
title
summary
plan_json
created_at
```

## journey_scenes

Optional.

Untuk MVP tidak harus dinormalisasi.

Bisa disimpan sebagai JSONB.

---

# 46. Anatomy Index

Tidak perlu database server untuk seluruh anatomy registry pada awalnya.

Bisa generate:

```text
anatomy-index.json
```

Saat build.

Contoh:

```json
[
  {
    "id": "FMA7088",
    "name": "Heart",
    "normalizedName": "heart",
    "system": "cardiovascular",
    "aliases": ["jantung"]
  }
]
```

---

# 47. Retrieval

Anatomy search MVP:

```text
exact match
+
alias match
+
fuzzy search
```

Tidak perlu vector DB.

Dengan hanya beberapa ribu konsep, local lexical/fuzzy search sudah cukup.

Future:

```text
semantic embedding search
```

---

# 48. Prompt Architecture

System Prompt Planner kurang lebih:

```text
You are an anatomy education journey planner.

Your task is to explain human anatomy by creating
a sequence of visual scenes.

You may ONLY reference structures supplied
in AVAILABLE_ANATOMY.

Never invent anatomical identifiers.

Use visual scenes only when they improve
understanding.

Keep each scene focused on one concept.

This application is educational and must not
provide personalized diagnosis.
```

Kemudian inject:

```text
USER QUESTION

AVAILABLE ANATOMY

CONVERSATION CONTEXT
```

---

# 49. Medical Safety

Karena produk membahas tubuh manusia, guardrail tetap perlu.

Jika user:

> Saya sakit dada dan sulit bernapas, kenapa?

Response jangan:

```text
You have...
```

Tetapi:

```text
Chest discomfort can involve several structures...
```

dan untuk indikasi kondisi serius:

```text
seek appropriate medical assistance
```

Kemudian visual masih bisa membantu menjelaskan anatomy secara umum.

---

# 50. Disclaimer

Minimal tampil di onboarding/about:

> Ask Your Body is designed for anatomy education and general informational purposes. It does not provide medical diagnoses or replace professional medical care.

---

# 51. Human Atlas Integration Strategy

Jangan fork lalu langsung mengacak seluruh codebase.

Pisahkan menjadi:

```text
Human Atlas Core

        ↓

Anatomy Adapter

        ↓

Ask Your Body
```

Buat API internal seperti:

```ts
interface AnatomyViewer {
  find(query: string): AnatomyStructure[];

  select(id: string): void;

  highlight(id: string): void;

  focus(id: string): Promise<void>;

  isolate(ids: string[]): void;

  show(ids: string[]): void;

  hide(ids: string[]): void;

  showSystem(id: string): void;

  hideSystem(id: string): void;

  reset(): void;
}
```

Jika upstream Human Atlas berubah, business logic Ask Your Body tidak ikut rusak.

---

# 52. Technical Boundary

Architecture final:

```text
                  AI DOMAIN

          User Question
               │
               ▼
           AI Planner
               │
               ▼
          BodyJourney
               │
────────────────────────────────────
             CONTRACT
────────────────────────────────────
               │
               ▼
          Scene Executor
               │
               ▼
         Anatomy Adapter
               │
               ▼
          Human Atlas
               │
               ▼
            Three.js

               3D DOMAIN
```

Boundary ini sangat penting.

---

# 53. Suggested Development Order

### Phase 1 — Anatomy Adapter

Target:

```text
focus("heart")
highlight("heart")
isolate(["heart"])
reset()
```

Semua harus bisa dipanggil programmatically.

---

### Phase 2 — Hardcoded Journey

Tanpa AI terlebih dahulu.

Hardcode:

```text
"What happens when I run?"
```

dengan scenes:

```text
Heart
Lungs
Leg muscles
```

Jika UX hardcoded saja belum terasa bagus, AI tidak akan memperbaikinya.

---

### Phase 3 — Journey Engine

Implement:

```text
BodyJourney JSON
     ↓
Scene Runner
     ↓
3D
```

---

### Phase 4 — AI Planner

Baru LLM menghasilkan BodyJourney.

---

### Phase 5 — Chat

Tambahkan:

```text
conversation
context
follow-up
suggestions
```

---

### Phase 6 — Polish

Tambahkan:

```text
camera transition
highlights
loading
scene timeline
mobile
```

---

# 54. MVP Acceptance Criteria

MVP dianggap berhasil jika user dapat:

1. membuka aplikasi,
2. melihat 3D human body,
3. mengetik pertanyaan,
4. mendapatkan explanation,
5. mendapatkan minimal satu anatomical structure yang relevan,
6. melihat camera bergerak otomatis,
7. melihat struktur highlighted,
8. menjalankan multi-scene explanation,
9. berpindah scene manual,
10. bertanya follow-up.

---

# 55. Technical Acceptance Criteria

### AI

95%+ response harus lolos schema validation.

### Anatomy

100% structure ID yang dikirim ke renderer harus berasal dari Anatomy Registry.

### Visual

Tidak boleh ada:

```text
LLM generated coordinates
```

### Failure

Jika AI gagal:

```text
viewer tetap usable
```

### Performance

Initial body asset boleh lazy-loaded.

Chat interface harus muncul lebih dahulu jika asset masih loading.

---

# 56. Performance Strategy

Human Atlas sendiri menggunakan geometry batching agar ribuan bagian tubuh tidak menghasilkan ribuan draw calls. Geometry browser-nya sekitar puluhan MB.

Maka lakukan:

```text
App shell
 ↓
Chat UI
 ↓
Load anatomy metadata
 ↓
Lazy load geometry
 ↓
Initialize renderer
```

Jangan:

```text
download body
 ↓
baru tampil UI
```

---

# 57. Caching

Cache beberapa hal:

```text
anatomy-index.json
3D assets
known journeys
LLM responses
```

Pertanyaan umum:

```text
How does breathing work?
How does digestion work?
How does the heart work?
```

dapat di-cache.

---

# 58. Observability

Log:

```text
query
resolved structures
journey
invalid actions
missing anatomy
generation latency
scene execution error
```

Metric penting:

```text
Journey generation success
Structure resolution success
Average scenes/query
Skipped visual action
Time to first scene
```

---

# 59. Product Metrics

Jangan hanya ukur chat count.

Metric penting:

### North Star

**Completed Guided Journeys**

Supporting metric:

```text
questions/session
scenes viewed
scene completion
follow-up rate
structure interaction rate
journey replay rate
```

---

# 60. Future — Body Stories

Curated journey.

Contoh:

```text
Journey of Oxygen

Nose
 ↓
Trachea
 ↓
Lungs
 ↓
Heart
 ↓
Blood
 ↓
Muscle
```

---

# 61. Future — Voice Mode

User:

> Hey Body, what happens when I hold my breath?

AI berbicara sambil anatomy bergerak.

Ini berpotensi menjadi salah satu killer experience.

---

# 62. Future — Time Simulation

Pertanyaan:

> What happens after eating?

Timeline:

```text
0 min
Mouth

1 min
Esophagus

5 min
Stomach

1–4 hours
Small intestine
```

---

# 63. Future — Sports Mode

Contoh:

> What happens when I smash a badminton shuttle?

AI menjelaskan:

```text
Shoulder
 ↓
Rotator cuff
 ↓
Triceps
 ↓
Forearm
 ↓
Wrist
```

---

# 64. Future — Education Mode

Teacher dapat memilih:

```text
Teach me the cardiovascular system
```

Kemudian AI menghasilkan lesson:

```text
Heart
 ↓
Arteries
 ↓
Veins
 ↓
Lungs
 ↓
Quiz
```

---

# 65. Future — Learning Memory

System memahami apa yang sudah dipelajari user.

```text
You already explored:

✓ Heart
✓ Lungs
✓ Digestive System

Next:
→ Nervous System
```

---

# 66. Future — Visual Quiz

AI:

> Which structure carries air toward the lungs?

Body muncul.

User klik structure.

```text
Correct — Trachea
```

---

# 67. Future — Journey Builder

Teacher/content creator dapat membuat journey manual.

```text
Scene 1
Heart

Scene 2
Aorta

Scene 3
Brain
```

Kemudian share:

```text
askyourbody.app/journey/blood-to-brain
```

---

# 68. Licensing Requirement

Code asli Human Atlas menggunakan MIT License.

Anatomy dataset BodyParts3D menggunakan CC BY 4.0.

Karena itu aplikasi wajib mempertahankan attribution terhadap anatomy dataset ketika data tersebut didistribusikan.

Tambahkan halaman:

```text
/about/attribution
```

atau:

```text
Credits & Anatomy Data
```

---

# 69. Product Positioning

Jangan positioning sebagai:

> AI Anatomy Viewer

Terlalu generik.

Jangan juga:

> Medical AI

Akan membawa produk ke expectation diagnosis.

Positioning yang lebih tepat:

> Explore your body by asking questions.

Atau:

> Ask your body anything.

Atau:

> Understand your body from the inside.

---

# 70. Product Tagline

Recommended:

**Ask your body anything.**

Supporting line:

> Explore how your body works through AI-guided interactive 3D anatomy.

---

# 71. Core Product Moat

Moat bukan Human Atlas.

Karena Human Atlas open source.

Moat juga bukan LLM.

Moat sebenarnya ada pada:

```text
Question
   ↓
Understanding
   ↓
Anatomy Retrieval
   ↓
Visual Story Planning
   ↓
Deterministic 3D Execution
```

Secara khusus:

**AI-to-Anatomy Visual Language**

atau Body Action Protocol yang kita bangun.

Semakin bagus mapping:

```text
human question
→ anatomy
→ visual explanation
```

semakin kuat produknya.

---

# 72. Final MVP Architecture

```text
                         USER
                           │
                           ▼
                 ┌─────────────────┐
                 │ Conversational UI│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    /api/ask     │
                 └────────┬────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       Anatomy Search            Conversation
              │                    Context
              └───────────┬───────────┘
                          ▼
                 ┌─────────────────┐
                 │   LLM Planner   │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ BodyJourney JSON│
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Zod Validation  │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │Structure Resolver│
                 └────────┬────────┘
                          ▼
──────────────────── FRONTEND ────────────────────
                          │
                          ▼
                 ┌─────────────────┐
                 │  Journey Runner │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Scene Executor  │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Anatomy Adapter │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │  Human Atlas    │
                 │    Three.js     │
                 └─────────────────┘
```

---

# 73. Most Important Engineering Rule

**LLM menjelaskan apa yang ingin divisualisasikan. Renderer menentukan bagaimana visualisasi dilakukan.**

Bukan:

```text
LLM
 ↓
Three.js
```

Tetapi:

```text
LLM
 ↓
Semantic Scene Plan
 ↓
Validator
 ↓
Scene Engine
 ↓
Human Atlas
```

Dengan pola ini, Ask Your Body tetap:

- deterministic,
- provider agnostic,
- testable,
- maintainable,
- dan jauh lebih sulit rusak ketika model LLM diganti.
