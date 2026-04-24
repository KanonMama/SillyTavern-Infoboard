const kExtensionName = "SillyTavern-Infoboard";
const kExtensionFolderPath = `scripts/extensions/third-party/${kExtensionName}`;
const kSettingsFile = `${kExtensionFolderPath}/settings.html`;

const kStorageKeyPrefix = "IB_State_";
const kEnabledKey = "IB_Enabled";
const kThemeKey = "IB_Theme";
const kHideRawKey = "IB_HideRaw";
const kShowNsfwKey = "IB_ShowNsfw";
const kLangKey = "IB_Lang";
const kBarStyleKey = "IB_BarStyle";
const kCustomCssKey = "IB_CustomCss";
const kHoverFxKey = "IB_HoverFx";

let gEnabled = false;
let gTheme = "nocturne";
let gHideRaw = true;
let gShowNsfw = true;
let gLang = "ru";
let gBarStyle = "deep";
let gCustomCss = "";
let gHoverFx = true;

const kThemePreviewMap = {
    nocturne: {
        label: { ru: "Ночное синее стекло", en: "Midnight blue glass" },
        bg: "#141824",
        bg2: "#1c2232",
        accent: "#8fb4ff",
        accent2: "#c09cff",
        text: "#dbe3ff",
        danger: "#ff8f9f"
    },
    burgundy: {
        label: { ru: "Винный, тёплый, драматичный", en: "Wine-dark and dramatic" },
        bg: "#221419",
        bg2: "#311c24",
        accent: "#ff9bb3",
        accent2: "#e0a7ff",
        text: "#ffe2ea",
        danger: "#ff9bb3"
    },
    ashrose: {
        label: { ru: "Пепельная роза", en: "Muted rose dusk" },
        bg: "#211a20",
        bg2: "#2d242c",
        accent: "#f0a8c4",
        accent2: "#caa8ff",
        text: "#f3dfe8",
        danger: "#f0a8c4"
    },
    coldsteel: {
        label: { ru: "Холодный металл", en: "Cold iron and steel" },
        bg: "#15191c",
        bg2: "#20272d",
        accent: "#9ec7d9",
        accent2: "#b3b9df",
        text: "#dde6eb",
        danger: "#c89292"
    },
    frostwhite: {
        label: { ru: "Морозное небо", en: "Frosted pale blue" },
        bg: "#253446",
        bg2: "#2d4158",
        accent: "#7fb8ff",
        accent2: "#a8bfff",
        text: "#e3eefc",
        danger: "#e06c84"
    },
    pixel: {
        label: { ru: "Пиксельный неон", en: "Retro pixel neon" },
        bg: "#17132b",
        bg2: "#221b3f",
        accent: "#a6ff78",
        accent2: "#7de8ff",
        text: "#d8ffd0",
        danger: "#ff7f9f"
    },
    pinkbite: {
        label: { ru: "Сахарный розовый укус", en: "Sweet pink bite" },
        bg: "#2a1526",
        bg2: "#3a1d35",
        accent: "#ff8fc7",
        accent2: "#ffc2e6",
        text: "#ffe6f4",
        danger: "#ff7ba5"
    },
    violetglass: {
        label: { ru: "Фиолетовое стекло", en: "Soft violet glass" },
        bg: "#1b1830",
        bg2: "#2a2344",
        accent: "#b69cff",
        accent2: "#8fd4ff",
        text: "#efeaff",
        danger: "#ff92b2"
    },
    verdantgrove: {
        label: { ru: "Лес, мох и приглушённое золото", en: "Forest moss and muted gold" },
        bg: "#162019",
        bg2: "#223126",
        accent: "#9fcb8f",
        accent2: "#d6c68b",
        text: "#e7f1e4",
        danger: "#d97f87"
    },
    sandalwood: {
        label: { ru: "Тёплое дерево и бежевый свет", en: "Warm sandalwood and beige light" },
        bg: "#2a221b",
        bg2: "#3a2f25",
        accent: "#ddb27a",
        accent2: "#cfa98e",
        text: "#f5eadc",
        danger: "#d98b7d"
    },

    gryffindor: {
        label: { ru: "Гриффиндор: бордо, золото и гербовый жар", en: "Gryffindor: crimson, gold, heraldic warmth" },
        bg: "#2a1114",
        bg2: "#4a161b",
        accent: "#d4a94e",
        accent2: "#f0d28a",
        text: "#f9e8db",
        danger: "#ff8b7f"
    },
    slytherin: {
        label: { ru: "Слизерин: изумруд, серебро и холодный блеск", en: "Slytherin: emerald, silver, cold sheen" },
        bg: "#0f1b16",
        bg2: "#173027",
        accent: "#7dc8a2",
        accent2: "#c7d2cf",
        text: "#e6f2ed",
        danger: "#c98f98"
    },
    ravenclaw: {
        label: { ru: "Когтевран: тёмный сапфир и бронза", en: "Ravenclaw: deep sapphire and bronze" },
        bg: "#121c2f",
        bg2: "#1b2d4a",
        accent: "#8da8d8",
        accent2: "#b8894f",
        text: "#edf2fb",
        danger: "#d58d86"
    },
    hufflepuff: {
        label: { ru: "Пуффендуй: мёд, янтарь и тёплые соты", en: "Hufflepuff: honey, amber and warm combs" },
        bg: "#241d13",
        bg2: "#3a2b14",
        accent: "#e0b94a",
        accent2: "#f3d889",
        text: "#f8eed5",
        danger: "#d69a62"
    }
};

const kLang = {
    ru: {
        enable: "Enable Infoboard",
        language: "Язык",
        theme: "Тема",
        barStyle: "Стиль полос",
        hideRaw: "Скрывать сырой XML из сообщений",
        showNsfw: "Показывать NSFW блок",
        hoverFx: "Включить hover-эффекты статов",
        active: "✦ Расширение активно",
        inactive: "Расширение отключено",
        currentState: "Текущее состояние:",
        noRecentUpdates: "Нет недавних изменений.",
        disabledPrompt: "Отключено — промт не инжектится.",
        chars: "Персонажи в сцене",
        rels: "Отношения к тебе",
        nsfw: "Интимный контекст",
        affection: "💚 Симпатия",
        trust: "💙 Доверие",
        love: "💜 Любовь",
        aversion: "❤️‍🩹 Неприязнь",
        distrust: "🧡 Недоверие",
        hatred: "🩸 Ненависть",
        fetishes: "Фетиши",
        positions: "Позиции",
        resetState: "🗑 Сбросить состояние",
        reprocess: "🔄 Перепарсить чат",
        exportState: "📤 Экспорт состояния",
        importState: "📥 Импорт состояния",
        importFail: "Импорт не удался. Невалидный JSON.",
        resetConfirm: "Сбросить состояние Infoboard для этого чата?",
        stateNpcLabel: "NPCs",
        title: "INFOBOARD",
        noStatus: "не определено",
        customCssLabel: "Пользовательский CSS",
        customCssHelp: "Применяется после встроенных стилей. Можно переопределять цвета, отступы, полосы и любые классы Infoboard.",
        saveCustomCss: "💾 Сохранить CSS",
        clearCustomCss: "🧹 Очистить CSS",
        clearCustomCssConfirm: "Очистить пользовательский CSS?",
        compactMore: "ещё",
        focus: "в фокусе",
        activeHere: "активен",
        nearby: "рядом",
        watching: "наблюдает",
        background: "на периферии",
        leftScene: "вышел",
        openNpc: "Открыть NPC",
        closeNpc: "Скрыть NPC",
        palettePreview: "Палитра темы",
        paletteMissing: "Превью палитры недоступно"
    },
    en: {
        enable: "Enable Infoboard",
        language: "Language",
        theme: "Theme",
        barStyle: "Bar Style",
        hideRaw: "Hide raw XML from messages",
        showNsfw: "Show NSFW section",
        hoverFx: "Enable stat hover effects",
        active: "✦ Extension is active",
        inactive: "Extension is inactive",
        currentState: "Current State:",
        noRecentUpdates: "No recent updates.",
        disabledPrompt: "Disabled — not injecting prompts.",
        chars: "Characters in Scene",
        rels: "Feelings Toward You",
        nsfw: "Intimate Context",
        affection: "💚 Affection",
        trust: "💙 Trust",
        love: "💜 Love",
        aversion: "❤️‍🩹 Aversion",
        distrust: "🧡 Distrust",
        hatred: "🩸 Hatred",
        fetishes: "Fetishes",
        positions: "Positions",
        resetState: "🗑 Reset State",
        reprocess: "🔄 Reprocess Chat",
        exportState: "📤 Export State",
        importState: "📥 Import State",
        importFail: "Import failed. Invalid JSON.",
        resetConfirm: "Reset Infoboard state for this chat?",
        stateNpcLabel: "NPCs",
        title: "INFOBOARD",
        noStatus: "undefined",
        customCssLabel: "Custom CSS Overrides",
        customCssHelp: "Applied after built-in styles. Use to override colors, spacing, bars, or any Infoboard classes.",
        saveCustomCss: "💾 Save Custom CSS",
        clearCustomCss: "🧹 Clear Custom CSS",
        clearCustomCssConfirm: "Clear custom CSS?",
        compactMore: "more",
        focus: "focus",
        activeHere: "active",
        nearby: "nearby",
        watching: "watching",
        background: "background",
        leftScene: "left",
        openNpc: "Open NPC",
        closeNpc: "Hide NPC",
        palettePreview: "Theme palette",
        paletteMissing: "Palette preview unavailable"
    }
};

