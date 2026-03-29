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
const kShowBeatKey = "IB_ShowBeat";

let gEnabled = false;
let gTheme = "nocturne";
let gHideRaw = true;
let gShowNsfw = true;
let gLang = "ru";
let gBarStyle = "deep";
let gCustomCss = "";
let gHoverFx = true;
let gShowBeat = true;

const kLang = {
    ru: {
        enable: "Enable Infoboard",
        language: "Язык",
        theme: "Тема",
        barStyle: "Стиль полос",
        hideRaw: "Скрывать сырой XML из сообщений",
        showNsfw: "Показывать NSFW блок",
        hoverFx: "Включить hover-эффекты статов",
        showBeat: "Показывать next beat",
        active: "✦ Расширение активно",
        inactive: "Расширение отключено",
        currentState: "Текущее состояние:",
        noRecentUpdates: "Нет недавних изменений.",
        disabledPrompt: "Отключено — промт не инжектится.",
        chars: "💖 Персонажи в сцене",
        rels: "🤍 Отношения к тебе",
        nsfw: "🔥 Интимный контекст",
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
        nextBeat: "Следующий такт",
        noBeat: "Нет прогноза сцены.",
        compactMore: "ещё",
        focus: "в фокусе",
        activeHere: "активен",
        nearby: "рядом",
        watching: "наблюдает",
        background: "на периферии",
        leftScene: "вышел",
        openNpc: "Открыть NPC",
        closeNpc: "Скрыть NPC"
    },
    en: {
        enable: "Enable Infoboard",
        language: "Language",
        theme: "Theme",
        barStyle: "Bar Style",
        hideRaw: "Hide raw XML from messages",
        showNsfw: "Show NSFW section",
        hoverFx: "Enable stat hover effects",
        showBeat: "Show next beat",
        active: "✦ Extension is active",
        inactive: "Extension is inactive",
        currentState: "Current State:",
        noRecentUpdates: "No recent updates.",
        disabledPrompt: "Disabled — not injecting prompts.",
        chars: "💖 Characters in Scene",
        rels: "🤍 Feelings Toward You",
        nsfw: "🔥 Intimate Context",
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
        nextBeat: "Next Beat",
        noBeat: "No scene forecast.",
        compactMore: "more",
        focus: "focus",
        activeHere: "active",
        nearby: "nearby",
        watching: "watching",
        background: "background",
        leftScene: "left",
        openNpc: "Open NPC",
        closeNpc: "Hide NPC"
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
<beat></beat>
</infoboard>

Optional only for explicitly intimate scenes:
<nsfw f="" p="" />

Rules:
- Output exactly one <infoboard> block in every message
- Fill all values in Russian
- Add one <c /> for each NPC currently present
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
- <beat> must contain one short likely next beat of the scene based on current interaction
- <beat> must be near-term, grounded, and concise
- Omit <nsfw /> if the scene is not intimate
- No extra XML tags or commentary

<thk> strict format:
- Use the exact full NPC name exactly as in <chars>
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
<beat></beat>
</infoboard>

Optional only for explicitly intimate scenes:
<nsfw f="" p="" />

Rules:
- Output exactly one <infoboard> block in every message
- Fill all values in English
- Add one <c /> for each NPC currently present
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
- <beat> must contain one short likely next beat of the scene based on current interaction
- <beat> must be near-term, grounded, and concise
- Omit <nsfw /> if the scene is not intimate
- No extra XML tags or commentary

<thk> strict format:
- Use the exact full NPC name exactly as in <chars>
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
    nsfw: null,
    beat: ""
};

let gState = JSON.parse(JSON.stringify(kDefaultState));

function T(key) {
    return kLang[gLang]?.[key] ?? key;
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
            if (typeof gState.beat !== "string") gState.beat = "";
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
        .replace(/[*_~`"]/g, "")
        .replace(/[—–-]/g, ":")
        .replace(/\s+/g, " ")
        .trim();
}

function GetNameAliases(name) {
    const raw = String(name ?? "").trim();
    if (!raw) return [];

    const clean = raw
        .replace(/[*_~`"]/g, "")
        .replace(/\s+/g, " ")
        .trim();

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
            if (x.includes(y) || y.includes(x)) return true;
        }
    }

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

    let idx = cleaned.indexOf(":");
    if (idx === -1) idx = cleaned.indexOf("—");
    if (idx === -1) idx = cleaned.indexOf("-");

    if (idx === -1) {
        return { name: "NPC", text: cleaned };
    }

    const name = cleaned.slice(0, idx).trim();
    const text = cleaned.slice(idx + 1).trim();

    if (!text) return null;

    return {
        name: name || "NPC",
        text: text
            .replace(/^\s*[*_~`]+/, "")
            .replace(/[*_~`]+\s*$/, "")
            .trim()
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
        beat: "",
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

    const relNodes = doc.querySelectorAll("rels > rel");
    relNodes.forEach(rel => {
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
    });

    if (!result.rels.length) {
        doc.querySelectorAll("rel").forEach(rel => {
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
        });
    }

    const thk = doc.querySelector("thk");
    if (thk) {
        const rawThoughts = thk.textContent || "";
        const lines = rawThoughts
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

        result.thoughts = lines
            .map(ParseThoughtLine)
            .filter(Boolean)
            .filter(t => !IsUserLikeName(t.name));
    }

    const beatNode = doc.querySelector("beat");
    if (beatNode) {
        result.beat = String(beatNode.textContent || "").trim();
    }

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

    if (result.chars.length > 0) {
        result.thoughts = result.thoughts.filter(t => {
            const n = NormalizeName(t.name);
            if (n === "npc") return true;
            return result.chars.some(c => NamesLikelyMatch(c.name, t.name));
        });
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

    if (gState.beat) {
        lines.push(`Next Beat: ${gState.beat}`);
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
        <div class="ib-section-title">${T("chars")}</div>
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

function RenderThoughtForNpc(thoughts, npcName) {
    const found = thoughts.find(t => NamesLikelyMatch(t.name, npcName));
    if (!found) return "";
    return `
    <div class="ib-rel-thought">
        <div class="ib-rel-subtitle">💭</div>
        <div class="ib-rel-thought-text">${EscapeHtml(found.text)}</div>
    </div>`;
}

function RenderRelCard(r, thoughts = [], prevState = null) {
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
            ${RenderThoughtForNpc(thoughts, r.source)}
        </div>
    </div>`;
}

function RenderRelations(rels, thoughts = [], prevState = null) {
    if (!rels.length) return "";

    const sorted = SortRelationsByPriority(rels);

    return `
    <div class="ib-section">
        <div class="ib-section-title">${T("rels")}</div>
        ${sorted.map(r => RenderRelCard(r, thoughts, prevState)).join("")}
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

function RenderBeat(state) {
    if (!gShowBeat) return "";
    const beat = String(state?.beat || "").trim();
    if (!beat) return "";

    return `
    <div class="ib-beat-wrap">
        <div class="ib-beat">
            <span class="ib-beat-icon">➜</span>
            <span class="ib-beat-label">${EscapeHtml(T("nextBeat"))}:</span>
            <span class="ib-beat-text">${EscapeHtml(beat)}</span>
        </div>
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
    return `
    <div class="ib-board ib-theme-${EscapeHtml(gTheme)} ib-bars-${EscapeHtml(gBarStyle)} ${gHoverFx ? "ib-hoverfx" : ""} ib-mode-full ${isFresh ? "ib-fresh" : ""}">
        <div class="ib-title">${T("title")}</div>

        <div class="ib-collapsed-wrap">
            <div class="ib-collapsed-tag">
                <span></span>
                <span class="ib-collapsed-title">✦ ${T("title")}</span>
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
            <div class="ib-compact-loc">📍 ${RenderMaybeUnknown(state.loc)}</div>
        </div>

        <div class="ib-full-wrap">
            <div class="ib-header">
                <div class="ib-header-main">
                    <div class="ib-header-location">
                        <span class="ib-header-location-icon">📍</span>
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
                ${RenderBeat(state)}
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
                    txt.includes("<beat") ||
                    txt.includes("</beat>") ||
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
            .replace(/<beat[\s\S]*?<\/beat>/gi, "")
            .replace(/<nsfw\b[\s\S]*?\/?>/gi, "")
            .replace(/\n{3,}/g, "\n\n");

        if (next !== text) {
            node.textContent = next;
        }
    }
}

function RemoveThoughtLeaksInContainer(messageTextEl, parsed) {
    if (!messageTextEl || !parsed?.thoughts?.length) return;

    const thoughtEntries = parsed.thoughts.map(t => ({
        full: NormalizeLooseText(`${t.name}: ${t.text}`),
        text: NormalizeLooseText(t.text),
        aliases: GetNameAliases(t.name).map(NormalizeLooseText),
    }));

    const children = [...messageTextEl.children];

    for (const el of children) {
        if (el.classList?.contains("ib-board-host") || el.classList?.contains("ib-board")) continue;
        if (el.closest?.(".ib-board-host") || el.closest?.(".ib-board")) continue;

        const text = NormalizeLooseText(el.textContent || "");
        if (!text) continue;

        const isThoughtLeak = thoughtEntries.some(t => {
            const aliasHit = t.aliases.some(a => a && text.includes(a));
            const textHit =
                (t.full && text.includes(t.full)) ||
                (t.text && text.includes(t.text)) ||
                (t.text && t.text.includes(text) && text.length > 20);

            return textHit || (aliasHit && t.text && text.includes(t.text.slice(0, 16)));
        });

        if (isThoughtLeak) {
            el.remove();
        }
    }
}

function UpdateLastUpdateDisplay() {
    const $el = $("#ib_last_update");
    const beat = String(gState.beat || "").trim();
    if (!gShowBeat || !beat) {
        $el.text(T("noRecentUpdates"));
        return;
    }
    $el.text(beat);
}

function UpdateSettingsText() {
    $('label[for="ib_enabled"]').html(`<b>${T("enable")}</b>`);
    $('label[for="ib_lang"]').html(`<b>${T("language")}</b>`);
    $('label[for="ib_theme"]').html(`<b>${T("theme")}</b>`);
    $('label[for="ib_bar_style"]').html(`<b>${T("barStyle")}</b>`);
    $('label[for="ib_hide_raw"]').text(T("hideRaw"));
    $('label[for="ib_show_nsfw"]').text(T("showNsfw"));
    $('label[for="ib_hover_fx"]').text(T("hoverFx"));
    $('label[for="ib_show_beat"]').text(T("showBeat"));
    $("#ib_state_label").text(T("currentState"));
    $("#ib_reset_state").text(T("resetState"));
    $("#ib_reprocess_chat").text(T("reprocess"));
    $("#ib_export_state").text(T("exportState"));
    $("#ib_import_state").text(T("importState"));
    $("#ib_custom_css_label").text(T("customCssLabel"));
    $("#ib_custom_css_help").text(T("customCssHelp"));
    $("#ib_save_custom_css").text(T("saveCustomCss"));
    $("#ib_clear_custom_css").text(T("clearCustomCss"));
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
    gState.beat = parsed.beat || "";
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

    const host = GetOrCreateBoardHost(mesTextEl);
    host.innerHTML = RenderBoard(parsed, isFresh, prevState);

    const boardEl = host.firstElementChild;
    if (boardEl) {
        WireBoardControls(boardEl);
        ForceRepaint(boardEl);
    }

    CleanupBoardHosts(mesTextEl);
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
        rollingState.beat = parsed.beat || "";

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
            thoughts: Array.isArray(parsed.thoughts) ? parsed.thoughts : [],
            beat: typeof parsed.beat === "string" ? parsed.beat : ""
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
    gShowBeat = localStorage.getItem(kShowBeatKey) !== "false";

    LoadState();
    ApplyCustomCss();

    $("#ib_enabled").prop("checked", gEnabled);
    $("#ib_lang").val(gLang);
    $("#ib_theme").val(gTheme);
    $("#ib_bar_style").val(gBarStyle);
    $("#ib_hide_raw").prop("checked", gHideRaw);
    $("#ib_show_nsfw").prop("checked", gShowNsfw);
    $("#ib_hover_fx").prop("checked", gHoverFx);
    $("#ib_show_beat").prop("checked", gShowBeat);
    $("#ib_custom_css").val(gCustomCss);

    UpdateSettingsText();
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

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
        InjectPrompt();
        ReprocessChat();
    });

    $("#ib_theme").on("change", function () {
        gTheme = $(this).val();
        localStorage.setItem(kThemeKey, gTheme);
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

    $("#ib_show_beat").on("change", function () {
        gShowBeat = $(this).is(":checked");
        localStorage.setItem(kShowBeatKey, String(gShowBeat));
        UpdateLastUpdateDisplay();
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
        });
    }

    if (stContext.eventTypes.MESSAGE_SWIPED) {
        stContext.eventSource.on(stContext.eventTypes.MESSAGE_SWIPED, () => {
            setTimeout(() => ReprocessChat(), 280);
            setTimeout(() => ReprocessChat(), 700);
        });
    }

    setTimeout(() => ReprocessChat(), 120);
    setTimeout(() => ReprocessChat(), 500);

    InjectPrompt();
    console.log("[IB] Infoboard extension ready");
});
