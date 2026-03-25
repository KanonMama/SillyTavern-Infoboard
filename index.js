const kExtensionName = "SillyTavern-Infoboard";
const kExtensionFolderPath = `scripts/extensions/third-party/${kExtensionName}`;
const kSettingsFile = `${kExtensionFolderPath}/settings.html`;

const kStorageKeyPrefix = "IB_State_";
const kEnabledKey = "IB_Enabled";
const kThemeKey = "IB_Theme";
const kHideRawKey = "IB_HideRaw";
const kShowThoughtsKey = "IB_ShowThoughts";
const kShowNsfwKey = "IB_ShowNsfw";
const kLangKey = "IB_Lang";
const kBarStyleKey = "IB_BarStyle";

let gEnabled = false;
let gTheme = "nocturne";
let gHideRaw = true;
let gShowThoughts = true;
let gShowNsfw = true;
let gLang = "ru";
let gBarStyle = "deep";

const kLang = {
    ru: {
        enable: "Enable Infoboard",
        language: "Язык",
        theme: "Тема",
        hideRaw: "Скрывать сырой XML из сообщений",
        showThoughts: "Показывать блок мыслей",
        showNsfw: "Показывать NSFW блок",
        active: "✦ Расширение активно",
        inactive: "Расширение отключено",
        currentState: "Текущее состояние:",
        noState: "Состояние не загружено.",
        noRecentUpdates: "Нет недавних изменений.",
        disabledPrompt: "Отключено — промт не инжектится.",
        chars: "💖 Персонажи в сцене",
        rels: "🤍 Отношения к тебе",
        thoughts: "💭 Скрытые мысли NPC",
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
        barStyle: "Стиль полос",
    },
    en: {
        enable: "Enable Infoboard",
        language: "Language",
        theme: "Theme",
        hideRaw: "Hide raw XML from messages",
        showThoughts: "Show thoughts section",
        showNsfw: "Show NSFW section",
        active: "✦ Extension is active",
        inactive: "Extension is inactive",
        currentState: "Current State:",
        noState: "No state loaded.",
        noRecentUpdates: "No recent updates.",
        disabledPrompt: "Disabled — not injecting prompts.",
        chars: "💖 Characters in Scene",
        rels: "🤍 Feelings Toward You",
        thoughts: "💭 Hidden NPC Thoughts",
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
        barStyle: "Bar Style",
    }
};

const kSystemPromptRu = `Infoboard:
Always append exactly one XML block at the end of every assistant response. Fill all field values in Russian. Keep entries concise, scene-accurate, and updated every message. Use this format strictly:

<infoboard time="" date="" weather="" loc="">
<chars>
<c icon="" name="" tags="" />
</chars>
<rels>
<rel source="" target="{{user}}" a="" ac="" tr="" tc="" l="" lc="" status="" />
</rels>
<thk></thk>
</infoboard>

Optional block only for explicitly intimate or aroused scenes:
<nsfw f="" p="" />

Rules:
- Always output exactly one <infoboard> block in every message.
- Fill all values in Russian.
- Add one <c /> for each NPC currently present in the scene.
- tags must contain 1-3 short tags separated by |
- Add one <rel /> for each present NPC describing their feelings toward {{user}}, never between NPCs
- Use a, tr, l as values from -100 to 100
- Negative affection means aversion or dislike
- Negative trust means distrust, suspicion, or fear
- Negative love means hatred, destructive obsession, or anti-attachment
- Use ac, tc, lc as per-message changes, usually within -5..+5 unless a major event just happened
- Relationship values must evolve logically and consistently
- Put all NPC private thoughts into one <thk> block
- In <thk>, each NPC starts on a new line in format: Имя: мысль
- Never write thoughts, feelings, or internal state for {{user}} inside <thk>
- If scene is not intimate, omit <nsfw /> completely
- Do not add any extra XML tags or commentary outside this format`;

