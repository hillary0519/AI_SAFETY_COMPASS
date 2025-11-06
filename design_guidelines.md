# Design Guidelines: 제조업 안전작업허가서 AI 시스템

## Design Approach
**Selected System:** Material Design with Fluent influences  
**Rationale:** Enterprise productivity tool requiring clarity, excellent form design patterns, and professional trustworthiness for safety-critical manufacturing environments.

**Design Principles:**
- Clarity over decoration: Information hierarchy must be immediately scannable
- Professional authority: Design conveys expertise and reliability
- Efficient workflow: Minimize cognitive load for rapid permit generation
- Korean-first typography: Optimized for Hangul readability

---

## Typography

**Font Stack:**
- Primary (Korean): 'Pretendard Variable', 'Noto Sans KR', sans-serif (via CDN)
- Secondary (English/Numbers): 'Inter', sans-serif

**Hierarchy:**
- Page Title: text-3xl font-bold (안전작업허가서 생성 시스템)
- Section Headers: text-xl font-semibold 
- Form Labels: text-sm font-medium text-gray-700
- Body/Input Text: text-base font-normal
- Helper Text: text-sm text-gray-500
- Risk Assessment Values: text-2xl font-bold (numeric prominence)

---

## Layout System

**Spacing Primitives:** Use Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-6, p-8
- Section gaps: gap-6, gap-8
- Form field spacing: space-y-4
- Card spacing: p-6

**Container Strategy:**
- Max-width: max-w-5xl mx-auto (optimal for forms + generated content)
- Two-column layout on desktop (lg:grid-cols-2): Input form left, AI output right
- Single column on mobile: Stack input above output

---

## Component Library

### Core Layout Components

**1. Header Bar**
- Full-width with subtle border-b
- Left: Logo/Title with safety icon (from Heroicons)
- Right: Language toggle (KR/EN) + Settings icon
- Height: h-16, px-6

**2. Main Container**
- Two-panel desktop layout: 입력 폼 (Input) | 생성 결과 (Output)
- Cards with elevated shadow: shadow-lg rounded-lg
- Sticky positioning for output panel: sticky top-4

### Form Components

**Input Fields:**
- Label above input: block mb-2
- Full-width inputs with border: border-2 rounded-md px-4 py-3
- Focus states: Crisp outline, no color changes
- Required indicators: Asterisk (*) in label

**Input Types:**
- 작업유형: Dropdown select with chevron icon
- 작업지역/장소/설비명: Text inputs
- 작업자명: Text input with person icon prefix
- 작업기간: Date range picker (두 개의 date inputs)
- 작업내용: Textarea, min-h-32

**Primary CTA:**
- "안전작업허가서 생성" button
- Full-width below form: w-full py-4
- Prominent size with icon: text-lg with document-plus icon
- Position: Sticky at form bottom

### Output Display Components

**Section Cards:**
- Each output section in separate card with rounded-lg border
- Section header with icon (from Heroicons): wrench, exclamation-triangle, shield-check
- Numbered lists with circle bullets
- Checkboxes for 안전조치 section: Interactive with check states

**위험성평가 Display:**
- 4 metric cards in grid-cols-2 lg:grid-cols-4
- Each metric: Number (large, bold) + Label (small, below)
- Severity indicator bar below each metric (1-5 scale visualization)
- 종합위험도: Highlighted card with subtle accent background

**Checklist Items:**
- Custom checkboxes with rounded corners
- Larger touch targets: p-3
- Checkmark icon appears on selection
- Strikethrough text when checked

### Action Bar (Top of Output)

**Export Controls:**
- PDF 다운로드 button with download icon
- 초기화 (Reset) button, secondary style
- 복사 (Copy) button for text sharing
- Horizontal layout with gap-3

---

## Navigation & Interaction

**No traditional navigation** - Single-purpose tool

**Workflow States:**
1. Empty state: Placeholder in output panel with illustration placeholder comment
2. Loading state: Skeleton screens during AI generation
3. Success state: Fully populated output with smooth fade-in
4. Error state: Alert banner at top with retry option

**Scrolling Behavior:**
- Output panel scrolls independently on desktop
- Smooth scroll to output section on mobile after generation

---

## Icons
**Library:** Heroicons (Outline style) via CDN  
**Usage:**
- Form fields: user, calendar, wrench, building-office
- Sections: clipboard-document-list, exclamation-triangle, shield-check, light-bulb
- Actions: arrow-down-tray (download), arrow-path (reset), clipboard (copy)

---

## Animations
**Minimal approach:**
- Fade-in only: Output cards appear with 300ms fade when generated
- No hover animations, no scroll triggers
- Loading spinner: Simple rotating circle during AI processing

---

## Images
**No images required** - This is a pure utility application focused on form inputs and structured text outputs. Professional icon usage provides sufficient visual support.