const kSystemPromptRu = `Infoboard:
Append exactly one XML block at the end of every assistant response. Fill all values in Russian. Keep it concise, accurate, and updated every message.

Format:
<infoboard time="" date="" weather="" loc="">
<chars>
<c icon="" name="" tags="" />
</chars>
<rels>
<rel source="" target="{{user}}" a="" ac="" tr="" tc="" l="" lc="" status="" />
</rels>
<thk></thk>
</infoboard>

Optional only for explicitly intimate scenes:
<nsfw f="" p="" />

Rules:
- Output exactly one <infoboard> block in every message
- Fill all values in Russian
- Add one <c /> for each NPC currently present
- Use the exact same full NPC name in <chars name="">, <rel source="">, and <thk>
- Never shorten NPC names in <rel>
- tags: 1-4 short tags separated by |
- Use tags to indicate scene presence when relevant, for example: focus | рядом | наблюдает | на периферии | вышел
- Add one <rel /> per present NPC describing feelings toward {{user}} only
- a, tr, l: from -100 to 100
- ac, tc, lc: per-message change, usually within -5..+5 unless major event
- Negative affection = aversion/dislike
- Negative trust = distrust/suspicion/fear
- Negative love = hatred/destructive obsession/anti-attachment
- Relationship values must evolve logically
- Put all NPC private thoughts into one <thk> block
- One NPC per line in <thk>
- Never include {{user}} thoughts in <thk>
- Omit <nsfw /> if the scene is not intimate
- No extra XML tags or commentary
- Never output private NPC thoughts in the visible narrative text; private thoughts must appear only inside <thk>

<thk> strict format:
- Use the exact full NPC name exactly as in <chars>
- Always write the name before the thought
- Never shorten names
- No markdown, quotes, asterisks, or brackets
- Format only: Полное Имя: мысль`;

const kSystemPromptEn = `Infoboard:
Append exactly one XML block at the end of every assistant response. Fill all values in English. Keep it concise, accurate, and updated every message.

Format:
<infoboard time="" date="" weather="" loc="">
<chars>
<c icon="" name="" tags="" />
</chars>
<rels>
<rel source="" target="{{user}}" a="" ac="" tr="" tc="" l="" lc="" status="" />
</rels>
<thk></thk>
</infoboard>

Optional only for explicitly intimate scenes:
<nsfw f="" p="" />

Rules:
- Output exactly one <infoboard> block in every message
- Fill all values in English
- Add one <c /> for each NPC currently present
- Use the exact same full NPC name in <chars name="">, <rel source="">, and <thk>
- Never shorten NPC names in <rel>
- tags: 1-4 short tags separated by |
- Use tags to indicate scene presence when relevant, for example: focus | near | watching | background | left
- Add one <rel /> per present NPC describing feelings toward {{user}} only
- a, tr, l: from -100 to 100
- ac, tc, lc: per-message change, usually within -5..+5 unless major event
- Negative affection = aversion/dislike
- Negative trust = distrust/suspicion/fear
- Negative love = hatred/destructive obsession/anti-attachment
- Relationship values must evolve logically
- Put all NPC private thoughts into one <thk> block
- One NPC per line in <thk>
- Never include {{user}} thoughts in <thk>
- Omit <nsfw /> if the scene is not intimate
- No extra XML tags or commentary
- Never output private NPC thoughts in the visible narrative text; private thoughts must appear only inside <thk>

<thk> strict format:
- Use the exact full NPC name exactly as in <chars>
- Always write the name before the thought
- Never shorten names
- No markdown, quotes, asterisks, or brackets
- Format only: Full Name: thought`;

const kDefaultState = {
    time: "???",
    date: "???",
    weather: "???",
    loc: "???",
    chars: [],
    rels: [],
    thoughts: [],
    nsfw: null
};

let gState = JSON.parse(JSON.stringify(kDefaultState));

function T(key) {
    return kLang[gLang]?.[key] ?? key;
}

function GetThemeTitleData(theme = gTheme) {
    const map = {
        gryffindor: {
            main: "𓃬 𝔊𝔯𝔶𝔣𝔣𝔦𝔫𝔡𝔬𝔯 𓃬",
            sub: "✩₊˚.⋆🦁⋆⁺₊✧"
        },
        slytherin: {
            main: "𓆙 𝔖𝔩𝔶𝔱𝔥𝔢𝔯𝔦𝔫 𓆙",
            sub: "⊹₊˚‧︵‿₊🐍₊‿︵‧˚₊⊹"
        },
        ravenclaw: {
            main: "𓄿 ℜ𝔞𝔳𝔢𝔫𝔠𝔩𝔞𝔴 𓄿",
            sub: "✦•┈๑⋅⋯🦅⋯⋅๑┈•✦"
        },
        hufflepuff: {
            main: "𓃮 ℌ𝔲𝔣𝔣𝔩𝔢𝔭𝔲𝔣𝔣 𓃮",
            sub: "-ˋˏ ༻❁🦡❀༺ ˎˊ-"
        }
    };

    return map[theme] || {
        main: T("title"),
        sub: ""
    };
}

function GetThemeLocationIcon(theme = gTheme) {
    const facultyThemes = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];
    return facultyThemes.includes(theme) ? "📜" : "📍";
}

function GetThemeCharsIcon(theme = gTheme) {
    const facultyThemes = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];
    return facultyThemes.includes(theme) ? "🪶" : "💖";
}

function GetThemeRelationsIcon(theme = gTheme) {
    const map = {
        gryffindor: "❤️",
        slytherin: "💚",
        ravenclaw: "💙",
        hufflepuff: "💛"
    };

    return map[theme] || "🤍";
}

function GetThemePreview(theme = gTheme) {
    return kThemePreviewMap[theme] || kThemePreviewMap.nocturne;
}

function UpdateThemePreview(theme = gTheme) {
    const preview = GetThemePreview(theme);

    const $wrap = $("#ib_theme_preview");
    if (!$wrap.length) return;

    const setSwatch = (selector, color) => {
        const $el = $wrap.find(selector);
        if ($el.length) {
            $el.css("background", color || "#555");
        }
    };

    setSwatch(".ib-swatch-bg", preview.bg);
    setSwatch(".ib-swatch-bg2", preview.bg2);
    setSwatch(".ib-swatch-accent", preview.accent);
    setSwatch(".ib-swatch-accent2", preview.accent2);
    setSwatch(".ib-swatch-text", preview.text);
    setSwatch(".ib-swatch-danger", preview.danger);

    const text = preview?.label?.[gLang] || T("paletteMissing");
    $("#ib_theme_preview_label").text(`${T("palettePreview")}: ${text}`);
}

function GetUserName() {
    try {
        const stContext = SillyTavern.getContext();
        return (
            stContext.name1 ||
            stContext.chatMetadata?.persona ||
            stContext.user?.name ||
            "User"
        );
    } catch {
        return "User";
    }
}

function ApplyCustomCss() {
    let styleEl = document.getElementById("ib_custom_css_style");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "ib_custom_css_style";
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = gCustomCss || "";
}

function GetStorageKey() {
    const stContext = SillyTavern.getContext();
    const chatId = stContext.chatMetadata?.chat_id || stContext.characters?.[stContext.characterId]?.chat || "default";
    return kStorageKeyPrefix + chatId;
}

function SaveState() {
    try {
        localStorage.setItem(GetStorageKey(), JSON.stringify(gState));
    } catch (e) {
        console.error("[IB] SaveState failed:", e);
    }
}