const kSystemPromptEn = `Infoboard:
Always append exactly one XML block at the end of every assistant response. Fill all field values in English. Keep entries concise, scene-accurate, and updated every message. Use this format strictly:

<infoboard time="" date="" weather="" loc="">
<chars>
<c icon="" name="" tags="" />
</chars>
<rels>
<rel source="" target="{{user}}" a="" ac="" tr="" tc="" l="" lc="" status="" />
</rels>
<thk></thk>
</infoboard>

Optional block only for explicitly intimate or aroused scenes:
<nsfw f="" p="" />

Rules:
- Always output exactly one <infoboard> block in every message.
- Fill all values in English.
- Add one <c /> for each NPC currently present in the scene.
- tags must contain 1-3 short tags separated by |
- Add one <rel /> for each present NPC describing their feelings toward {{user}}, never between NPCs
- Use a, tr, l as values from -100 to 100
- Negative affection means aversion or dislike
- Negative trust means distrust, suspicion, or fear
- Negative love means hatred, destructive obsession, or anti-attachment
- Use ac, tc, lc as per-message changes, usually within -5..+5 unless a major event just happened
- Relationship values must evolve logically and consistently
- Put all NPC private thoughts into one <thk> block
- In <thk>, each NPC starts on a new line in format: Name: thought
- Never write thoughts, feelings, or internal state for {{user}} inside <thk>
- If scene is not intimate, omit <nsfw /> completely
- Do not add any extra XML tags or commentary outside this format`;

const kDefaultState = {
    time: "???",
    date: "???",
    weather: "???",
    loc: "???",
    chars: [],
    rels: [],
    thoughts: [],
    nsfw: null,
    lastUpdate: []
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
            if (!gState.lastUpdate) gState.lastUpdate = [];
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
    const cleaned = String(line || "").trim();
    if (!cleaned) return null;

    let idx = cleaned.indexOf(":");
    if (idx === -1) idx = cleaned.indexOf("—");
    if (idx === -1) idx = cleaned.indexOf("-");

    if (idx === -1) {
        return { name: "NPC", text: cleaned };
    }

    const name = cleaned.slice(0, idx).trim();
    const text = cleaned.slice(idx + 1).trim();

    if (!text) return null;
    return { name: name || "NPC", text };
}

