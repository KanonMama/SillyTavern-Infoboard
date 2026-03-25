const kExtensionName = "SillyTavern-Infoboard";
const kExtensionFolderPath = `scripts/extensions/third-party/${kExtensionName}`;
const kSettingsFile = `${kExtensionFolderPath}/settings.html`;

const kStorageKeyPrefix = "IB_State_";
const kEnabledKey = "IB_Enabled";
const kThemeKey = "IB_Theme";
const kHideRawKey = "IB_HideRaw";
const kShowThoughtsKey = "IB_ShowThoughts";
const kShowNsfwKey = "IB_ShowNsfw";

let gEnabled = false;
let gTheme = "nocturne";
let gHideRaw = true;
let gShowThoughts = true;
let gShowNsfw = true;

const kSystemPrompt = `Infoboard:
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
- Use a, tr, l as values from 0 to 100
- Use ac, tc, lc as per-message changes, usually within -5..+5 unless a major event just happened
- Relationship values must evolve logically and consistently
- Love should not sharply increase without enough affection and trust
- Put all NPC private thoughts into one <thk> block
- In <thk>, each NPC starts on a new line in format: Имя: мысль
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
        n === "герой";
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

    const fullBoardMatch = text.match(/(<infoboard[\s\S]*?<\/infoboard>)([\s\S]*?)$/i);
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
        rawXml: fullBoardMatch ? fullBoardMatch[1] : xmlBlock
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
    const target = rel.getAttribute("target") || "{{user}}";

    if (IsUserLikeName(source)) return;

    result.rels.push({
        source,
        target,
        a: Clamp(parseInt(rel.getAttribute("a")) || 0, 0, 100),
        ac: Clamp(parseInt(rel.getAttribute("ac")) || 0, -100, 100),
        tr: Clamp(parseInt(rel.getAttribute("tr")) || 0, 0, 100),
        tc: Clamp(parseInt(rel.getAttribute("tc")) || 0, -100, 100),
        l: Clamp(parseInt(rel.getAttribute("l")) || 0, 0, 100),
        lc: Clamp(parseInt(rel.getAttribute("lc")) || 0, -100, 100),
        status: rel.getAttribute("status") || "не определено"
    });
});

    // fallback for old single <rel /> format
    if (!result.rels.length) {
    doc.querySelectorAll("rel").forEach(rel => {
        const source = rel.getAttribute("source") || "???";
        const target = rel.getAttribute("target") || "{{user}}";

        if (IsUserLikeName(source)) return;

        result.rels.push({
            source,
            target,
            a: Clamp(parseInt(rel.getAttribute("a")) || 0, 0, 100),
            ac: Clamp(parseInt(rel.getAttribute("ac")) || 0, -100, 100),
            tr: Clamp(parseInt(rel.getAttribute("tr")) || 0, 0, 100),
            tc: Clamp(parseInt(rel.getAttribute("tc")) || 0, -100, 100),
            l: Clamp(parseInt(rel.getAttribute("l")) || 0, 0, 100),
            lc: Clamp(parseInt(rel.getAttribute("lc")) || 0, -100, 100),
            status: rel.getAttribute("status") || "не определено"
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
        if ((parseInt(r.ac) || 0) !== 0) parts.push(`симпатия ${SignedText(r.ac)}`);
        if ((parseInt(r.tc) || 0) !== 0) parts.push(`доверие ${SignedText(r.tc)}`);
        if ((parseInt(r.lc) || 0) !== 0) parts.push(`любовь ${SignedText(r.lc)}`);

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

function GetStatusClass(status) {
    const s = NormalizeName(status);

    const romantic = ["роман", "любов", "влюб", "пара", "отношен", "свидан", "любовники", "муж", "жена", "соулмейт", "dating", "lover", "romantic", "married", "soulmate"];
    const negative = ["враг", "ненав", "токс", "абьюз", "сопер", "rival", "enemy", "abusive", "toxic", "ex-", "бывш"];
    const complex = ["сложн", "одерж", "защит", "ментор", "учен", "family", "нераздел", "complicated", "protective", "mentor", "unrequited", "obsession"];

    if (romantic.some(k => s.includes(k))) return "ib-status-romantic";
    if (negative.some(k => s.includes(k))) return "ib-status-negative";
    if (complex.some(k => s.includes(k))) return "ib-status-complex";
    return "ib-status-neutral";
}

function RenderChars(chars) {
    if (!chars.length) return "";

    return `
    <div class="ib-section">
        <div class="ib-section-title">💖 Персонажи в сцене</div>
        <div class="ib-chars">
            ${chars.map(c => `
                <div class="ib-char">
                    <div class="ib-char-main">
                        <span class="ib-char-icon-wrap"><span class="ib-char-icon">${EscapeHtml(c.icon)}</span></span>
                        <span class="ib-char-name">${EscapeHtml(c.name)}</span>
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

    return `
    <div class="ib-rel-card">
        <div class="ib-rel-head">
            <span>💕 ${EscapeHtml(r.source)} → ${EscapeHtml(r.target)}</span>
            <span class="ib-status-chip ${statusClass}">${EscapeHtml(r.status)}</span>
        </div>

        <div class="ib-meter">
            <div class="ib-meter-top">
                <span class="ib-meter-label" style="color:var(--ib-green)">💚 Симпатия</span>
                <span class="ib-meter-value">${r.a}/100 (${RenderDelta(r.ac)})</span>
            </div>
            <div class="ib-bar"><div class="ib-bar-fill ib-bar-affection" style="width:${Clamp(r.a, 0, 100)}%"></div></div>
        </div>

        <div class="ib-meter">
            <div class="ib-meter-top">
                <span class="ib-meter-label" style="color:var(--ib-blue)">💙 Доверие</span>
                <span class="ib-meter-value">${r.tr}/100 (${RenderDelta(r.tc)})</span>
            </div>
            <div class="ib-bar"><div class="ib-bar-fill ib-bar-trust" style="width:${Clamp(r.tr, 0, 100)}%"></div></div>
        </div>

        <div class="ib-meter">
            <div class="ib-meter-top">
                <span class="ib-meter-label" style="color:var(--ib-purple)">💜 Любовь</span>
                <span class="ib-meter-value">${r.l}/100 (${RenderDelta(r.lc)})</span>
            </div>
            <div class="ib-bar"><div class="ib-bar-fill ib-bar-love" style="width:${Clamp(r.l, 0, 100)}%"></div></div>
        </div>

        <div class="ib-rel-status-note">📋 Динамика: ${EscapeHtml(r.status)}</div>
    </div>`;
}

function RenderRelations(rels) {
    if (!rels.length) return "";

    return `
    <div class="ib-section">
        <div class="ib-section-title">🤍 Отношения к тебе</div>
        ${rels.map(RenderRelCard).join("")}
    </div>`;
}

function RenderThoughts(thoughts) {
    if (!gShowThoughts || !thoughts.length) return "";

    return `
    <div class="ib-section">
        <div class="ib-section-title">💭 Скрытые мысли NPC</div>
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
        <div class="ib-section-title">🔥 Интимный контекст</div>
        <div class="ib-nsfw-line"><b>Фетиши:</b> ${EscapeHtml(nsfw.f)}</div>
        <div class="ib-nsfw-line"><b>Позиции:</b> ${EscapeHtml(nsfw.p)}</div>
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
    <div class="ib-board ib-theme-${EscapeHtml(gTheme)} ${isFresh ? "ib-fresh" : ""}">
        <div class="ib-title">✦ INFOBOARD ✦</div>

        <div class="ib-header">
            <div class="ib-header-left">
                <span>⏰ <b>${EscapeHtml(state.time)}</b></span>
                <span class="ib-sep">│</span>
                <span>📅 <b>${EscapeHtml(state.date)}</b></span>
                <span class="ib-sep">│</span>
                <span class="ib-weather-chip">🌧 ${EscapeHtml(state.weather)}</span>
            </div>
            <div class="ib-header-right">
                <span class="ib-loc-chip">📍 <b>${EscapeHtml(state.loc)}</b></span>
            </div>
        </div>

        ${RenderChars(state.chars)}
        ${RenderRelations(state.rels)}
        ${RenderThoughts(state.thoughts)}
        ${RenderNsfw(state.nsfw)}
        ${RenderLastUpdate(state.lastUpdate)}
    </div>`;
}

function RemoveRawXmlFromText(messageTextEl, parsed) {
    if (!gHideRaw) return;
    if (!messageTextEl || !parsed?.rawXml) return;

    let html = messageTextEl.innerHTML;
    const escapedRaw = parsed.rawXml.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(escapedRaw, "g"), "");

    html = html
        .replace(/<nsfw\s+f="[\s\S]*?"\s+p="[\s\S]*?"\s*\/?>/gi, "")
        .replace(/(?:<br\s*\/?>\s*){2,}/gi, "<br>");

    messageTextEl.innerHTML = html;
}

function UpdateLastUpdateDisplay() {
    const $el = $("#ib_last_update");
    if (!gState.lastUpdate?.length) {
        $el.text("No recent updates.");
        return;
    }
    $el.html(gState.lastUpdate.map(x => `• ${EscapeHtml(x)}`).join("<br>"));
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
            const fresh = false;

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
                        }, fresh);
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
    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

    if (!gEnabled) return;
    setTimeout(ReprocessChat, 150);
}

function UpdateStatusDisplay() {
    const $status = $("#ib_status");
    const $summary = $("#ib_state_summary");

    if (gEnabled) {
        $status.html(`<span style="color:#7fb68a">✦ Extension is active</span>`);
        $summary.html(
            `${EscapeHtml(gState.time)} | ${EscapeHtml(gState.date)}<br>` +
            `${EscapeHtml(gState.weather)}<br>` +
            `📍 ${EscapeHtml(gState.loc)}<br>` +
            `NPCs: ${gState.chars.map(c => EscapeHtml(c.name)).join(", ") || "—"}`
        );
    } else {
        $status.html(`<span style="color:#888">Extension is inactive</span>`);
        $summary.text("Disabled — not injecting prompts.");
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
        alert("Import failed. Invalid JSON.");
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

            const fullPrompt = `${kSystemPrompt}\n\n${BuildStateInjection()}`;
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

    LoadState();

    $("#ib_enabled").prop("checked", gEnabled);
    $("#ib_theme").val(gTheme);
    $("#ib_hide_raw").prop("checked", gHideRaw);
    $("#ib_show_thoughts").prop("checked", gShowThoughts);
    $("#ib_show_nsfw").prop("checked", gShowNsfw);

    UpdateStatusDisplay();
    UpdateLastUpdateDisplay();

    $("#ib_enabled").on("change", function () {
        gEnabled = $(this).is(":checked");
        localStorage.setItem(kEnabledKey, String(gEnabled));
        UpdateStatusDisplay();
        InjectPrompt();
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
        if (confirm("Reset Infoboard state for this chat?")) {
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
