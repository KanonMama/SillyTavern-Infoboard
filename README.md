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
- export / import state
- custom CSS overrides
- raw XML hiding from visible messages

---

## Installation

Install it like a regular **SillyTavern third-party extension**.

## What it tracks
- time
- date
- weather
- location
- NPCs in scene
- NPC → user relationships
- NPC private thoughts
- optional NSFW context
- Settings

## Infoboard includes:

- enable / disable toggle
- language switch
- theme selector
- bar style selector
- hide raw XML
- show thoughts
- show NSFW
- reset state
- reprocess chat
- export / import state
- custom CSS overrides

## Custom CSS
You can override the design without editing extension files.

## Example:

<CSS>
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

## Notes
- one <infoboard> block is expected in every assistant reply
- state is stored per chat
- old chats can be rebuilt with Reprocess Chat
- language switching affects both UI and injected prompt
