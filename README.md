# Infoboard for SillyTavern

A state-aware XML infoboard extension for **SillyTavern**.

It injects its own prompt, parses structured scene data from assistant replies, stores per-chat state, and renders a styled info panel directly under messages.

Clean, persistent, and built for roleplay.

---

## Features

- built-in prompt injection
- per-chat memory
- XML infoboard parsing
- NPC scene tracking
- relationship meters with **-100 to 100** range
- support for **positive and negative** affection / trust / love
- hidden NPC thoughts
- optional NSFW context
- RU / EN language switch
- multiple themes
- multiple bar styles
- full / compact / collapsed display modes
- hover effects for stat bars
- scene pulse summary
- export / import state
- custom CSS overrides
- raw XML hiding from visible messages

---

## Installation

Install it like a regular **SillyTavern third-party extension**.

Folder name: `SillyTavern-Infoboard`

After installation, reload extensions/resources and enable **Infoboard** in the Extensions menu.

---

## What it tracks

- time
- date
- weather
- location
- NPCs in scene
- NPC → user relationships
- NPC private thoughts
- optional NSFW context

---

## Relationship scale

Values use range: `-100 ... 0 ... 100`

- **Affection**
  - positive → affection
  - negative → aversion

- **Trust**
  - positive → trust
  - negative → distrust

- **Love**
  - positive → love
  - negative → hatred

---

## Display modes

Each infoboard message can be viewed in three modes:

- **Full** — full panel with sections and meters
- **Compact** — mini panel with short stat chips
- **Collapsed** — minimal `INFOBOARD` placeholder

---

## Settings

Infoboard includes:

- enable / disable toggle
- language switch
- theme selector
- bar style selector
- stat hover effects toggle
- scene pulse toggle
- hide raw XML
- show thoughts
- show NSFW
- reset state
- reprocess chat
- export / import state
- custom CSS overrides

---

## Custom CSS

You can override the design without editing extension files.

### Example

```css
.ib-board {
  border-radius: 20px;
}

.ib-theme-nocturne {
  --ib-bg-1: #101522;
  --ib-bg-2: #182033;
  --ib-bg-3: #0d1320;
}

.ib-bars-deep .ib-bar-love-pos {
  background: linear-gradient(90deg, #d08bff, #7c38ff);
}