function LoadState() {
    try {
        const raw = localStorage.getItem(GetStorageKey());
        if (raw) {
            gState = JSON.parse(raw);
            if (!Array.isArray(gState.thoughts)) gState.thoughts = [];
            if (!Array.isArray(gState.chars)) gState.chars = [];
            if (!Array.isArray(gState.rels)) gState.rels = [];
            return true;
        }
    } catch (e) {
        console.error("[IB] LoadState failed:", e);
    }
    gState = JSON.parse(JSON.stringify(kDefaultState));
    return false;
}

function Clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

function EscapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function NormalizeName(str) {
    return String(str ?? "").trim().toLowerCase();
}

function NormalizeLooseText(str) {
    return String(str ?? "")
        .toLowerCase()
        .replace(/[«»„“”"']/g, "")
        .replace(/[…]+/g, "...")
        .replace(/\.\.\.+/g, "...")
        .replace(/[—–]/g, ":")
        .replace(/[*_~`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function NormalizeThoughtText(str) {
    return NormalizeLooseText(str)
        .replace(/[,:;!?]/g, "")
        .replace(/\.\.\./g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function EscapeRegex(str) {
    return String(str ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function LooksLikeStandaloneThoughtFragment(rawText, thoughtEntries = []) {
    const raw = String(rawText || "").trim();
    if (!raw) return false;
    const normalized = NormalizeLooseText(raw);
    const soft = NormalizeThoughtText(raw);
    // Не трогаем короткие слова и короткие реплики.
    // "Нет", "Да", "Ладно", "Что?" и прочее не должны исчезать.
    if (!normalized || soft.length < 18) return false;
    const looksQuoted =
        /^[«"„“].+[»"“”]$/.test(raw) ||
        /^["'][^"']+["']$/.test(raw);
    const looksShortFragment =
        raw.length <= 120 &&
        (
            looksQuoted ||
            /^\.{0,3}[^.!?]{18,120}\.{0,3}$/.test(raw)
        );
    if (!looksShortFragment) return false;
    return thoughtEntries.some(t => {
        if (!t?.softText) return false;
        return (
            soft.length >= 18 &&
            (
                t.softText.includes(soft) ||
                t.normalizedText.includes(normalized) ||
                t.normalizedFull.includes(normalized)
            )
        );
    });
}
function StripNameDecorators(str) {
    return String(str ?? "")
        .replace(/[*_~`"“”„]/g, "")
        .replace(/[(){}\[\]]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function GetNameAliases(name) {
    const raw = String(name ?? "").trim();
    if (!raw) return [];

    const clean = StripNameDecorators(raw);
    const lower = clean.toLowerCase();
    const parts = clean.split(/\s+/).filter(Boolean);

    const aliases = new Set();
    aliases.add(lower);

    if (parts.length > 1) {
        aliases.add(parts[0].toLowerCase());
        aliases.add(parts[parts.length - 1].toLowerCase());
        aliases.add(parts.slice(-2).join(" ").toLowerCase());
    }

    const noPunct = lower.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
    if (noPunct) aliases.add(noPunct);

    return [...aliases].filter(Boolean);
}

function NamesLikelyMatch(a, b) {
    const aAliases = GetNameAliases(a);
    const bAliases = GetNameAliases(b);

    for (const x of aAliases) {
        for (const y of bAliases) {
            if (!x || !y) continue;
            if (x === y) return true;

            const minLen = Math.min(x.length, y.length);
            const maxLen = Math.max(x.length, y.length);

            if (minLen >= 4) {
                if (x.includes(y) || y.includes(x)) {
                    if (minLen / maxLen >= 0.65) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

function ThoughtOwnerMatchesNpc(thoughtName, npcName, allNpcNames = []) {
    const thought = StripNameDecorators(thoughtName).toLowerCase().trim();
    const npc = StripNameDecorators(npcName).toLowerCase().trim();

    if (!thought || !npc) return false;
    if (thought === npc) return true;

    const thoughtParts = thought.split(/\s+/).filter(Boolean);
    const npcParts = npc.split(/\s+/).filter(Boolean);

    if (!thoughtParts.length || !npcParts.length) return false;

    const thoughtFirst = thoughtParts[0];
    const thoughtLast = thoughtParts[thoughtParts.length - 1];
    const npcFirst = npcParts[0];
    const npcLast = npcParts[npcParts.length - 1];

    if (thought === npcFirst || thought === npcLast) {
        if (thought === npcLast) {
            const sameLastCount = allNpcNames.filter(name => {
                const parts = StripNameDecorators(name).toLowerCase().trim().split(/\s+/).filter(Boolean);
                return parts.length && parts[parts.length - 1] === npcLast;
            }).length;

            return sameLastCount <= 1;
        }

        return true;
    }

    if (thought.includes(npc) || npc.includes(thought)) {
        const minLen = Math.min(thought.length, npc.length);
        const maxLen = Math.max(thought.length, npc.length);
        return minLen >= 4 && (minLen / maxLen >= 0.65);
    }

    if (thoughtFirst === npcFirst && thoughtLast === npcLast) return true;

    return false;
}

function IsUserLikeName(name) {
    const n = NormalizeName(name);
    return !n ||
        n === "{{user}}" ||
        n === "user" ||
        n === "ты" ||
        n === "вы" ||
        n === "твой персонаж" ||
        n === "героиня" ||
        n === "герой" ||
        n === "you" ||
        n === NormalizeName(GetUserName());
}

function IsUnknownValue(val) {
    const v = NormalizeName(val);
    return v === "???" || v === "неизвестно" || v === "n/a" || v === "none" || v === "unknown" || v === "н/д";
}

function RenderMaybeUnknown(val) {
    const escaped = EscapeHtml(val);
    if (IsUnknownValue(val)) {
        return `<span class="ib-unknown">${escaped}</span>`;
    }
    return escaped;
}

function ParseThoughtLine(line) {
    let cleaned = String(line || "").trim();
    if (!cleaned) return null;

    cleaned = cleaned
        .replace(/^\s*[*_~`]+/, "")
        .replace(/[*_~`]+\s*$/, "")
        .trim();

    const match = cleaned.match(/^([^:—]+?)\s*[:—]\s*(.+)$/u);
    if (!match) {
        return { name: "__UNASSIGNED__", text: cleaned };
    }

    const name = StripNameDecorators(match[1]);
    const text = String(match[2] || "")
        .replace(/^\s*[*_~`]+/, "")
        .replace(/[*_~`]+\s*$/, "")
        .trim();

    if (!text) return null;

    return {
        name: name || "__UNASSIGNED__",
        text
    };
}

function ParseFocusState(tags = []) {
    const t = tags.map(x => NormalizeName(x));

    if (t.some(x => ["focus", "в фокусе", "главный", "active focus"].includes(x))) {
        return { key: "focus", cls: "ib-presence-focus" };
    }

    if (t.some(x => ["active", "активен", "говорит", "ведёт сцену"].includes(x))) {
        return { key: "activeHere", cls: "ib-presence-active" };
    }

    if (t.some(x => ["near", "рядом", "nearby", "close"].includes(x))) {
        return { key: "nearby", cls: "ib-presence-near" };
    }

    if (t.some(x => ["watching", "наблюдает", "смотрит", "следит"].includes(x))) {
        return { key: "watching", cls: "ib-presence-watch" };
    }

    if (t.some(x => ["background", "на периферии", "в фоне", "пассивен"].includes(x))) {
        return { key: "background", cls: "ib-presence-background" };
    }

    if (t.some(x => ["left", "вышел", "ушёл", "out"].includes(x))) {
        return { key: "leftScene", cls: "ib-presence-left" };
    }

    return null;
}

function NormalizeThoughtOwners(result) {
    if (!result?.thoughts?.length) return;

    const singleRelName = result.rels?.length === 1 ? result.rels[0].source : "";
    const singleCharName = result.chars?.length === 1 ? result.chars[0].name : "";

    result.thoughts = result.thoughts
        .map(t => {
            let thoughtName = t.name;

            const isUnassigned =
                NormalizeName(thoughtName) === "__unassigned__" ||
                NormalizeName(thoughtName) === "npc";

            if (isUnassigned) {
                if (singleRelName || singleCharName) {
                    thoughtName = singleRelName || singleCharName;
                } else {
                    return {
                        ...t,
                        name: "__UNASSIGNED__"
                    };
                }
            }

const allNpcNames = [
    ...result.rels.map(r => r.source),
    ...result.chars.map(c => c.name)
];

const relMatches = result.rels.filter(r => ThoughtOwnerMatchesNpc(thoughtName, r.source, allNpcNames));
const charMatches = result.chars.filter(c => ThoughtOwnerMatchesNpc(thoughtName, c.name, allNpcNames));

            const canonicalName =
                relMatches.length === 1 ? relMatches[0].source :
                charMatches.length === 1 ? charMatches[0].name :
                thoughtName;

            return {
                ...t,
                name: canonicalName
            };
        })
        .filter(t => !IsUserLikeName(t.name));

    if (result.chars.length > 0 || result.rels.length > 0) {
        result.thoughts = result.thoughts.filter(t => {
            const n = NormalizeName(t.name);
            if (n === "npc" || n === "__unassigned__") return false;

            const byChar = result.chars.some(c => NamesLikelyMatch(c.name, t.name));
            const byRel = result.rels.some(r => NamesLikelyMatch(r.source, t.name));

            return byChar || byRel;
        });
    }
}

function ParseInfoboard(text) {
    const boardMatch = String(text || "").match(/<infoboard[\s\S]*?<\/infoboard>/i);
    if (!boardMatch) return null;

    const xmlBlock = boardMatch[0];
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlBlock, "text/xml");

    if (doc.querySelector("parsererror")) {
        console.warn("[IB] XML parser error");
        return null;
    }

    const root = doc.querySelector("infoboard");
    if (!root) return null;

    const result = {
        time: root.getAttribute("time") || "???",
        date: root.getAttribute("date") || "???",
        weather: root.getAttribute("weather") || "???",
        loc: root.getAttribute("loc") || "???",
        chars: [],
        rels: [],
        thoughts: [],
        nsfw: null,
        rawXml: xmlBlock
    };

    doc.querySelectorAll("chars > c").forEach(c => {
        const name = c.getAttribute("name") || "???";
        if (IsUserLikeName(name)) return;

        const tagsRaw = c.getAttribute("tags") || "";
        const tags = tagsRaw
            .split("|")
            .map(t => t.trim())
            .filter(Boolean)
            .slice(0, 4);

        result.chars.push({
            icon: c.getAttribute("icon") || "•",
            name,
            tags,
            presence: ParseFocusState(tags)
        });
    });

    const pushRel = (rel) => {
        const source = rel.getAttribute("source") || "???";
        if (IsUserLikeName(source)) return;

        result.rels.push({
            source,
            target: GetUserName(),
            a: Clamp(parseInt(rel.getAttribute("a")) || 0, -100, 100),
            ac: Clamp(parseInt(rel.getAttribute("ac")) || 0, -100, 100),
            tr: Clamp(parseInt(rel.getAttribute("tr")) || 0, -100, 100),
            tc: Clamp(parseInt(rel.getAttribute("tc")) || 0, -100, 100),
            l: Clamp(parseInt(rel.getAttribute("l")) || 0, -100, 100),
            lc: Clamp(parseInt(rel.getAttribute("lc")) || 0, -100, 100),
            status: rel.getAttribute("status") || T("noStatus")
        });
    };

    const relNodes = doc.querySelectorAll("rels > rel");
    relNodes.forEach(pushRel);

    if (!result.rels.length) {
        doc.querySelectorAll("rel").forEach(pushRel);
    }

    if (result.rels.length && result.chars.length) {
    result.rels = result.rels.map(r => {
        const matches = result.chars.filter(c => NamesLikelyMatch(c.name, r.source));

        if (matches.length === 1) {
            return {
                ...r,
                source: matches[0].name
            };
        }

        return r;
    });
}

    const thk = doc.querySelector("thk");
    if (thk) {
        const rawThoughts = (thk.textContent || "").replace(/\r/g, "\n");
        const lines = rawThoughts
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

        result.thoughts = lines
            .map(ParseThoughtLine)
            .filter(Boolean)
            .filter(t => !IsUserLikeName(t.name));
    }

    NormalizeThoughtOwners(result);

    const tailText = String(text || "").slice(String(text || "").indexOf(xmlBlock) + xmlBlock.length);
    const nsfwParser = new DOMParser();
    const nsfwDoc = nsfwParser.parseFromString(`<root>${tailText}</root>`, "text/xml");
    const nsfwNode = nsfwDoc.querySelector("nsfw");

    if (nsfwNode) {
        result.nsfw = {
            f: nsfwNode.getAttribute("f") || "",
            p: nsfwNode.getAttribute("p") || ""
        };
    } else {
        const nsfwMatch = String(text || "").match(/<nsfw\s+f="(.*?)"\s+p="(.*?)"\s*\/?>/i);
        if (nsfwMatch) {
            result.nsfw = {
                f: nsfwMatch[1] || "",
                p: nsfwMatch[2] || ""
            };
        }
    }

    return result;
}

function BuildStateInjection() {
    const lines = [];
    lines.push("[INFOBOARD STATE]");
    lines.push(`Time: ${gState.time}`);
    lines.push(`Date: ${gState.date}`);
    lines.push(`Weather: ${gState.weather}`);
    lines.push(`Location: ${gState.loc}`);

    if (gState.chars.length) {
        lines.push("NPCs:");
        for (const c of gState.chars) {
            const tags = (c.tags || []).join(", ");
            lines.push(`- ${c.name}${tags ? ` [${tags}]` : ""}`);
        }
    }

    if (gState.rels.length) {
        lines.push("Relations:");
        for (const r of gState.rels) {
            lines.push(`- ${r.source}: A ${r.a} (${SignedText(r.ac)}), T ${r.tr} (${SignedText(r.tc)}), L ${r.l} (${SignedText(r.lc)}), ${r.status}`);
        }
    }

    if (gState.thoughts.length) {
        lines.push("Thoughts:");
        for (const t of gState.thoughts) {
            lines.push(`- ${t.name}: ${t.text}`);
        }
    }

    if (gState.nsfw) {
        lines.push(`NSFW: F ${gState.nsfw.f} | P ${gState.nsfw.p}`);
    }

    lines.push("[/INFOBOARD STATE]");
    return lines.join("\n");
}

function SignedText(num) {
    const n = parseInt(num) || 0;
    return n >= 0 ? `+${n}` : `${n}`;
}

function RenderDelta(num) {
    const n = parseInt(num) || 0;
    const cls = n > 0 ? "ib-delta-pos" : n < 0 ? "ib-delta-neg" : "ib-delta-zero";
    const txt = n >= 0 ? `+${n}` : `${n}`;
    return `<span class="${cls}">${txt}</span>`;
}

function RenderBarWidth(value) {
    const v = Math.abs(Clamp(parseInt(value) || 0, -100, 100));
    if (v <= 0) return "0%";
    return `${Math.max(v, 4)}%`;
}

function GetStatusClass(status) {
    const s = NormalizeName(status);

    const romantic = ["роман", "любов", "влюб", "пара", "отношен", "свидан", "любовники", "муж", "жена", "соулмейт", "dating", "lover", "romantic", "married", "soulmate", "romance"];
    const negative = ["враг", "ненав", "токс", "абьюз", "сопер", "rival", "enemy", "abusive", "toxic", "ex-", "бывш", "hostile", "hatred", "hate"];
    const complex = ["сложн", "одерж", "защит", "ментор", "учен", "family", "нераздел", "complicated", "protective", "mentor", "unrequited", "obsession", "obsessed"];

    if (romantic.some(k => s.includes(k))) return "ib-status-romantic";
    if (negative.some(k => s.includes(k))) return "ib-status-negative";
    if (complex.some(k => s.includes(k))) return "ib-status-complex";
    return "ib-status-neutral";
}

function GetStatusIcon(status) {
    const cls = GetStatusClass(status);
    if (cls === "ib-status-romantic") return "♥";
    if (cls === "ib-status-negative") return "⚠";
    if (cls === "ib-status-complex") return "✦";
    return "•";
}

function GetMetricMeta(type, value) {
    const v = Clamp(parseInt(value) || 0, -100, 100);
    const abs = Math.abs(v);
    const saturation = 0.88 + abs / 420;
    const brightness = 0.95 + abs / 700;
    const glow = 2 + abs / 36;
    const alpha = 0.06 + abs / 900;

    if (type === "a") {
        return v >= 0
            ? { key: "a", label: T("affection"), barClass: "ib-bar-affection-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(45, 169, 111, ${alpha});` }
            : { key: "a", label: T("aversion"), barClass: "ib-bar-affection-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(181, 82, 82, ${alpha});` };
    }

    if (type === "tr") {
        return v >= 0
            ? { key: "tr", label: T("trust"), barClass: "ib-bar-trust-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(74, 135, 216, ${alpha});` }
            : { key: "tr", label: T("distrust"), barClass: "ib-bar-trust-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(184, 116, 66, ${alpha});` };
    }

    return v >= 0
        ? { key: "l", label: T("love"), barClass: "ib-bar-love-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(138, 88, 212, ${alpha});` }
        : { key: "l", label: T("hatred"), barClass: "ib-bar-love-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(169, 59, 88, ${alpha});` };
}

function SortRelationsByPriority(rels) {
    return [...rels].sort((a, b) => {
        const aa = Math.abs(a.a || 0) + Math.abs(a.tr || 0) + Math.abs(a.l || 0);
        const bb = Math.abs(b.a || 0) + Math.abs(b.tr || 0) + Math.abs(b.l || 0);
        return bb - aa;
    });
}

function GetChangedMetrics(prevState, rel) {
    if (!prevState?.rels?.length || !rel?.source) return { a: false, tr: false, l: false };

    const prev = prevState.rels.find(r => NamesLikelyMatch(r.source, rel.source));
    if (!prev) return { a: true, tr: true, l: true };

    return {
        a: parseInt(prev.a) !== parseInt(rel.a) || parseInt(rel.ac) !== 0,
        tr: parseInt(prev.tr) !== parseInt(rel.tr) || parseInt(rel.tc) !== 0,
        l: parseInt(prev.l) !== parseInt(rel.l) || parseInt(rel.lc) !== 0
    };
}

function GetCompactMetricMeta(type, value, delta = 0) {
    const v = Clamp(parseInt(value) || 0, -100, 100);
    const abs = Math.abs(v);
    const width = Math.max(6, Math.round((abs / 100) * 100));

    if (type === "a") {
        return {
            cls: v >= 0 ? "ib-mini-stat-aff-pos" : "ib-mini-stat-aff-neg ib-mini-stat-neg",
            label: "A",
            value: `${v}`,
            delta: parseInt(delta) || 0,
            fill: width
        };
    }

    if (type === "tr") {
        return {
            cls: v >= 0 ? "ib-mini-stat-tr-pos" : "ib-mini-stat-tr-neg ib-mini-stat-neg",
            label: "T",
            value: `${v}`,
            delta: parseInt(delta) || 0,
            fill: width
        };
    }

    return {
        cls: v >= 0 ? "ib-mini-stat-love-pos" : "ib-mini-stat-love-neg ib-mini-stat-neg",
        label: "L",
        value: `${v}`,
        delta: parseInt(delta) || 0,
        fill: width
    };
}

function RenderMiniStat(meta, changed = false) {
    const deltaHtml = meta.delta !== 0
        ? `<span class="ib-mini-stat-delta ${meta.delta > 0 ? "ib-delta-pos" : "ib-delta-neg"}">${EscapeHtml(SignedText(meta.delta))}</span>`
        : "";

    return `
    <div class="ib-mini-stat ${meta.cls} ${changed ? "ib-mini-stat-changed" : ""}" style="--ib-mini-fill:${meta.fill}%;">
        <span class="ib-mini-stat-progress" aria-hidden="true"></span>
        <span class="ib-mini-stat-label">${meta.label}</span>
        <span class="ib-mini-stat-value">${EscapeHtml(meta.value)}</span>
        ${deltaHtml}
        ${meta.cls.includes("ib-mini-stat-neg") ? `<span class="ib-mini-stat-cracks" aria-hidden="true"></span>` : ""}
    </div>`;
}

function RenderChars(chars) {
    if (!chars.length) return "";

    return `
    <div class="ib-section">
        <div class="ib-section-title">${GetThemeCharsIcon()} ${T("chars")}</div>
        <div class="ib-chars">
            ${chars.map(c => `
                <div class="ib-char">
                    <div class="ib-char-main">
                        <span class="ib-char-icon-wrap"><span class="ib-char-icon">${EscapeHtml(c.icon)}</span></span>
                        <span class="ib-char-name">${RenderMaybeUnknown(c.name)}</span>
                        ${c.presence ? `<span class="ib-presence-chip ${c.presence.cls}">${EscapeHtml(T(c.presence.key))}</span>` : ""}
                    </div>
                    <div class="ib-char-tags">
                        ${(c.tags || []).map(tag => `<span class="ib-tag">${EscapeHtml(tag)}</span>`).join("")}
                    </div>
                </div>
            `).join("")}
        </div>
    </div>`;
}

function RenderRelMeter(type, value, delta, changed) {
    const meta = GetMetricMeta(type, value);
    return `
    <div class="ib-meter ${changed ? "ib-meter-changed" : ""}" data-metric="${meta.key}">
        <div class="ib-meter-top">
            <span class="ib-meter-label">${meta.label}</span>
            <span class="ib-meter-value">${value}/100 (${RenderDelta(delta)})</span>
        </div>
        <div class="ib-bar">
            <div class="ib-bar-fill ${meta.barClass}" style="width:${RenderBarWidth(value)}; ${meta.style}"></div>
        </div>
    </div>`;
}

function RenderThoughtForNpc(thoughts, npcName, rels = []) {
    if (!Array.isArray(thoughts) || !npcName) return "";

    const allNpcNames = rels.map(r => r.source);
    const matches = thoughts.filter(t => ThoughtOwnerMatchesNpc(t.name, npcName, allNpcNames));

    if (matches.length !== 1) return "";

    return `
    <div class="ib-rel-thought">
        <div class="ib-rel-subtitle">💭</div>
        <div class="ib-rel-thought-text">${EscapeHtml(matches[0].text)}</div>
    </div>`;
}

function RenderRelCard(r, thoughts = [], prevState = null, rels = []) {
    const statusClass = GetStatusClass(r.status);
    const statusIcon = GetStatusIcon(r.status);
    const changed = GetChangedMetrics(prevState, r);

    return `
    <div class="ib-rel-card ib-rel-accordion ${changed.a || changed.tr || changed.l ? "ib-rel-updated" : ""}">
        <div class="ib-rel-toggle" role="button" tabindex="0" aria-expanded="true" title="${EscapeHtml(T("closeNpc"))}">
            <div class="ib-rel-toggle-main">
                <span class="ib-rel-toggle-name">💕 ${EscapeHtml(r.source)} → ${EscapeHtml(r.target)}</span>
                <span class="ib-status-chip ${statusClass}">
                    <span class="ib-status-icon">${EscapeHtml(statusIcon)}</span>
                    <span>${EscapeHtml(r.status)}</span>
                </span>
            </div>

            <div class="ib-rel-toggle-preview">
                <div class="ib-rel-toggle-miniwrap">
                    ${RenderMiniStat(GetCompactMetricMeta("a", r.a, r.ac), changed.a)}
                    ${RenderMiniStat(GetCompactMetricMeta("tr", r.tr, r.tc), changed.tr)}
                    ${RenderMiniStat(GetCompactMetricMeta("l", r.l, r.lc), changed.l)}
                </div>
                <span class="ib-rel-toggle-arrow" aria-hidden="true"></span>
            </div>
        </div>

        <div class="ib-rel-body">
            ${RenderRelMeter("a", r.a, r.ac, changed.a)}
            ${RenderRelMeter("tr", r.tr, r.tc, changed.tr)}
            ${RenderRelMeter("l", r.l, r.lc, changed.l)}
            ${RenderThoughtForNpc(thoughts, r.source, rels)}
        </div>
    </div>`;
}

function RenderRelations(rels, thoughts = [], prevState = null) {
    if (!rels.length) return "";

    const sorted = SortRelationsByPriority(rels);

    return `
    <div class="ib-section">
        <div class="ib-section-title">${GetThemeRelationsIcon()} ${T("rels")}</div>
        ${sorted.map(r => RenderRelCard(r, thoughts, prevState, rels)).join("")}
    </div>`;
}

function RenderNsfw(nsfw) {
    if (!gShowNsfw || !nsfw) return "";

    return `
    <div class="ib-section ib-nsfw">
        <div class="ib-section-title">${T("nsfw")}</div>
        <div class="ib-nsfw-line"><b>${T("fetishes")}:</b> ${EscapeHtml(nsfw.f)}</div>
        <div class="ib-nsfw-line"><b>${T("positions")}:</b> ${EscapeHtml(nsfw.p)}</div>
    </div>`;
}

function RenderCompactRelations(state, prevState = null) {
    const rels = SortRelationsByPriority(state?.rels || []);
    if (!rels.length) return "";

    const top = rels.slice(0, 3);
    const more = Math.max(0, rels.length - top.length);

    return `
    <div class="ib-compact-rel-list">
        ${top.map(r => {
            const changed = GetChangedMetrics(prevState, r);
            return `
            <div class="ib-compact-rel-item">
                <div class="ib-compact-rel-name-row">
                    <span class="ib-compact-rel-name">${EscapeHtml(r.source)}</span>
                    <span class="ib-compact-rel-status ${GetStatusClass(r.status)}">${EscapeHtml(GetStatusIcon(r.status))}</span>
                </div>
                <div class="ib-compact-minirow">
                    ${RenderMiniStat(GetCompactMetricMeta("a", r.a, r.ac), changed.a)}
                    ${RenderMiniStat(GetCompactMetricMeta("tr", r.tr, r.tc), changed.tr)}
                    ${RenderMiniStat(GetCompactMetricMeta("l", r.l, r.lc), changed.l)}
                </div>
            </div>`;
        }).join("")}
        ${more > 0 ? `<div class="ib-compact-more">+${more} ${EscapeHtml(T("compactMore"))}</div>` : ""}
    </div>`;
}

function RenderBoard(state, isFresh = false, prevState = null) {
    const themeTitle = GetThemeTitleData();

    return `
    <div class="ib-board ib-theme-${EscapeHtml(gTheme)} ib-bars-${EscapeHtml(gBarStyle)} ${gHoverFx ? "ib-hoverfx" : ""} ib-mode-full ${isFresh ? "ib-fresh" : ""}">
        <div class="ib-title-wrap">
            <div class="ib-title">${EscapeHtml(themeTitle.main)}</div>
            ${themeTitle.sub ? `<div class="ib-title-sub">${EscapeHtml(themeTitle.sub)}</div>` : ""}
        </div>

        <div class="ib-collapsed-wrap">
            <div class="ib-collapsed-tag">
                <span></span>
                <span class="ib-collapsed-title">✦ ${EscapeHtml(T("title"))}</span>
                <span class="ib-collapsed-action">OPEN</span>
            </div>
        </div>

        <div class="ib-compact-wrap">
            <div class="ib-compact-main">
                <div class="ib-compact-content">
                    ${RenderCompactRelations(state, prevState)}
                </div>

                <div class="ib-compact-controls">
                    <div class="ib-control-btn ib-btn-full" title="Full">▣</div>
                    <div class="ib-control-btn ib-btn-collapse" title="Collapse">✕</div>
                </div>
            </div>
            <div class="ib-compact-loc">${GetThemeLocationIcon()} ${RenderMaybeUnknown(state.loc)}</div>
        </div>

        <div class="ib-full-wrap">
            <div class="ib-header">
                <div class="ib-header-main">
                    <div class="ib-header-location">
                        <span class="ib-header-location-icon">${GetThemeLocationIcon()}</span>
                        <span class="ib-header-location-text">${RenderMaybeUnknown(state.loc)}</span>
                    </div>

                    <div class="ib-panel-controls">
                        <div class="ib-control-btn ib-btn-compact" title="Compact">▤</div>
                        <div class="ib-control-btn ib-btn-collapse" title="Collapse">—</div>
                    </div>
                </div>

                <div class="ib-header-meta">
                    <span class="ib-meta-pill">⏰ ${RenderMaybeUnknown(state.time)}</span>
                    <span class="ib-meta-pill">📅 ${RenderMaybeUnknown(state.date)}</span>
                    <span class="ib-meta-pill">☁ ${RenderMaybeUnknown(state.weather)}</span>
                </div>
            </div>

            <div class="ib-content">
                ${RenderChars(state.chars)}
                ${RenderRelations(state.rels, state.thoughts, prevState)}
                ${RenderNsfw(state.nsfw)}
            </div>
        </div>
    </div>`;
}

function SetBoardMode(boardEl, mode) {
    boardEl.classList.remove("ib-mode-full", "ib-mode-compact", "ib-mode-collapsed");
    boardEl.classList.add(`ib-mode-${mode}`);

    boardEl.querySelectorAll(".ib-btn-compact, .ib-btn-collapse, .ib-btn-full").forEach(btn => {
        btn.classList.remove("ib-active");
    });

    if (mode === "compact") {
        boardEl.querySelectorAll(".ib-btn-compact").forEach(btn => btn.classList.add("ib-active"));
    }

    if (mode === "collapsed") {
        boardEl.querySelectorAll(".ib-btn-collapse").forEach(btn => btn.classList.add("ib-active"));
    }
}

function WireAccordionControls(boardEl) {
    boardEl.querySelectorAll(".ib-rel-toggle").forEach(toggle => {
        const card = toggle.closest(".ib-rel-accordion");
        const body = card?.querySelector(".ib-rel-body");
        const miniwrap = card?.querySelector(".ib-rel-toggle-miniwrap");

        if (!card || !body) return;

        const apply = (open) => {
            card.classList.toggle("ib-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("title", open ? T("closeNpc") : T("openNpc"));
            if (miniwrap) miniwrap.style.display = open ? "none" : "flex";
        };

        apply(true);

        const handle = () => apply(!card.classList.contains("ib-open"));
        toggle.addEventListener("click", handle);
        toggle.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handle();
            }
        });
    });
}

function WireBoardControls(boardEl) {
    if (!boardEl) return;

    boardEl.querySelectorAll(".ib-btn-compact").forEach(btn => {
        btn.addEventListener("click", () => {
            const isCompact = boardEl.classList.contains("ib-mode-compact");
            SetBoardMode(boardEl, isCompact ? "full" : "compact");
        });
    });

    boardEl.querySelectorAll(".ib-btn-collapse").forEach(btn => {
        btn.addEventListener("click", () => {
            const isCollapsed = boardEl.classList.contains("ib-mode-collapsed");
            SetBoardMode(boardEl, isCollapsed ? "full" : "collapsed");
        });
    });

    boardEl.querySelectorAll(".ib-btn-full").forEach(btn => {
        btn.addEventListener("click", () => {
            SetBoardMode(boardEl, "full");
        });
    });

    const collapsedTag = boardEl.querySelector(".ib-collapsed-tag");
    if (collapsedTag) {
        collapsedTag.addEventListener("click", () => {
            SetBoardMode(boardEl, "full");
        });
    }

    WireAccordionControls(boardEl);
}

function GetOrCreateBoardHost(mesTextEl) {
    let host = mesTextEl.querySelector(".ib-board-host");
    if (!host) {
        host = document.createElement("div");
        host.className = "ib-board-host";
        mesTextEl.appendChild(host);
    }
    return host;
}

function CleanupBoardHosts(mesTextEl) {
    const hosts = mesTextEl.querySelectorAll(".ib-board-host");
    if (hosts.length <= 1) return;

    hosts.forEach((host, index) => {
        if (index !== hosts.length - 1) {
            host.remove();
        }
    });
}

function CleanupEmptyMessageNodes(messageTextEl) {
    if (!messageTextEl) return;

    const isEmptyNode = (node) => {
        if (!node) return true;

        if (node.nodeType === Node.TEXT_NODE) {
            return !String(node.textContent || "").trim();
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return true;

        if (node.classList?.contains("ib-board-host") || node.classList?.contains("ib-board")) {
            return false;
        }

        const tag = node.tagName?.toLowerCase();

        if (tag === "br") return true;

        const text = String(node.textContent || "")
            .replace(/\u00a0/g, " ")
            .trim();

        if (!text && node.querySelectorAll("img, video, audio, iframe, svg, canvas").length === 0) {
            const meaningfulChildren = [...node.children].filter(child => {
                const childTag = child.tagName?.toLowerCase();
                return childTag !== "br" && !child.classList?.contains("ib-board-host");
            });

            return meaningfulChildren.length === 0;
        }

        return false;
    };

    const children = [...messageTextEl.childNodes];

    for (const node of children) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains("ib-board-host")) {
            break;
        }

        if (isEmptyNode(node)) {
            node.remove();
        }
    }
}

function RemoveRawXmlFromText(messageTextEl) {
    if (!gHideRaw || !messageTextEl) return;

    const walker = document.createTreeWalker(
        messageTextEl,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                if (!node?.parentElement) return NodeFilter.FILTER_REJECT;
                if (node.parentElement.closest(".ib-board-host, .ib-board")) return NodeFilter.FILTER_REJECT;

                const txt = node.textContent || "";
                if (
                    txt.includes("<infoboard") ||
                    txt.includes("</infoboard>") ||
                    txt.includes("<thk") ||
                    txt.includes("</thk>") ||
                    txt.includes("<nsfw")
                ) {
                    return NodeFilter.FILTER_ACCEPT;
                }

                return NodeFilter.FILTER_SKIP;
            }
        }
    );

    const targets = [];
    let current = walker.nextNode();
    while (current) {
        targets.push(current);
        current = walker.nextNode();
    }

    for (const node of targets) {
        const text = node.textContent || "";
        const next = text
            .replace(/<infoboard[\s\S]*?<\/infoboard>/gi, "")
            .replace(/<thk[\s\S]*?<\/thk>/gi, "")
            .replace(/<nsfw\b[\s\S]*?\/?>/gi, "")
            .replace(/\n{3,}/g, "\n\n");

        if (next !== text) {
            node.textContent = next;
        }
    }
}

function RemoveThoughtLeaksInContainer(messageTextEl, parsed) {
    if (!messageTextEl || !parsed?.thoughts?.length) return;

    const thoughtEntries = parsed.thoughts.map(t => {
        const rawFull = `${t.name}: ${t.text}`;
        const normalizedFull = NormalizeLooseText(rawFull);
        const normalizedText = NormalizeLooseText(t.text);
        const softText = NormalizeThoughtText(t.text);

        return {
            rawFull,
            normalizedFull,
            normalizedText,
            softText,
            aliases: GetNameAliases(t.name).map(NormalizeLooseText),
        };
    });

    const walker = document.createTreeWalker(
        messageTextEl,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                if (!node?.parentElement) return NodeFilter.FILTER_REJECT;
                if (node.parentElement.closest(".ib-board-host, .ib-board")) return NodeFilter.FILTER_REJECT;

                const raw = node.textContent || "";
                const text = NormalizeLooseText(raw);
                const soft = NormalizeThoughtText(raw);

                if (!text) return NodeFilter.FILTER_SKIP;

                const standaloneFragmentHit = LooksLikeStandaloneThoughtFragment(raw, thoughtEntries);

const isThoughtLeak = thoughtEntries.some(t => {
    const aliasHit = t.aliases.some(a => a && text.includes(a));

    const exactishHit =
        (t.normalizedFull && text.includes(t.normalizedFull)) ||
        (t.normalizedText && text.includes(t.normalizedText));

    const softHit =
        (t.softText && soft.includes(t.softText)) ||
        (t.softText && t.softText.includes(soft) && soft.length > 18);

    return exactishHit || softHit || (aliasHit && t.softText && soft.includes(t.softText.slice(0, 14)));
}) || standaloneFragmentHit;

return isThoughtLeak ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        }
    );

    const targets = [];
    let current = walker.nextNode();
    while (current) {
        targets.push(current);
        current = walker.nextNode();
    }

    for (const node of targets) {
        const parent = node.parentElement;
        if (!parent) continue;

        const raw = node.textContent || "";
        const text = NormalizeLooseText(raw);
        const soft = NormalizeThoughtText(raw);

const matchedThought = thoughtEntries.find(t => {
    return (
        (t.normalizedFull && text.includes(t.normalizedFull)) ||
        (t.normalizedText && text.includes(t.normalizedText)) ||
        (t.softText && soft.includes(t.softText)) ||
        (soft.length >= 18 && t.softText && t.softText.includes(soft) && raw.trim().length <= 120)
    );
});


        if (matchedThought) {
            let cleaned = raw;

            if (matchedThought.rawFull) {
                cleaned = cleaned.replace(new RegExp(EscapeRegex(matchedThought.rawFull), "gi"), "");
            }

            if (matchedThought.normalizedText) {
                const textVariants = [
                    matchedThought.rawFull,
                    matchedThought.normalizedText,
                ].filter(Boolean);

                for (const variant of textVariants) {
                    cleaned = cleaned.replace(new RegExp(EscapeRegex(variant), "gi"), "");
                }
            }

            const cleanedLoose = NormalizeLooseText(cleaned);
const cleanedSoft = NormalizeThoughtText(cleaned);

if (
    !cleaned.trim() ||
    cleanedLoose === text ||
    cleanedSoft === soft ||
    LooksLikeStandaloneThoughtFragment(raw, thoughtEntries)
) {
    node.textContent = "";
} else {
    node.textContent = cleaned;
}
        } else {
            node.textContent = "";
        }
    }
}

function UpdateLastUpdateDisplay() {
    $("#ib_last_update").text(T("noRecentUpdates"));
}

function UpdateSettingsText() {
    $('label[for="ib_enabled"]').html(`<b>${T("enable")}</b>`);
    $('label[for="ib_lang"]').html(`<b>${T("language")}</b>`);
    $('label[for="ib_theme"]').html(`<b>${T("theme")}</b>`);
    $('label[for="ib_bar_style"]').html(`<b>${T("barStyle")}</b>`);
    $('label[for="ib_hide_raw"]').text(T("hideRaw"));
    $('label[for="ib_show_nsfw"]').text(T("showNsfw"));
    $('label[for="ib_hover_fx"]').text(T("hoverFx"));
    $("#ib_state_label").text(T("currentState"));
    $("#ib_reset_state").text(T("resetState"));
    $("#ib_reprocess_chat").text(T("reprocess"));
    $("#ib_export_state").text(T("exportState"));
    $("#ib_import_state").text(T("importState"));
    $("#ib_custom_css_label").text(T("customCssLabel"));
    $("#ib_custom_css_help").text(T("customCssHelp"));
    $("#ib_save_custom_css").text(T("saveCustomCss"));
    $("#ib_clear_custom_css").text(T("clearCustomCss"));
    UpdateThemePreview();
}

function ApplyParsedToState(parsed) {
    gState.time = parsed.time || gState.time;
    gState.date = parsed.date || gState.date;
    gState.weather = parsed.weather || gState.weather;
    gState.loc = parsed.loc || gState.loc;
    gState.chars = parsed.chars || [];
    gState.rels = parsed.rels || [];
    gState.thoughts = parsed.thoughts || [];
    gState.nsfw = parsed.nsfw || null;
}

function ForceRepaint(el) {
    if (!el) return;
    requestAnimationFrame(() => {
        el.style.transform = "translateZ(0)";
        void el.offsetHeight;
        requestAnimationFrame(() => {
            el.style.transform = "";
        });
    });
}

function RenderBoardIntoMessage(mesTextEl, parsed, isFresh, prevState) {
    if (!mesTextEl || !parsed) return;

    RemoveRawXmlFromText(mesTextEl);
    RemoveThoughtLeaksInContainer(mesTextEl, parsed);
    CleanupEmptyMessageNodes(mesTextEl);

    const host = GetOrCreateBoardHost(mesTextEl);
    host.innerHTML = RenderBoard(parsed, isFresh, prevState);

    const boardEl = host.firstElementChild;
    if (boardEl) {
        WireBoardControls(boardEl);
        ForceRepaint(boardEl);
    }

    CleanupBoardHosts(mesTextEl);
    CleanupEmptyMessageNodes(mesTextEl);
}

function ProcessMessage(messageDiv, msgIndex, isFresh = true, prevState = null) {
    if (!gEnabled) return;

    const stContext = SillyTavern.getContext();
    const msg = stContext.chat?.[msgIndex];
    if (!msg || msg.is_user) return;

    const parsed = ParseInfoboard(msg.mes || "");
    if (!parsed) return;

    const mesTextEl = messageDiv.querySelector(".mes_text");
    if (!mesTextEl) return;

    ApplyParsedToState(parsed);
    SaveState();

    RenderBoardIntoMessage(mesTextEl, parsed, isFresh, prevState);

    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();
}

function ReprocessChat() {
    const stContext = SillyTavern.getContext();
    if (!stContext.chat) return;

    let rollingState = JSON.parse(JSON.stringify(kDefaultState));

    document.querySelectorAll(".mes").forEach(node => {
        const msgId = Number(node.getAttribute("mesid"));
        if (isNaN(msgId)) return;

        const stMsg = stContext.chat[msgId];
        if (!stMsg || stMsg.is_user) return;

        const parsed = ParseInfoboard(stMsg.mes || "");
        const mesTextEl = node.querySelector(".mes_text");
        if (!mesTextEl) return;

        if (!parsed) {
            const host = mesTextEl.querySelector(".ib-board-host");
            if (host) host.remove();
            return;
        }

        const prevState = JSON.parse(JSON.stringify(rollingState));

        rollingState.time = parsed.time || rollingState.time;
        rollingState.date = parsed.date || rollingState.date;
        rollingState.weather = parsed.weather || rollingState.weather;
        rollingState.loc = parsed.loc || rollingState.loc;
        rollingState.chars = parsed.chars || [];
        rollingState.rels = parsed.rels || [];
        rollingState.thoughts = parsed.thoughts || [];
        rollingState.nsfw = parsed.nsfw || null;

        RenderBoardIntoMessage(mesTextEl, parsed, false, prevState);
    });

    gState = rollingState;
    SaveState();
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();
}

function OnChatChanged() {
    LoadState();
    UpdateSettingsText();
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

    if (!gEnabled) return;

    setTimeout(() => ReprocessChat(), 180);
    setTimeout(() => ReprocessChat(), 600);
}

function UpdateStatusDisplay() {
    const $status = $("#ib_status");
    const $summary = $("#ib_state_summary");

    if (gEnabled) {
        $status.html(`<span style="color:#7fb68a">${EscapeHtml(T("active"))}</span>`);
        $summary.html(
            `${EscapeHtml(gState.time)} | ${EscapeHtml(gState.date)}<br>` +
            `${EscapeHtml(gState.weather)}<br>` +
            `📍 ${EscapeHtml(gState.loc)}<br>` +
            `${EscapeHtml(T("stateNpcLabel"))}: ${gState.chars.map(c => EscapeHtml(c.name)).join(", ") || "—"}`
        );
    } else {
        $status.html(`<span style="color:#888">${EscapeHtml(T("inactive"))}</span>`);
        $summary.text(T("disabledPrompt"));
    }
}

function ExportState() {
    try {
        const data = JSON.stringify(gState, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `infoboard-state-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    } catch (e) {
        console.error("[IB] Export failed:", e);
    }
}

async function ImportStateFromFile(file) {
    if (!file) return;

    try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        gState = {
            ...JSON.parse(JSON.stringify(kDefaultState)),
            ...parsed,
            chars: Array.isArray(parsed.chars) ? parsed.chars : [],
            rels: Array.isArray(parsed.rels) ? parsed.rels : [],
            thoughts: Array.isArray(parsed.thoughts) ? parsed.thoughts : []
        };

        SaveState();
        UpdateStatusDisplay();
        UpdateLastUpdateDisplay();
        ReprocessChat();
    } catch (e) {
        console.error("[IB] Import failed:", e);
        alert(T("importFail"));
    }
}

jQuery(async () => {
    const stContext = SillyTavern.getContext();
    const injectionId = "IB_PromptInjection";

    function InjectPrompt() {
        try {
            if (!gEnabled) {
                stContext.setExtensionPrompt(injectionId, "", 1, 0);
                return;
            }

            const systemPrompt = gLang === "en" ? kSystemPromptEn : kSystemPromptRu;
            const fullPrompt = `${systemPrompt}\n\n${BuildStateInjection()}`;
            stContext.setExtensionPrompt(injectionId, fullPrompt, 1, 0);
        } catch (e) {
            console.error("[IB] InjectPrompt failed:", e);
        }
    }

    try {
        const settingsHtml = await $.get(kSettingsFile);
        const $extensions = $("#extensions_settings");
        const $existing = $extensions.find(".ib-settings");
        if ($existing.length > 0) {
            $existing.replaceWith(settingsHtml);
        } else {
            $extensions.append(settingsHtml);
        }
    } catch (e) {
        console.warn("[IB] settings.html not loaded:", e);
    }

    gEnabled = localStorage.getItem(kEnabledKey) === "true";
    gTheme = localStorage.getItem(kThemeKey) || "nocturne";
    gHideRaw = localStorage.getItem(kHideRawKey) !== "false";
    gShowNsfw = localStorage.getItem(kShowNsfwKey) !== "false";
    gLang = localStorage.getItem(kLangKey) || "ru";
    gBarStyle = localStorage.getItem(kBarStyleKey) || "deep";
    gCustomCss = localStorage.getItem(kCustomCssKey) || "";
    gHoverFx = localStorage.getItem(kHoverFxKey) !== "false";

    LoadState();
    ApplyCustomCss();

    $("#ib_enabled").prop("checked", gEnabled);
    $("#ib_lang").val(gLang);
    $("#ib_theme").val(gTheme);
    $("#ib_bar_style").val(gBarStyle);
    $("#ib_hide_raw").prop("checked", gHideRaw);
    $("#ib_show_nsfw").prop("checked", gShowNsfw);
    $("#ib_hover_fx").prop("checked", gHoverFx);
    $("#ib_custom_css").val(gCustomCss);

    UpdateSettingsText();
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();
    UpdateThemePreview();

    $("#ib_enabled").on("change", function () {
        gEnabled = $(this).is(":checked");
        localStorage.setItem(kEnabledKey, String(gEnabled));
        UpdateStatusDisplay();
        InjectPrompt();

        if (gEnabled) {
            ReprocessChat();
        } else {
            document.querySelectorAll(".ib-board-host").forEach(el => el.remove());
        }
    });

    $("#ib_lang").on("change", function () {
        gLang = $(this).val();
        localStorage.setItem(kLangKey, gLang);
        UpdateSettingsText();
        UpdateStatusDisplay();
        UpdateLastUpdateDisplay();
        UpdateThemePreview();
        InjectPrompt();
        ReprocessChat();
    });

    $("#ib_theme").on("change", function () {
        gTheme = $(this).val();
        localStorage.setItem(kThemeKey, gTheme);
        UpdateThemePreview();
        ReprocessChat();
    });

    $("#ib_bar_style").on("change", function () {
        gBarStyle = $(this).val();
        localStorage.setItem(kBarStyleKey, gBarStyle);
        ReprocessChat();
    });

    $("#ib_hover_fx").on("change", function () {
        gHoverFx = $(this).is(":checked");
        localStorage.setItem(kHoverFxKey, String(gHoverFx));
        ReprocessChat();
    });

    $("#ib_hide_raw").on("change", function () {
        gHideRaw = $(this).is(":checked");
        localStorage.setItem(kHideRawKey, String(gHideRaw));
        ReprocessChat();
    });

    $("#ib_show_nsfw").on("change", function () {
        gShowNsfw = $(this).is(":checked");
        localStorage.setItem(kShowNsfwKey, String(gShowNsfw));
        ReprocessChat();
    });

    $("#ib_save_custom_css").on("click", function () {
        gCustomCss = $("#ib_custom_css").val() || "";
        localStorage.setItem(kCustomCssKey, gCustomCss);
        ApplyCustomCss();
        ReprocessChat();
    });

    $("#ib_clear_custom_css").on("click", function () {
        if (!confirm(T("clearCustomCssConfirm"))) return;
        gCustomCss = "";
        localStorage.setItem(kCustomCssKey, "");
        $("#ib_custom_css").val("");
        ApplyCustomCss();
        ReprocessChat();
    });

    $("#ib_reset_state").on("click", function () {
        if (confirm(T("resetConfirm"))) {
            gState = JSON.parse(JSON.stringify(kDefaultState));
            SaveState();
            UpdateStatusDisplay();
            UpdateLastUpdateDisplay();
            ReprocessChat();
        }
    });

    $("#ib_reprocess_chat").on("click", function () {
        ReprocessChat();
    });

    $("#ib_export_state").on("click", function () {
        ExportState();
    });

    $("#ib_import_state").on("click", function () {
        $("#ib_import_file").trigger("click");
    });

    $("#ib_import_file").on("change", function (e) {
        const file = e.target.files?.[0];
        if (file) {
            ImportStateFromFile(file);
        }
        e.target.value = "";
    });

    if (stContext.eventTypes.GENERATION_STARTED) {
        stContext.eventSource.on(stContext.eventTypes.GENERATION_STARTED, InjectPrompt);
    }

    if (stContext.eventTypes.CHAT_CHANGED) {
        stContext.eventSource.on(stContext.eventTypes.CHAT_CHANGED, OnChatChanged);
    }

    if (stContext.eventTypes.MESSAGE_RECEIVED) {
        stContext.eventSource.on(stContext.eventTypes.MESSAGE_RECEIVED, () => {
            setTimeout(() => ReprocessChat(), 250);
            setTimeout(() => ReprocessChat(), 700);
            setTimeout(() => ReprocessChat(), 1400);
        });
    }

    if (stContext.eventTypes.MESSAGE_EDITED) {
    stContext.eventSource.on(stContext.eventTypes.MESSAGE_EDITED, () => {
        setTimeout(() => ReprocessChat(), 320);
        setTimeout(() => ReprocessChat(), 900);
    });
}

    if (stContext.eventTypes.MESSAGE_SWIPED) {
    stContext.eventSource.on(stContext.eventTypes.MESSAGE_SWIPED, () => {
        document.querySelectorAll(".ib-board-host").forEach(el => el.remove());

        setTimeout(() => ReprocessChat(), 250);
        setTimeout(() => ReprocessChat(), 700);
        setTimeout(() => ReprocessChat(), 1300);
        setTimeout(() => ReprocessChat(), 2000);
    });
}

    setTimeout(() => ReprocessChat(), 120);
    setTimeout(() => ReprocessChat(), 500);
    setTimeout(() => UpdateThemePreview(), 150);

    InjectPrompt();
    console.log("[IB] Infoboard extension ready");
});
