# Infoboard for SillyTavern

A state-aware XML infoboard extension for **SillyTavern**.

It injects a prompt, parses structured scene data from assistant replies, stores per-chat state, and renders a styled scene/relationship panel.

Built for roleplay, long scenes, and NPC-heavy chats.

---

## Features

- built-in prompt injection
- per-chat state memory
- XML infoboard parsing
- NPC scene tracking
- NPC mood and presence tags
- manual NPC pinning for crowded scenes
- relationship meters with **-100 to 100** range
- positive and negative affection / trust / love
- private NPC thoughts stored in `<thk>`
- optional NSFW context
- raw XML hiding from visible messages
- safer leaked-thought cleanup
- RU / EN language switch
- multiple themes
- multiple bar styles
- full / compact / collapsed panel modes
- pinned NPCs stay on top in character and relationship lists.
- relationship  filters: Top 1 / Top 3 / Changed only / All
- inline / floating / both display modes
- draggable and resizable floating infoboard
- debug XML viewer
- export / import state
- custom CSS overrides

---

## Installation

Install it like a regular **SillyTavern third-party extension**.

Folder name:

```
SillyTavern-Infoboard
```

*After installation, reload extensions/resources and enable Infoboard in the Extensions menu.*

## What it tracks

- time
- date
- weather
- location
- NPCs in scene
- NPC mood / presence
- NPC → user relationships
- NPC private thoughts
- optional NSFW context

---

## Relationship scale

Values use range:

```
-100 ... 0 ... 100
Affection

positive → affection
negative → aversion
Trust

positive → trust
negative → distrust
Love

positive → love
negative → hatred / destructive attachment
```

## Display modes

*Infoboard supports:*

- Inline — render panels under messages
- Floating — show the latest state in a floating window
- Both — use both modes

*Panel view modes:*

- Full — full sections and meters
- Compact — short stat chips
- Collapsed — minimal placeholder

## Settings

*Infoboard includes:*

- enable / disable toggle
- language switch
- theme selector
- bar style selector
- compact mode selector
- display mode selector
- stat hover effects toggle
- hide raw XML
- leaked-thought cleanup toggle
- show NSFW toggle
- reset state
- reprocess chat
- export / import state
- custom CSS overrides
- Custom CSS

## You can override the design without editing extension files.

*Example:*

```
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
```