function ParseInfoboard(text) {
    const boardMatch = text.match(/<infoboard[\s\S]*?<\/infoboard>/i);
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
            .slice(0, 3);

        result.chars.push({
            icon: c.getAttribute("icon") || "•",
            name,
            tags
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

    const tailText = text.slice(text.indexOf(xmlBlock) + xmlBlock.length);
    const nsfwParser = new DOMParser();
    const nsfwDoc = nsfwParser.parseFromString(`<root>${tailText}</root>`, "text/xml");
    const nsfwNode = nsfwDoc.querySelector("nsfw");

    if (nsfwNode) {
        result.nsfw = {
            f: nsfwNode.getAttribute("f") || "",
            p: nsfwNode.getAttribute("p") || ""
        };
    } else {
        const nsfwMatch = text.match(/<nsfw\s+f="(.*?)"\s+p="(.*?)"\s*\/?>/i);
        if (nsfwMatch) {
            result.nsfw = {
                f: nsfwMatch[1] || "",
                p: nsfwMatch[2] || ""
            };
        }
    }

    const charNames = new Set(result.chars.map(c => NormalizeName(c.name)));
    if (charNames.size > 0) {
        result.thoughts = result.thoughts.filter(t => {
            const n = NormalizeName(t.name);
            return n === "npc" || charNames.has(n);
        });
    }

    return result;
}

function BuildLastUpdate(parsed) {
    const updates = [];
    if (!parsed?.rels?.length) return updates;

    for (const r of parsed.rels) {
        const parts = [];
        if ((parseInt(r.ac) || 0) !== 0) parts.push(`${gLang === "ru" ? "симпатия" : "affection"} ${SignedText(r.ac)}`);
        if ((parseInt(r.tc) || 0) !== 0) parts.push(`${gLang === "ru" ? "доверие" : "trust"} ${SignedText(r.tc)}`);
        if ((parseInt(r.lc) || 0) !== 0) parts.push(`${gLang === "ru" ? "любовь" : "love"} ${SignedText(r.lc)}`);

        if (parts.length) {
            updates.push(`${r.source}: ${parts.join(", ")}`);
        }
    }

    return updates.slice(0, 6);
}

function UpdateStateFromParsed(parsed) {
    if (!parsed) return;

    gState.time = parsed.time || gState.time;
    gState.date = parsed.date || gState.date;
    gState.weather = parsed.weather || gState.weather;
    gState.loc = parsed.loc || gState.loc;
    gState.chars = parsed.chars || [];
    gState.rels = parsed.rels || [];
    gState.thoughts = parsed.thoughts || [];
    gState.nsfw = parsed.nsfw || null;
    gState.lastUpdate = BuildLastUpdate(parsed);

    SaveState();
}

function BuildStateInjection() {
    const lines = [];
    lines.push("[INFOBOARD STATE — ground truth, always use as the current baseline]");
    lines.push(`Time: ${gState.time}`);
    lines.push(`Date: ${gState.date}`);
    lines.push(`Weather: ${gState.weather}`);
    lines.push(`Location: ${gState.loc}`);

    if (gState.chars.length) {
        lines.push("Present NPCs:");
        for (const c of gState.chars) {
            lines.push(`- ${c.icon} ${c.name} [${c.tags.join(", ")}]`);
        }
    }

    if (gState.rels.length) {
        lines.push("NPC -> User Relations:");
        for (const r of gState.rels) {
            lines.push(`- ${r.source} -> ${r.target}: Affection ${r.a} (${SignedText(r.ac)}), Trust ${r.tr} (${SignedText(r.tc)}), Love ${r.l} (${SignedText(r.lc)}), Status: ${r.status}`);
        }
    }

    if (gState.thoughts.length) {
        lines.push("NPC Private Thoughts:");
        for (const t of gState.thoughts) {
            lines.push(`- ${t.name}: ${t.text}`);
        }
    }

    if (gState.nsfw) {
        lines.push(`NSFW: Fetishes: ${gState.nsfw.f} | Positions: ${gState.nsfw.p}`);
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

function GetMetricMeta(type, value) {
    const v = Clamp(parseInt(value) || 0, -100, 100);
    const abs = Math.abs(v);
    const saturation = 0.88 + abs / 420;
    const brightness = 0.95 + abs / 700;
    const glow = 2 + abs / 36;
    const alpha = 0.06 + abs / 900;

    if (type === "a") {
        return v >= 0
            ? { label: T("affection"), barClass: "ib-bar-affection-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(45, 169, 111, ${alpha});` }
            : { label: T("aversion"), barClass: "ib-bar-affection-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(181, 82, 82, ${alpha});` };
    }

    if (type === "tr") {
        return v >= 0
            ? { label: T("trust"), barClass: "ib-bar-trust-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(74, 135, 216, ${alpha});` }
            : { label: T("distrust"), barClass: "ib-bar-trust-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(184, 116, 66, ${alpha});` };
    }

    return v >= 0
        ? { label: T("love"), barClass: "ib-bar-love-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(138, 88, 212, ${alpha});` }
        : { label: T("hatred"), barClass: "ib-bar-love-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(169, 59, 88, ${alpha});` };
}

    if (type === "tr") {
        return v >= 0
            ? { label: T("trust"), barClass: "ib-bar-trust-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(74, 135, 216, ${alpha});` }
            : { label: T("distrust"), barClass: "ib-bar-trust-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(184, 116, 66, ${alpha});` };
    }

    return v >= 0
        ? { label: T("love"), barClass: "ib-bar-love-pos", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(138, 88, 212, ${alpha});` }
        : { label: T("hatred"), barClass: "ib-bar-love-neg", style: `filter:saturate(${saturation}) brightness(${brightness}); box-shadow:0 0 ${glow}px rgba(169, 59, 88, ${alpha});` };
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
                    </div>
                    <div class="ib-char-tags">
                        ${(c.tags || []).map(tag => `<span class="ib-tag">${EscapeHtml(tag)}</span>`).join("")}
                    </div>
                </div>
            `).join("")}
        </div>
    </div>`;
}

function RenderRelCard(r) {
    const statusClass = GetStatusClass(r.status);
    const aMeta = GetMetricMeta("a", r.a);
    const trMeta = GetMetricMeta("tr", r.tr);
    const lMeta = GetMetricMeta("l", r.l);

    return `
    <div class="ib-rel-card">
        <div class="ib-rel-head">
            <span>💕 ${EscapeHtml(r.source)} → ${EscapeHtml(r.target)}</span>
            <span class="ib-status-chip ${statusClass}">${EscapeHtml(r.status)}</span>
        </div>

        <div class="ib-meter">
            <div class="ib-meter-top">
                <span class="ib-meter-label" style="color:var(--ib-green)">${aMeta.label}</span>
                <span class="ib-meter-value">${r.a}/100 (${RenderDelta(r.ac)})</span>
            </div>
            <div class="ib-bar"><div class="ib-bar-fill ${aMeta.barClass}" style="width:${RenderBarWidth(r.a)}; ${aMeta.style}"></div></div>
        </div>

        <div class="ib-meter">
            <div class="ib-meter-top">
                <span class="ib-meter-label" style="color:var(--ib-blue)">${trMeta.label}</span>
                <span class="ib-meter-value">${r.tr}/100 (${RenderDelta(r.tc)})</span>
            </div>
            <div class="ib-bar"><div class="ib-bar-fill ${trMeta.barClass}" style="width:${RenderBarWidth(r.tr)}; ${trMeta.style}"></div></div>
        </div>

        <div class="ib-meter">
            <div class="ib-meter-top">
                <span class="ib-meter-label" style="color:var(--ib-purple)">${lMeta.label}</span>
                <span class="ib-meter-value">${r.l}/100 (${RenderDelta(r.lc)})</span>
            </div>
            <div class="ib-bar"><div class="ib-bar-fill ${lMeta.barClass}" style="width:${RenderBarWidth(r.l)}; ${lMeta.style}"></div></div>
        </div>
    </div>`;
}

function RenderRelations(rels) {
    if (!rels.length) return "";

    return `
    <div class="ib-section">
        <div class="ib-section-title">${T("rels")}</div>
        ${rels.map(RenderRelCard).join("")}
    </div>`;
}

function RenderThoughts(thoughts) {
    if (!gShowThoughts || !thoughts.length) return "";

    return `
    <div class="ib-section">
        <div class="ib-section-title">${T("thoughts")}</div>
        <div class="ib-thought-list">
            ${thoughts.map(t => `
                <div class="ib-thought-card">
                    <div class="ib-thought-head">
                        <span class="ib-thought-dot">✦</span>
                        <span class="ib-thought-name">${EscapeHtml(t.name)}</span>
                    </div>
                    <div class="ib-thought-text">${EscapeHtml(t.text)}</div>
                </div>
            `).join("")}
        </div>
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

function RenderLastUpdate(lines) {
    if (!lines?.length) return "";
    return `
    <div class="ib-update-line">
        ${lines.map(line => `• ${EscapeHtml(line)}`).join("<br>")}
    </div>`;
}

function RenderBoard(state, isFresh = false) {
    return `
    <div class="ib-board ib-theme-${EscapeHtml(gTheme)} ib-bars-${EscapeHtml(gBarStyle)} ${isFresh ? "ib-fresh" : ""}">
        <div class="ib-title">${T("title")}</div>

        <div class="ib-header">
            <div class="ib-header-location">
                <span class="ib-header-location-icon">📍</span>
                <span class="ib-header-location-text">${RenderMaybeUnknown(state.loc)}</span>
            </div>

            <div class="ib-header-meta">
                <span class="ib-meta-pill">⏰ ${RenderMaybeUnknown(state.time)}</span>
                <span class="ib-meta-pill">📅 ${RenderMaybeUnknown(state.date)}</span>
                <span class="ib-meta-pill">☁ ${RenderMaybeUnknown(state.weather)}</span>
            </div>
        </div>

        ${RenderChars(state.chars)}
        ${RenderRelations(state.rels)}
        ${RenderThoughts(state.thoughts)}
        ${RenderNsfw(state.nsfw)}
        ${RenderLastUpdate(state.lastUpdate)}
    </div>`;
}

function RemoveThoughtLeaks(messageTextEl, parsed) {
    if (!messageTextEl || !parsed?.thoughts?.length) return;

    const thoughtTexts = parsed.thoughts
        .map(t => NormalizeName(t.text))
        .filter(Boolean);

    if (!thoughtTexts.length) return;

    messageTextEl.querySelectorAll("p").forEach(p => {
        const pText = NormalizeName(p.textContent || "");
        if (!pText) return;

        const isLeak = thoughtTexts.some(t => pText.includes(t) || t.includes(pText));
        if (isLeak) {
            p.remove();
        }
    });
}

function RemoveRawXmlFromText(messageTextEl, parsed) {
    if (!gHideRaw) return;
    if (!messageTextEl || !parsed?.rawXml) return;

    let html = messageTextEl.innerHTML;
    const escapedRaw = parsed.rawXml.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(escapedRaw, "g"), "");

    html = html
        .replace(/<nsfw\s+f="[\s\S]*?"\s+p="[\s\S]*?"\s*\/?>/gi, "")
        .replace(/<thk>[\s\S]*?<\/thk>/gi, "")
        .replace(/(?:<br\s*\/?>\s*){2,}/gi, "<br>");

    messageTextEl.innerHTML = html;
    RemoveThoughtLeaks(messageTextEl, parsed);
}

function UpdateLastUpdateDisplay() {
    const $el = $("#ib_last_update");
    if (!gState.lastUpdate?.length) {
        $el.text(T("noRecentUpdates"));
        return;
    }
    $el.html(gState.lastUpdate.map(x => `• ${EscapeHtml(x)}`).join("<br>"));
}

function UpdateSettingsText() {
    $('label[for="ib_enabled"]').html(`<b>${T("enable")}</b>`);
    $('label[for="ib_lang"]').html(`<b>${T("language")}</b>`);
    $('label[for="ib_theme"]').html(`<b>${T("theme")}</b>`);
    $('label[for="ib_bar_style"]').html(`<b>${T("barStyle")}</b>`);
    $('label[for="ib_hide_raw"]').text(T("hideRaw"));
    $('label[for="ib_show_thoughts"]').text(T("showThoughts"));
    $('label[for="ib_show_nsfw"]').text(T("showNsfw"));
    $("#ib_state_label").text(T("currentState"));
    $("#ib_reset_state").text(T("resetState"));
    $("#ib_reprocess_chat").text(T("reprocess"));
    $("#ib_export_state").text(T("exportState"));
    $("#ib_import_state").text(T("importState"));
}

function ProcessMessage(messageDiv, msgIndex) {
    if (!gEnabled) return;

    const stContext = SillyTavern.getContext();
    const msg = stContext.chat[msgIndex];
    if (!msg || msg.is_user) return;

    const text = msg.mes || "";
    const parsed = ParseInfoboard(text);
    if (!parsed) return;

    UpdateStateFromParsed(parsed);
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

    const mesTextEl = messageDiv.querySelector(".mes_text");
    if (!mesTextEl) return;

    const existing = mesTextEl.querySelector(".ib-board");
    if (existing) existing.remove();

    RemoveRawXmlFromText(mesTextEl, parsed);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = RenderBoard({
        ...parsed,
        lastUpdate: BuildLastUpdate(parsed)
    }, true);

    const boardEl = wrapper.firstElementChild;
    if (boardEl) mesTextEl.appendChild(boardEl);
}

function ReprocessChat() {
    const stContext = SillyTavern.getContext();
    if (!stContext.chat) return;

    gState = JSON.parse(JSON.stringify(kDefaultState));

    for (let i = 0; i < stContext.chat.length; i++) {
        const msg = stContext.chat[i];
        if (!msg?.is_user && msg.mes) {
            const parsed = ParseInfoboard(msg.mes);
            if (parsed) {
                UpdateStateFromParsed(parsed);
            }
        }
    }

    document.querySelectorAll(".mes").forEach(node => {
        const msgId = Number(node.getAttribute("mesid"));
        if (!isNaN(msgId)) {
            const stMsg = stContext.chat[msgId];
            if (!stMsg?.is_user) {
                const parsed = ParseInfoboard(stMsg?.mes || "");
                const mesTextEl = node.querySelector(".mes_text");
                if (mesTextEl) {
                    const existing = mesTextEl.querySelector(".ib-board");
                    if (existing) existing.remove();

                    if (parsed) {
                        RemoveRawXmlFromText(mesTextEl, parsed);
                        const wrapper = document.createElement("div");
                        wrapper.innerHTML = RenderBoard({
                            ...parsed,
                            lastUpdate: BuildLastUpdate(parsed)
                        }, false);
                        const boardEl = wrapper.firstElementChild;
                        if (boardEl) mesTextEl.appendChild(boardEl);
                    }
                }
            }
        }
    });

    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();
}

function OnChatChanged() {
    LoadState();
    UpdateSettingsText();
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

    if (!gEnabled) return;
    setTimeout(ReprocessChat, 150);
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
            lastUpdate: Array.isArray(parsed.lastUpdate) ? parsed.lastUpdate : []
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
            console.log("[IB] Prompt injected:", fullPrompt.length);
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
    gShowThoughts = localStorage.getItem(kShowThoughtsKey) !== "false";
    gShowNsfw = localStorage.getItem(kShowNsfwKey) !== "false";
    gLang = localStorage.getItem(kLangKey) || "ru";
    gBarStyle = localStorage.getItem(kBarStyleKey) || "deep";

    LoadState();

$("#ib_enabled").prop("checked", gEnabled);
$("#ib_lang").val(gLang);
$("#ib_theme").val(gTheme);
$("#ib_bar_style").val(gBarStyle);
$("#ib_hide_raw").prop("checked", gHideRaw);
$("#ib_show_thoughts").prop("checked", gShowThoughts);
$("#ib_show_nsfw").prop("checked", gShowNsfw);

    UpdateSettingsText();
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

    $("#ib_enabled").on("change", function () {
        gEnabled = $(this).is(":checked");
        localStorage.setItem(kEnabledKey, String(gEnabled));
        UpdateStatusDisplay();
        InjectPrompt();

        $("#ib_bar_style").on("change", function () {
    gBarStyle = $(this).val();
    localStorage.setItem(kBarStyleKey, gBarStyle);
    ReprocessChat();
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

    $("#ib_hide_raw").on("change", function () {
        gHideRaw = $(this).is(":checked");
        localStorage.setItem(kHideRawKey, String(gHideRaw));
        ReprocessChat();
    });

    $("#ib_show_thoughts").on("change", function () {
        gShowThoughts = $(this).is(":checked");
        localStorage.setItem(kShowThoughtsKey, String(gShowThoughts));
        ReprocessChat();
    });

    $("#ib_show_nsfw").on("change", function () {
        gShowNsfw = $(this).is(":checked");
        localStorage.setItem(kShowNsfwKey, String(gShowNsfw));
        ReprocessChat();
    });

    $("#ib_reset_state").on("click", function () {
        if (confirm(T("resetConfirm"))) {
            gState = JSON.parse(JSON.stringify(kDefaultState));
            SaveState();
            UpdateStatusDisplay();
            UpdateLastUpdateDisplay();
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
        stContext.eventSource.on(stContext.eventTypes.MESSAGE_RECEIVED, (msgIndex) => {
            setTimeout(() => {
                const msgDiv = document.querySelector(`.mes[mesid="${msgIndex}"]`);
                if (msgDiv) ProcessMessage(msgDiv, msgIndex);
            }, 150);
        });
    }

    if (stContext.eventTypes.MESSAGE_EDITED) {
        stContext.eventSource.on(stContext.eventTypes.MESSAGE_EDITED, (msgIndex) => {
            setTimeout(() => {
                const msgDiv = document.querySelector(`.mes[mesid="${msgIndex}"]`);
                if (msgDiv) ProcessMessage(msgDiv, msgIndex);
            }, 150);
        });
    }

    if (stContext.eventTypes.MESSAGE_SWIPED) {
        stContext.eventSource.on(stContext.eventTypes.MESSAGE_SWIPED, (msgIndex) => {
            setTimeout(() => {
                const msgDiv = document.querySelector(`.mes[mesid="${msgIndex}"]`);
                if (msgDiv) ProcessMessage(msgDiv, msgIndex);
            }, 150);
        });
    }

    const chatContainer = document.getElementById("chat");
    if (chatContainer) {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.classList?.contains("mes")) {
                        const msgId = Number(node.getAttribute("mesid"));
                        if (!isNaN(msgId)) {
                            setTimeout(() => ProcessMessage(node, msgId), 150);
                        }
                    }
                }
            }
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    document.querySelectorAll(".mes").forEach(node => {
        const msgId = Number(node.getAttribute("mesid"));
        if (!isNaN(msgId)) {
            ProcessMessage(node, msgId);
        }
    });

    InjectPrompt();
    console.log("[IB] Infoboard extension ready");
});
