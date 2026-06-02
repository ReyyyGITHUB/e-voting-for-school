# SMKN 8 Semarang Design System

## Overview

Design System resmi untuk website SMKN 8 Semarang.

Tujuan:

* Konsistensi UI
* Mempermudah pengembangan frontend
* Mempermudah kolaborasi antara UI/UX Designer dan Developer
* Menjaga identitas visual sekolah

---

# Brand Identity

## Brand Personality

* Modern
* Professional
* Educational
* Technology-Oriented
* Friendly
* Trustworthy

## Design Principles

### 1. Clarity First

Informasi harus mudah dibaca dan dipahami.

### 2. Consistency

Seluruh komponen menggunakan token yang sama.

### 3. Accessibility

Kontras warna dan ukuran teks harus nyaman digunakan.

### 4. Responsive

Mendukung Mobile, Tablet, dan Desktop.

---

# Color System

## Primary

| Token       | Value   |
| ----------- | ------- |
| primary-50  | #EAF7FF |
| primary-100 | #D8F0FF |
| primary-500 | #4EA7E8 |
| primary-600 | #2D89D0 |
| primary-700 | #176BB0 |
| primary-900 | #0A3E6A |

### Usage

* Navbar
* Hero Section
* Primary Button
* Active State
* Links

---

## Secondary

| Token         | Value   |
| ------------- | ------- |
| secondary-500 | #FFD600 |
| secondary-600 | #EAB308 |

### Usage

* CTA Button
* Highlight
* Achievement Section

---

## Accent

| Token      | Value   |
| ---------- | ------- |
| accent-red | #EF4444 |

### Usage

* Alerts
* Notifications
* Important Information

---

## Neutral

| Token    | Value   |
| -------- | ------- |
| gray-50  | #F9FAFB |
| gray-100 | #F3F4F6 |
| gray-200 | #E5E7EB |
| gray-500 | #6B7280 |
| gray-700 | #374151 |
| gray-900 | #111827 |

---

# Typography

## Font Family

### Heading

Poppins

### Body

Inter

---

## Font Scale

| Element | Size |
| ------- | ---- |
| H1      | 48px |
| H2      | 36px |
| H3      | 30px |
| H4      | 24px |
| H5      | 20px |
| Body    | 16px |
| Small   | 14px |
| Caption | 12px |

---

# Layout Grid

## Desktop

* Container Width: 1280px
* Columns: 12
* Gutter: 24px

## Tablet

* Container Width: 768px
* Columns: 8
* Gutter: 20px

## Mobile

* Container Width: 100%
* Columns: 4
* Gutter: 16px

---

# Spacing System

| Token    | Value |
| -------- | ----- |
| space-1  | 4px   |
| space-2  | 8px   |
| space-3  | 12px  |
| space-4  | 16px  |
| space-5  | 24px  |
| space-6  | 32px  |
| space-7  | 48px  |
| space-8  | 64px  |
| space-9  | 96px  |
| space-10 | 128px |

---

# Border Radius

| Token     | Value |
| --------- | ----- |
| radius-sm | 8px   |
| radius-md | 12px  |
| radius-lg | 16px  |
| radius-xl | 24px  |

---

# Elevation

## Shadow Small

0 1px 2px rgba(0,0,0,.05)

## Shadow Medium

0 4px 10px rgba(0,0,0,.08)

## Shadow Large

0 12px 24px rgba(0,0,0,.12)

---

# Components

## Primary Button

### Style

Background: primary-600

Text: white

Radius: radius-md

Height: 48px

### States

* Default
* Hover
* Active
* Disabled

---

## Secondary Button

### Style

Background: secondary-500

Text: primary-900

Radius: radius-md

---

## Card

### Usage

* Jurusan
* Berita
* Prestasi
* Event
* Guru

### Style

Background: white

Radius: radius-lg

Shadow: medium

Padding: 24px

---

## Badge

### Usage

* Jurusan
* Status
* Kategori

### Style

Background: primary-100

Text: primary-700

Radius: 999px

---

# Iconography

Style:

* Outline
* Rounded
* Consistent Stroke

Recommended:

* Lucide Icons
* Heroicons

---

# Section Patterns

## Hero

Background:

Linear Gradient

primary-500 → primary-700

CTA:

* Daftar Sekarang
* Lihat Jurusan

---

## Jurusan Section

Grid Layout

Desktop: 3-5 Columns

Mobile: 1 Column

---

## Statistics Section

Display:

* Total Siswa
* Total Guru
* Prestasi
* Mitra Industri

---

## News Section

Card Layout

Image

Category

Title

Date

Read More

---

# Motion

## Duration

Fast: 150ms

Normal: 250ms

Slow: 400ms

## Easing

ease-out

---

# Accessibility

Minimum Contrast Ratio:

4.5:1

Minimum Touch Area:

44px x 44px

Keyboard Navigation:

Required

Focus State:

Visible

---

# Tailwind Mapping

colors:
primary:
50: '#EAF7FF'
100: '#D8F0FF'
500: '#4EA7E8'
600: '#2D89D0'
700: '#176BB0'
900: '#0A3E6A'

secondary:
500: '#FFD600'
600: '#EAB308'

accent:
red: '#EF4444'

fontFamily:
heading: ['Poppins']
body: ['Inter']

borderRadius:
sm: 8px
md: 12px
lg: 16px
xl: 24px
