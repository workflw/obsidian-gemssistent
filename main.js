var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GeminiPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  apiKey: "",
  model: "gemini-2.0-flash",
  maxTokens: 8192,
  temperature: 0.7,
  systemPrompt: "Du bist ein hilfreicher Assistent, der mir beim Arbeiten mit meinen Notizen in Obsidian hilft. Antworte pr\xE4zise und strukturiert.",
  includeVaultContext: true,
  maxContextNotes: 3,
  authMethod: "cli",
  cliPath: "",
  cliEmail: "",
  oauthClientId: "",
  oauthClientSecret: "",
  oauthAccessToken: "",
  oauthRefreshToken: "",
  oauthTokenExpiry: 0,
  oauthEmail: ""
};
var GeminiSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Gemini Assistant \u2013 Einstellungen" });
    containerEl.createEl("h3", { text: "\ud83d\udd10 Authentifizierung" });
    new import_obsidian.Setting(containerEl).setName("Auth-Methode").setDesc("Empfohlen: Gemini CLI (nutzt deinen bereits eingeloggten Google-Account)").addDropdown((drop) => drop.addOption("cli", "\ud83d\udfe2 Gemini CLI (empfohlen)").addOption("apikey", "\ud83d\udd11 API Key (Google AI Studio)").setValue(this.plugin.settings.authMethod || "cli").onChange(async (value) => {
      this.plugin.settings.authMethod = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.authMethod === "cli") {
      const cliStatusEl = containerEl.createDiv("gemini-cli-status");
      cliStatusEl.style.padding = "12px";
      cliStatusEl.style.marginBottom = "12px";
      cliStatusEl.style.border = "1px solid var(--background-modifier-border)";
      cliStatusEl.style.borderRadius = "6px";
      cliStatusEl.createEl("div", { text: "Status wird gepr\xfcft...", cls: "gemini-cli-status-text" });
      this.plugin.authManager.detectCli().then((result) => {
        cliStatusEl.empty();
        if (result.installed && result.loggedIn) {
          const okHeader = cliStatusEl.createEl("div");
          okHeader.style.fontWeight = "bold";
          okHeader.style.color = "var(--text-success, #4caf50)";
          okHeader.setText("\u2705 Gemini CLI bereit");
          cliStatusEl.createEl("div", { text: "Pfad: " + result.path });
          cliStatusEl.createEl("div", { text: "Account: " + result.email });
          cliStatusEl.createEl("div", { text: "Auth: OAuth (\xfcber CLI verwaltet)" });
        } else if (result.installed && !result.loggedIn) {
          const warnHeader = cliStatusEl.createEl("div");
          warnHeader.style.fontWeight = "bold";
          warnHeader.style.color = "var(--text-warning, #ff9800)";
          warnHeader.setText("\u26a0\ufe0f Gemini CLI installiert, aber nicht eingeloggt");
          cliStatusEl.createEl("div", { text: "F\xfchre im Terminal aus: gemini" });
          cliStatusEl.createEl("div", { text: "(\xf6ffnet interaktiven Login-Flow)" });
        } else {
          const errHeader = cliStatusEl.createEl("div");
          errHeader.style.fontWeight = "bold";
          errHeader.style.color = "var(--text-error, #f44336)";
          errHeader.setText("\u274c Gemini CLI nicht gefunden");
          cliStatusEl.createEl("div", { text: "Installation: npm install -g @google/gemini-cli" });
        }
      });
      new import_obsidian.Setting(containerEl).setName("Status pr\xfcfen").setDesc("CLI-Installation und Login-Status erneut pr\xfcfen").addButton((btn) => btn.setButtonText("\ud83d\udd04 Aktualisieren").onClick(() => this.display()));
    } else if (this.plugin.settings.authMethod === "oauth") {
      const warnEl = containerEl.createDiv();
      warnEl.style.padding = "12px";
      warnEl.style.marginBottom = "12px";
      warnEl.style.border = "1px solid var(--text-warning, #ff9800)";
      warnEl.style.borderRadius = "6px";
      warnEl.innerHTML = "<strong>\u26a0\ufe0f OAuth wird von der Gemini AI Studio API nicht unterst\xfctzt.</strong><br>Der Scope <code>generative-language</code> existiert nicht. Bitte nutze stattdessen <strong>Gemini CLI</strong> (empfohlen) oder <strong>API Key</strong>.";
    }
    const isOAuth = this.plugin.settings.authMethod === "oauth";
    const isApiKey = this.plugin.settings.authMethod === "apikey";
    containerEl.createEl("hr");
    if (isApiKey) {
      new import_obsidian.Setting(containerEl).setName("Google AI Studio API Key").setDesc(
        "Hol dir einen kostenlosen API-Key auf aistudio.google.com"
      ).addText(
        (text) => text.setPlaceholder("AIza...").setValue(this.plugin.settings.apiKey).onChange(async (value) => {
          this.plugin.settings.apiKey = value.trim();
          await this.plugin.saveSettings();
        })
      );
    }
    new import_obsidian.Setting(containerEl).setName("Gemini Modell").setDesc("Welches Gemini-Modell soll verwendet werden?").addDropdown(
      (drop) => drop.addOption("gemini-2.0-flash", "Gemini 2.0 Flash (schnell, empfohlen)").addOption("gemini-2.0-flash-thinking-exp", "Gemini 2.0 Flash Thinking").addOption("gemini-1.5-pro", "Gemini 1.5 Pro (leistungsstark)").addOption("gemini-1.5-flash", "Gemini 1.5 Flash").setValue(this.plugin.settings.model).onChange(async (value) => {
        this.plugin.settings.model = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Temperatur").setDesc("Kreativit\xE4t der Antworten (0 = pr\xE4zise, 1 = kreativ)").addSlider(
      (slider) => slider.setLimits(0, 1, 0.1).setValue(this.plugin.settings.temperature).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.temperature = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "Kontext & Vault" });
    new import_obsidian.Setting(containerEl).setName("Vault-Kontext einbeziehen").setDesc(
      "Aktuell ge\xF6ffnete Notiz automatisch als Kontext an Gemini schicken"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeVaultContext).onChange(async (value) => {
        this.plugin.settings.includeVaultContext = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "System Prompt" });
    new import_obsidian.Setting(containerEl).setName("System Prompt").setDesc("Grundlegende Anweisung an Gemini (Persona, Stil, Sprache)").addTextArea((text) => {
      text.setPlaceholder("Du bist ein hilfreicher Assistent...").setValue(this.plugin.settings.systemPrompt).onChange(async (value) => {
        this.plugin.settings.systemPrompt = value;
        await this.plugin.saveSettings();
      });
      text.inputEl.rows = 4;
      text.inputEl.style.width = "100%";
    });
  }
};

// node_modules/@google/generative-ai/dist/index.mjs
var SchemaType;
(function(SchemaType2) {
  SchemaType2["STRING"] = "string";
  SchemaType2["NUMBER"] = "number";
  SchemaType2["INTEGER"] = "integer";
  SchemaType2["BOOLEAN"] = "boolean";
  SchemaType2["ARRAY"] = "array";
  SchemaType2["OBJECT"] = "object";
})(SchemaType || (SchemaType = {}));
var ExecutableCodeLanguage;
(function(ExecutableCodeLanguage2) {
  ExecutableCodeLanguage2["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
  ExecutableCodeLanguage2["PYTHON"] = "python";
})(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
var Outcome;
(function(Outcome2) {
  Outcome2["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
  Outcome2["OUTCOME_OK"] = "outcome_ok";
  Outcome2["OUTCOME_FAILED"] = "outcome_failed";
  Outcome2["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
})(Outcome || (Outcome = {}));
var POSSIBLE_ROLES = ["user", "model", "function", "system"];
var HarmCategory;
(function(HarmCategory2) {
  HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
  HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
  HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
  HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
  HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
})(HarmCategory || (HarmCategory = {}));
var HarmBlockThreshold;
(function(HarmBlockThreshold2) {
  HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
  HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
  HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
var HarmProbability;
(function(HarmProbability2) {
  HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
  HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
  HarmProbability2["LOW"] = "LOW";
  HarmProbability2["MEDIUM"] = "MEDIUM";
  HarmProbability2["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
var BlockReason;
(function(BlockReason2) {
  BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
  BlockReason2["SAFETY"] = "SAFETY";
  BlockReason2["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
var FinishReason;
(function(FinishReason2) {
  FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
  FinishReason2["STOP"] = "STOP";
  FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
  FinishReason2["SAFETY"] = "SAFETY";
  FinishReason2["RECITATION"] = "RECITATION";
  FinishReason2["LANGUAGE"] = "LANGUAGE";
  FinishReason2["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
var TaskType;
(function(TaskType2) {
  TaskType2["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
  TaskType2["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
  TaskType2["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
  TaskType2["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
  TaskType2["CLASSIFICATION"] = "CLASSIFICATION";
  TaskType2["CLUSTERING"] = "CLUSTERING";
})(TaskType || (TaskType = {}));
var FunctionCallingMode;
(function(FunctionCallingMode2) {
  FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  FunctionCallingMode2["AUTO"] = "AUTO";
  FunctionCallingMode2["ANY"] = "ANY";
  FunctionCallingMode2["NONE"] = "NONE";
})(FunctionCallingMode || (FunctionCallingMode = {}));
var DynamicRetrievalMode;
(function(DynamicRetrievalMode2) {
  DynamicRetrievalMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  DynamicRetrievalMode2["MODE_DYNAMIC"] = "MODE_DYNAMIC";
})(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
var GoogleGenerativeAIError = class extends Error {
  constructor(message) {
    super(`[GoogleGenerativeAI Error]: ${message}`);
  }
};
var GoogleGenerativeAIResponseError = class extends GoogleGenerativeAIError {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
};
var GoogleGenerativeAIFetchError = class extends GoogleGenerativeAIError {
  constructor(message, status, statusText, errorDetails) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.errorDetails = errorDetails;
  }
};
var GoogleGenerativeAIRequestInputError = class extends GoogleGenerativeAIError {
};
var DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
var DEFAULT_API_VERSION = "v1beta";
var PACKAGE_VERSION = "0.21.0";
var PACKAGE_LOG_HEADER = "genai-js";
var Task;
(function(Task2) {
  Task2["GENERATE_CONTENT"] = "generateContent";
  Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
  Task2["COUNT_TOKENS"] = "countTokens";
  Task2["EMBED_CONTENT"] = "embedContent";
  Task2["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
})(Task || (Task = {}));
var RequestUrl = class {
  constructor(model, task, apiKey, stream, requestOptions) {
    this.model = model;
    this.task = task;
    this.apiKey = apiKey;
    this.stream = stream;
    this.requestOptions = requestOptions;
  }
  toString() {
    var _a, _b;
    const apiVersion = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.apiVersion) || DEFAULT_API_VERSION;
    const baseUrl = ((_b = this.requestOptions) === null || _b === void 0 ? void 0 : _b.baseUrl) || DEFAULT_BASE_URL;
    let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
    if (this.stream) {
      url += "?alt=sse";
    }
    return url;
  }
};
function getClientHeaders(requestOptions) {
  const clientHeaders = [];
  if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
    clientHeaders.push(requestOptions.apiClient);
  }
  clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
  return clientHeaders.join(" ");
}
async function getHeaders(url) {
  var _a;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
  headers.append("x-goog-api-key", url.apiKey);
  let customHeaders = (_a = url.requestOptions) === null || _a === void 0 ? void 0 : _a.customHeaders;
  if (customHeaders) {
    if (!(customHeaders instanceof Headers)) {
      try {
        customHeaders = new Headers(customHeaders);
      } catch (e) {
        throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
      }
    }
    for (const [headerName, headerValue] of customHeaders.entries()) {
      if (headerName === "x-goog-api-key") {
        throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
      } else if (headerName === "x-goog-api-client") {
        throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
      }
      headers.append(headerName, headerValue);
    }
  }
  return headers;
}
async function constructModelRequest(model, task, apiKey, stream, body, requestOptions) {
  const url = new RequestUrl(model, task, apiKey, stream, requestOptions);
  return {
    url: url.toString(),
    fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: await getHeaders(url), body })
  };
}
async function makeModelRequest(model, task, apiKey, stream, body, requestOptions = {}, fetchFn = fetch) {
  const { url, fetchOptions } = await constructModelRequest(model, task, apiKey, stream, body, requestOptions);
  return makeRequest(url, fetchOptions, fetchFn);
}
async function makeRequest(url, fetchOptions, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(url, fetchOptions);
  } catch (e) {
    handleResponseError(e, url);
  }
  if (!response.ok) {
    await handleResponseNotOk(response, url);
  }
  return response;
}
function handleResponseError(e, url) {
  let err = e;
  if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
    err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
    err.stack = e.stack;
  }
  throw err;
}
async function handleResponseNotOk(response, url) {
  let message = "";
  let errorDetails;
  try {
    const json = await response.json();
    message = json.error.message;
    if (json.error.details) {
      message += ` ${JSON.stringify(json.error.details)}`;
      errorDetails = json.error.details;
    }
  } catch (e) {
  }
  throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
}
function buildFetchOptions(requestOptions) {
  const fetchOptions = {};
  if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== void 0 || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
    const controller = new AbortController();
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
      setTimeout(() => controller.abort(), requestOptions.timeout);
    }
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
      requestOptions.signal.addEventListener("abort", () => {
        controller.abort();
      });
    }
    fetchOptions.signal = controller.signal;
  }
  return fetchOptions;
}
function addHelpers(response) {
  response.text = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getText(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return "";
  };
  response.functionCall = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      console.warn(`response.functionCall() is deprecated. Use response.functionCalls() instead.`);
      return getFunctionCalls(response)[0];
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  response.functionCalls = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
      }
      return getFunctionCalls(response);
    } else if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
    }
    return void 0;
  };
  return response;
}
function getText(response) {
  var _a, _b, _c, _d;
  const textStrings = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.text) {
        textStrings.push(part.text);
      }
      if (part.executableCode) {
        textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
      }
      if (part.codeExecutionResult) {
        textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
      }
    }
  }
  if (textStrings.length > 0) {
    return textStrings.join("");
  } else {
    return "";
  }
}
function getFunctionCalls(response) {
  var _a, _b, _c, _d;
  const functionCalls = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }
  }
  if (functionCalls.length > 0) {
    return functionCalls;
  } else {
    return void 0;
  }
}
var badFinishReasons = [
  FinishReason.RECITATION,
  FinishReason.SAFETY,
  FinishReason.LANGUAGE
];
function hadBadFinishReason(candidate) {
  return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
  var _a, _b, _c;
  let message = "";
  if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
    message += "Response was blocked";
    if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
      message += ` due to ${response.promptFeedback.blockReason}`;
    }
    if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
      message += `: ${response.promptFeedback.blockReasonMessage}`;
    }
  } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
    const firstCandidate = response.candidates[0];
    if (hadBadFinishReason(firstCandidate)) {
      message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
      if (firstCandidate.finishMessage) {
        message += `: ${firstCandidate.finishMessage}`;
      }
    }
  }
  return message;
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
var responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function processStream(response) {
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  const responseStream = getResponseStream(inputStream);
  const [stream1, stream2] = responseStream.tee();
  return {
    stream: generateResponseSequence(stream1),
    response: getResponsePromise(stream2)
  };
}
async function getResponsePromise(stream) {
  const allResponses = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return addHelpers(aggregateResponses(allResponses));
    }
    allResponses.push(value);
  }
}
function generateResponseSequence(stream) {
  return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
    const reader = stream.getReader();
    while (true) {
      const { value, done } = yield __await(reader.read());
      if (done) {
        break;
      }
      yield yield __await(addHelpers(value));
    }
  });
}
function getResponseStream(inputStream) {
  const reader = inputStream.getReader();
  const stream = new ReadableStream({
    start(controller) {
      let currentText = "";
      return pump();
      function pump() {
        return reader.read().then(({ value, done }) => {
          if (done) {
            if (currentText.trim()) {
              controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
              return;
            }
            controller.close();
            return;
          }
          currentText += value;
          let match = currentText.match(responseLineRE);
          let parsedResponse;
          while (match) {
            try {
              parsedResponse = JSON.parse(match[1]);
            } catch (e) {
              controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
              return;
            }
            controller.enqueue(parsedResponse);
            currentText = currentText.substring(match[0].length);
            match = currentText.match(responseLineRE);
          }
          return pump();
        });
      }
    }
  });
  return stream;
}
function aggregateResponses(responses) {
  const lastResponse = responses[responses.length - 1];
  const aggregatedResponse = {
    promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
  };
  for (const response of responses) {
    if (response.candidates) {
      for (const candidate of response.candidates) {
        const i = candidate.index;
        if (!aggregatedResponse.candidates) {
          aggregatedResponse.candidates = [];
        }
        if (!aggregatedResponse.candidates[i]) {
          aggregatedResponse.candidates[i] = {
            index: candidate.index
          };
        }
        aggregatedResponse.candidates[i].citationMetadata = candidate.citationMetadata;
        aggregatedResponse.candidates[i].groundingMetadata = candidate.groundingMetadata;
        aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
        aggregatedResponse.candidates[i].finishMessage = candidate.finishMessage;
        aggregatedResponse.candidates[i].safetyRatings = candidate.safetyRatings;
        if (candidate.content && candidate.content.parts) {
          if (!aggregatedResponse.candidates[i].content) {
            aggregatedResponse.candidates[i].content = {
              role: candidate.content.role || "user",
              parts: []
            };
          }
          const newPart = {};
          for (const part of candidate.content.parts) {
            if (part.text) {
              newPart.text = part.text;
            }
            if (part.functionCall) {
              newPart.functionCall = part.functionCall;
            }
            if (part.executableCode) {
              newPart.executableCode = part.executableCode;
            }
            if (part.codeExecutionResult) {
              newPart.codeExecutionResult = part.codeExecutionResult;
            }
            if (Object.keys(newPart).length === 0) {
              newPart.text = "";
            }
            aggregatedResponse.candidates[i].content.parts.push(newPart);
          }
        }
      }
    }
    if (response.usageMetadata) {
      aggregatedResponse.usageMetadata = response.usageMetadata;
    }
  }
  return aggregatedResponse;
}
async function generateContentStream(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.STREAM_GENERATE_CONTENT,
    apiKey,
    /* stream */
    true,
    JSON.stringify(params),
    requestOptions
  );
  return processStream(response);
}
async function generateContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(
    model,
    Task.GENERATE_CONTENT,
    apiKey,
    /* stream */
    false,
    JSON.stringify(params),
    requestOptions
  );
  const responseJson = await response.json();
  const enhancedResponse = addHelpers(responseJson);
  return {
    response: enhancedResponse
  };
}
function formatSystemInstruction(input) {
  if (input == null) {
    return void 0;
  } else if (typeof input === "string") {
    return { role: "system", parts: [{ text: input }] };
  } else if (input.text) {
    return { role: "system", parts: [input] };
  } else if (input.parts) {
    if (!input.role) {
      return { role: "system", parts: input.parts };
    } else {
      return input;
    }
  }
}
function formatNewContent(request) {
  let newParts = [];
  if (typeof request === "string") {
    newParts = [{ text: request }];
  } else {
    for (const partOrString of request) {
      if (typeof partOrString === "string") {
        newParts.push({ text: partOrString });
      } else {
        newParts.push(partOrString);
      }
    }
  }
  return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
function assignRoleToPartsAndValidateSendMessageRequest(parts) {
  const userContent = { role: "user", parts: [] };
  const functionContent = { role: "function", parts: [] };
  let hasUserContent = false;
  let hasFunctionContent = false;
  for (const part of parts) {
    if ("functionResponse" in part) {
      functionContent.parts.push(part);
      hasFunctionContent = true;
    } else {
      userContent.parts.push(part);
      hasUserContent = true;
    }
  }
  if (hasUserContent && hasFunctionContent) {
    throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  }
  if (!hasUserContent && !hasFunctionContent) {
    throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
  }
  if (hasUserContent) {
    return userContent;
  }
  return functionContent;
}
function formatCountTokensInput(params, modelParams) {
  var _a;
  let formattedGenerateContentRequest = {
    model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
    generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
    safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
    tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
    toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
    systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
    cachedContent: (_a = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a === void 0 ? void 0 : _a.name,
    contents: []
  };
  const containsGenerateContentRequest = params.generateContentRequest != null;
  if (params.contents) {
    if (containsGenerateContentRequest) {
      throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    }
    formattedGenerateContentRequest.contents = params.contents;
  } else if (containsGenerateContentRequest) {
    formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
  } else {
    const content = formatNewContent(params);
    formattedGenerateContentRequest.contents = [content];
  }
  return { generateContentRequest: formattedGenerateContentRequest };
}
function formatGenerateContentInput(params) {
  let formattedRequest;
  if (params.contents) {
    formattedRequest = params;
  } else {
    const content = formatNewContent(params);
    formattedRequest = { contents: [content] };
  }
  if (params.systemInstruction) {
    formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
  }
  return formattedRequest;
}
function formatEmbedContentInput(params) {
  if (typeof params === "string" || Array.isArray(params)) {
    const content = formatNewContent(params);
    return { content };
  }
  return params;
}
var VALID_PART_FIELDS = [
  "text",
  "inlineData",
  "functionCall",
  "functionResponse",
  "executableCode",
  "codeExecutionResult"
];
var VALID_PARTS_PER_ROLE = {
  user: ["text", "inlineData"],
  function: ["functionResponse"],
  model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
  // System instructions shouldn't be in history anyway.
  system: ["text"]
};
function validateChatHistory(history) {
  let prevContent = false;
  for (const currContent of history) {
    const { role, parts } = currContent;
    if (!prevContent && role !== "user") {
      throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
    }
    if (!POSSIBLE_ROLES.includes(role)) {
      throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
    }
    if (!Array.isArray(parts)) {
      throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
    }
    if (parts.length === 0) {
      throw new GoogleGenerativeAIError("Each Content should have at least one part");
    }
    const countFields = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0,
      fileData: 0,
      executableCode: 0,
      codeExecutionResult: 0
    };
    for (const part of parts) {
      for (const key of VALID_PART_FIELDS) {
        if (key in part) {
          countFields[key] += 1;
        }
      }
    }
    const validParts = VALID_PARTS_PER_ROLE[role];
    for (const key of VALID_PART_FIELDS) {
      if (!validParts.includes(key) && countFields[key] > 0) {
        throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
      }
    }
    prevContent = true;
  }
}
var SILENT_ERROR = "SILENT_ERROR";
var ChatSession = class {
  constructor(apiKey, model, params, _requestOptions = {}) {
    this.model = model;
    this.params = params;
    this._requestOptions = _requestOptions;
    this._history = [];
    this._sendPromise = Promise.resolve();
    this._apiKey = apiKey;
    if (params === null || params === void 0 ? void 0 : params.history) {
      validateChatHistory(params.history);
      this._history = params.history;
    }
  }
  /**
   * Gets the chat history so far. Blocked prompts are not added to history.
   * Blocked candidates are not added to history, nor are the prompts that
   * generated them.
   */
  async getHistory() {
    await this._sendPromise;
    return this._history;
  }
  /**
   * Sends a chat message and receives a non-streaming
   * {@link GenerateContentResult}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessage(request, requestOptions = {}) {
    var _a, _b, _c, _d, _e, _f;
    await this._sendPromise;
    const newContent = formatNewContent(request);
    const generateContentRequest = {
      safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
      generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
      tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
      toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
      systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
      cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
      contents: [...this._history, newContent]
    };
    const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    let finalResult;
    this._sendPromise = this._sendPromise.then(() => generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result) => {
      var _a2;
      if (result.response.candidates && result.response.candidates.length > 0) {
        this._history.push(newContent);
        const responseContent = Object.assign({
          parts: [],
          // Response seems to come back without a role set.
          role: "model"
        }, (_a2 = result.response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content);
        this._history.push(responseContent);
      } else {
        const blockErrorMessage = formatBlockErrorMessage(result.response);
        if (blockErrorMessage) {
          console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
        }
      }
      finalResult = result;
    });
    await this._sendPromise;
    return finalResult;
  }
  /**
   * Sends a chat message and receives the response as a
   * {@link GenerateContentStreamResult} containing an iterable stream
   * and a response promise.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessageStream(request, requestOptions = {}) {
    var _a, _b, _c, _d, _e, _f;
    await this._sendPromise;
    const newContent = formatNewContent(request);
    const generateContentRequest = {
      safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
      generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
      tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
      toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
      systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
      cachedContent: (_f = this.params) === null || _f === void 0 ? void 0 : _f.cachedContent,
      contents: [...this._history, newContent]
    };
    const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
    this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
      throw new Error(SILENT_ERROR);
    }).then((streamResult) => streamResult.response).then((response) => {
      if (response.candidates && response.candidates.length > 0) {
        this._history.push(newContent);
        const responseContent = Object.assign({}, response.candidates[0].content);
        if (!responseContent.role) {
          responseContent.role = "model";
        }
        this._history.push(responseContent);
      } else {
        const blockErrorMessage = formatBlockErrorMessage(response);
        if (blockErrorMessage) {
          console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
        }
      }
    }).catch((e) => {
      if (e.message !== SILENT_ERROR) {
        console.error(e);
      }
    });
    return streamPromise;
  }
};
async function countTokens(apiKey, model, params, singleRequestOptions) {
  const response = await makeModelRequest(model, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
  return response.json();
}
async function embedContent(apiKey, model, params, requestOptions) {
  const response = await makeModelRequest(model, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
  return response.json();
}
async function batchEmbedContents(apiKey, model, params, requestOptions) {
  const requestsWithModel = params.requests.map((request) => {
    return Object.assign(Object.assign({}, request), { model });
  });
  const response = await makeModelRequest(model, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({ requests: requestsWithModel }), requestOptions);
  return response.json();
}
var GenerativeModel = class {
  constructor(apiKey, modelParams, _requestOptions = {}) {
    this.apiKey = apiKey;
    this._requestOptions = _requestOptions;
    if (modelParams.model.includes("/")) {
      this.model = modelParams.model;
    } else {
      this.model = `models/${modelParams.model}`;
    }
    this.generationConfig = modelParams.generationConfig || {};
    this.safetySettings = modelParams.safetySettings || [];
    this.tools = modelParams.tools;
    this.toolConfig = modelParams.toolConfig;
    this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
    this.cachedContent = modelParams.cachedContent;
  }
  /**
   * Makes a single non-streaming call to the model
   * and returns an object containing a single {@link GenerateContentResponse}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContent(request, requestOptions = {}) {
    var _a;
    const formattedParams = formatGenerateContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
  }
  /**
   * Makes a single streaming call to the model and returns an object
   * containing an iterable stream that iterates over all chunks in the
   * streaming response as well as a promise that returns the final
   * aggregated response.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContentStream(request, requestOptions = {}) {
    var _a;
    const formattedParams = formatGenerateContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, formattedParams), generativeModelRequestOptions);
  }
  /**
   * Gets a new {@link ChatSession} instance which can be used for
   * multi-turn chats.
   */
  startChat(startChatParams) {
    var _a;
    return new ChatSession(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a = this.cachedContent) === null || _a === void 0 ? void 0 : _a.name }, startChatParams), this._requestOptions);
  }
  /**
   * Counts the tokens in the provided request.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async countTokens(request, requestOptions = {}) {
    const formattedParams = formatCountTokensInput(request, {
      model: this.model,
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
      tools: this.tools,
      toolConfig: this.toolConfig,
      systemInstruction: this.systemInstruction,
      cachedContent: this.cachedContent
    });
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
  }
  /**
   * Embeds the provided content.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async embedContent(request, requestOptions = {}) {
    const formattedParams = formatEmbedContentInput(request);
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
  }
  /**
   * Embeds an array of {@link EmbedContentRequest}s.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
    const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
    return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
  }
};
var GoogleGenerativeAI = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  /**
   * Gets a {@link GenerativeModel} instance for the provided model name.
   */
  getGenerativeModel(modelParams, requestOptions) {
    if (!modelParams.model) {
      throw new GoogleGenerativeAIError(`Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
    }
    return new GenerativeModel(this.apiKey, modelParams, requestOptions);
  }
  /**
   * Creates a {@link GenerativeModel} instance from provided content cache.
   */
  getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
    if (!cachedContent.name) {
      throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
    }
    if (!cachedContent.model) {
      throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
    }
    const disallowedDuplicates = ["model", "systemInstruction"];
    for (const key of disallowedDuplicates) {
      if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
        if (key === "model") {
          const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
          const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
          if (modelParamsComp === cachedContentComp) {
            continue;
          }
        }
        throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
      }
    }
    const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), { model: cachedContent.model, tools: cachedContent.tools, toolConfig: cachedContent.toolConfig, systemInstruction: cachedContent.systemInstruction, cachedContent });
    return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
  }
};

// src/gemini-cli-client.ts
var GeminiCliClient = class {
  constructor(settings) {
    this.settings = settings;
  }
  updateSettings(settings) {
    this.settings = settings;
  }
  getCliPath() {
    if (this.settings.cliPath) return this.settings.cliPath;
    const os = require("os");
    const path = require("path");
    const fs = require("fs");
    const candidates = [];
    if (os.platform() === "win32") {
      candidates.push("C:\\nvm4w\\nodejs\\gemini.cmd");
      candidates.push(path.join(os.homedir(), "AppData\\Roaming\\npm\\gemini.cmd"));
      candidates.push("gemini.cmd");
      candidates.push("gemini");
    } else {
      candidates.push("/usr/local/bin/gemini");
      candidates.push(path.join(os.homedir(), ".npm-global/bin/gemini"));
      candidates.push("gemini");
    }
    for (const c of candidates) {
      try {
        if (c.includes(path.sep) || c.includes("/")) {
          if (fs.existsSync(c)) return c;
        } else {
          return c;
        }
      } catch (e) {}
    }
    return "gemini";
  }
  async runPrompt(prompt, options = {}) {
    const { spawn } = require("child_process");
    const path = require("path");
    const fs = require("fs");
    const cliPath = this.getCliPath();
    const args = ["-p", prompt, "-o", "text", "--skip-trust", "--approval-mode", "auto_edit"];
    if (options.model) {
      args.push("-m", options.model);
    }
    let command = cliPath;
    let finalArgs = args;
    let useShell = false;
    if (process.platform === "win32" && /\.cmd$/i.test(cliPath)) {
      const cliDir = path.dirname(cliPath);
      const nodeExe = path.join(cliDir, "node.exe");
      const geminiJs = path.join(cliDir, "node_modules", "@google", "gemini-cli", "bundle", "gemini.js");
      if (fs.existsSync(geminiJs)) {
        command = fs.existsSync(nodeExe) ? nodeExe : "node";
        finalArgs = [geminiJs, ...args];
      } else {
        useShell = true;
      }
    }
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";
      const child = spawn(command, finalArgs, {
        shell: useShell,
        windowsHide: true,
        cwd: options.cwd || process.cwd(),
        env: Object.assign({}, process.env)
      });
      child.stdout.on("data", (data) => {
        stdout += data.toString();
        if (options.onChunk) options.onChunk(data.toString());
      });
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      child.on("error", (err) => {
        reject(new Error("Gemini CLI Fehler: " + err.message + ". Pfad: " + cliPath));
      });
      child.on("close", (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error("Gemini CLI Exit-Code " + code + ": " + stderr));
          return;
        }
        const cleaned = stdout.replace(/^Warning:.*$/gm, "").replace(/^Ripgrep.*$/gm, "").trim();
        resolve(cleaned);
      });
      if (options.timeout) {
        setTimeout(() => {
          child.kill();
          reject(new Error("Gemini CLI Timeout"));
        }, options.timeout);
      }
    });
  }
};

// src/gemini-api.ts
var GeminiAPI = class {
  constructor(settings, plugin = null) {
    this.settings = settings;
    this.plugin = plugin;
    this.cliClient = new GeminiCliClient(settings);
  }
  updateSettings(settings) {
    this.settings = settings;
    if (this.cliClient) this.cliClient.updateSettings(settings);
  }
  getClient() {
    if (this.settings.authMethod === "oauth") {
      if (!this.settings.oauthAccessToken) {
        throw new Error("Nicht mit Google eingeloggt. Bitte in den Einstellungen einloggen.");
      }
      return new GoogleGenerativeAI("_oauth_token_");
    }
    if (!this.settings.apiKey) {
      throw new Error("Kein API-Key konfiguriert. Bitte in den Einstellungen eintragen.");
    }
    return new GoogleGenerativeAI(this.settings.apiKey);
  }
  getModel() {
    const genAI = this.getClient();
    const requestOptions = {};
    if (this.settings.authMethod === "oauth" && this.settings.oauthAccessToken) {
      requestOptions.customHeaders = new Headers({
        "Authorization": "Bearer " + this.settings.oauthAccessToken
      });
    }
    return genAI.getGenerativeModel({
      model: this.settings.model,
      generationConfig: {
        maxOutputTokens: this.settings.maxTokens,
        temperature: this.settings.temperature
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
        }
      ]
    }, requestOptions);
  }
  /**
   * Einfache Chat-Anfrage mit optionalem Kontext
   */
  async chat(userMessage, history, noteContext) {
    if (this.settings.authMethod === "cli") {
      return await this.chatViaCli(userMessage, history, noteContext);
    }
    if (this.settings.authMethod === "oauth" && this.plugin) {
      const token = await this.plugin.authManager.getValidAccessToken();
      if (!token) throw new Error("Nicht eingeloggt. Bitte mit Google einloggen.");
      this.settings.oauthAccessToken = token;
    }
    const model = this.getModel();
    let systemContent = this.settings.systemPrompt;
    if (noteContext && this.settings.includeVaultContext) {
      systemContent += `

--- AKTUELLE NOTIZ (Kontext) ---
${noteContext}
--- ENDE NOTIZ ---`;
    }
    const geminiHistory = history.filter((_, i) => i < history.length - 1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemContent }] },
        { role: "model", parts: [{ text: "Verstanden. Ich bin bereit zu helfen." }] },
        ...geminiHistory
      ]
    });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }
  /**
   * Chat \xfcber Gemini CLI
   */
  async chatViaCli(userMessage, history, noteContext) {
    let fullPrompt = this.settings.systemPrompt + "\n\n";
    fullPrompt += "Du arbeitest im Obsidian-Vault des Nutzers. Wenn der Nutzer dich bittet, Dateien zu erstellen oder zu ändern, arbeite mit relativen Vault-Pfaden, ändere gezielt und fasse geänderte Dateien am Ende kurz zusammen. Frage bei potenziell destruktiven Aktionen vorher nach.\n\n";
    if (noteContext && this.settings.includeVaultContext) {
      fullPrompt += "--- OBSIDIAN-KONTEXT / ANGEHÄNGTE DATEIEN ---\n" + noteContext + "\n--- ENDE KONTEXT ---\n\n";
    }
    const prevHistory = history.filter((_, i) => i < history.length - 1);
    if (prevHistory.length > 0) {
      fullPrompt += "--- BISHERIGE UNTERHALTUNG ---\n";
      for (const msg of prevHistory) {
        const role = msg.role === "assistant" ? "Assistent" : "Nutzer";
        fullPrompt += role + ": " + msg.content + "\n";
      }
      fullPrompt += "--- ENDE UNTERHALTUNG ---\n\n";
    }
    fullPrompt += "Nutzer: " + userMessage + "\n\nAssistent:";
    const vaultPath = this.plugin && this.plugin.app && this.plugin.app.vault && this.plugin.app.vault.adapter ? this.plugin.app.vault.adapter.basePath : void 0;
    return await this.cliClient.runPrompt(fullPrompt, { timeout: 120000, cwd: vaultPath });
  }
  /**
   * Notiz zusammenfassen
   */
  async summarizeNote(noteContent, noteTitle) {
    const prompt = `Fasse die folgende Obsidian-Notiz "${noteTitle}" pr\xE4gnant zusammen.
Strukturiere die Zusammenfassung mit:
1. **Kernaussage** (1-2 S\xE4tze)
2. **Wichtigste Punkte** (Aufz\xE4hlung)
3. **Offene Fragen / N\xE4chste Schritte** (falls vorhanden)

Notiz-Inhalt:
${noteContent}`;
    if (this.settings.authMethod === "cli") {
      return await this.cliClient.runPrompt(prompt, { timeout: 120000 });
    }
    if (this.settings.authMethod === "oauth" && this.plugin) {
      const token = await this.plugin.authManager.getValidAccessToken();
      if (!token) throw new Error("Nicht eingeloggt. Bitte mit Google einloggen.");
      this.settings.oauthAccessToken = token;
    }
    const model = this.getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
  /**
   * Text generieren aus Selektion oder Prompt
   */
  async generateText(instruction, selectedText, noteContext) {
    let prompt = this.settings.systemPrompt + "\n\n";
    if (noteContext) {
      prompt += `Kontext (aktuelle Notiz):
${noteContext}

`;
    }
    if (selectedText) {
      prompt += `Ausgew\xE4hlter Text:
${selectedText}

`;
    }
    prompt += `Aufgabe: ${instruction}`;
    if (this.settings.authMethod === "cli") {
      return await this.cliClient.runPrompt(prompt, { timeout: 120000 });
    }
    if (this.settings.authMethod === "oauth" && this.plugin) {
      const token = await this.plugin.authManager.getValidAccessToken();
      if (!token) throw new Error("Nicht eingeloggt. Bitte mit Google einloggen.");
      this.settings.oauthAccessToken = token;
    }
    const model = this.getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
  /**
   * Verbindungstest
   */
  async testConnection() {
    try {
      if (this.settings.authMethod === "cli") {
        const result = await this.cliClient.runPrompt("Antworte nur mit: OK", { timeout: 30000 });
        return result.includes("OK");
      }
      const model = this.getModel();
      const result = await model.generateContent("Antworte nur mit: OK");
      return result.response.text().includes("OK");
    } catch (e) {
      return false;
    }
  }
};

// src/chat-view.ts
var import_obsidian2 = require("obsidian");
var GEMINI_CHAT_VIEW_TYPE = "gemini-chat-view";
var AttachedFileSuggestModal = class extends import_obsidian2.FuzzySuggestModal {
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.setPlaceholder("Markdown-Datei zum Anhängen wählen...");
  }
  getItems() {
    return this.app.vault.getMarkdownFiles();
  }
  getItemText(file) {
    return file.path;
  }
  onChooseItem(file) {
    this.onChoose(file);
  }
};
var GeminiChatView = class extends import_obsidian2.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.chatSessions = [{ title: "1", history: [] }];
    this.activeChatIndex = 0;
    this.chatHistory = this.chatSessions[0].history;
    this.attachedFiles = [];
    this.isLoading = false;
    this.plugin = plugin;
  }
  getViewType() {
    return GEMINI_CHAT_VIEW_TYPE;
  }
  getDisplayText() {
    return "Gemini Assistant";
  }
  getIcon() {
    return "bot";
  }
  async onOpen() {
    this.buildUI();
  }
  buildUI() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("gemini-chat-container");
    const header = container.createDiv("gemini-header");
    header.createEl("span", { text: "\u2728 Gemini Assistant", cls: "gemini-header-title" });
    const headerActions = header.createDiv("gemini-header-actions");
    const newBtn = headerActions.createEl("button", { text: "+ Chat", cls: "gemini-clear-btn" });
    newBtn.onclick = () => this.newChat();
    const clearBtn = headerActions.createEl("button", { text: "Leeren", cls: "gemini-clear-btn" });
    clearBtn.onclick = () => this.clearChat();
    const modelInfo = container.createDiv("gemini-model-info");
    modelInfo.setText(`Modell: CLI Default \u2022 Arbeitsmodus: Vault auto_edit`);
    this.sessionTabsEl = container.createDiv("gemini-session-tabs");
    this.renderSessionTabs();
    this.messagesContainer = container.createDiv("gemini-messages");
    this.addWelcomeMessage();
    const inputContainer = container.createDiv("gemini-input-container");
    const contextRow = inputContainer.createDiv("gemini-context-row");
    const contextLabel = contextRow.createEl("label", { cls: "gemini-context-label" });
    const contextCheckbox = contextLabel.createEl("input", { type: "checkbox" });
    contextCheckbox.checked = this.plugin.settings.includeVaultContext;
    contextCheckbox.onchange = () => {
      this.plugin.settings.includeVaultContext = contextCheckbox.checked;
      this.plugin.saveSettings();
    };
    contextLabel.appendText(" Notiz als Kontext");
    const attachRow = inputContainer.createDiv("gemini-attach-row");
    const attachCurrentBtn = attachRow.createEl("button", { text: "+ aktuelle Notiz", cls: "gemini-attach-btn" });
    attachCurrentBtn.onclick = () => this.attachActiveFile();
    const attachPickBtn = attachRow.createEl("button", { text: "+ Datei", cls: "gemini-attach-btn" });
    attachPickBtn.onclick = () => this.openAttachFileModal();
    this.attachmentsEl = inputContainer.createDiv("gemini-attachments");
    this.renderAttachments();
    this.inputEl = inputContainer.createEl("textarea", {
      cls: "gemini-input",
      placeholder: "Frage Gemini etwas... (Shift+Enter f\xFCr neue Zeile)"
    });
    this.inputEl.rows = 3;
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.sendButton = inputContainer.createEl("button", {
      text: "Senden",
      cls: "gemini-send-btn"
    });
    this.sendButton.onclick = () => this.sendMessage();
  }
  addWelcomeMessage() {
    const welcome = this.messagesContainer.createDiv("gemini-message gemini-message-assistant");
    welcome.createEl("div", {
      text: "\u{1F44B} Hallo! Ich bin dein Gemini-Assistent. Ich kann dir beim Zusammenfassen von Notizen, Generieren von Texten und Beantworten von Fragen helfen.",
      cls: "gemini-message-content"
    });
  }
  renderSessionTabs() {
    if (!this.sessionTabsEl) return;
    this.sessionTabsEl.empty();
    this.chatSessions.forEach((session, index) => {
      const btn = this.sessionTabsEl.createEl("button", {
        text: session.title,
        cls: index === this.activeChatIndex ? "gemini-session-tab is-active" : "gemini-session-tab"
      });
      btn.onclick = () => this.switchChat(index);
    });
  }
  renderCurrentChat() {
    this.messagesContainer.empty();
    this.addWelcomeMessage();
    for (const msg of this.chatHistory) {
      this.addMessageToUI(msg.role, msg.content);
    }
  }
  newChat() {
    const nextTitle = String(this.chatSessions.length + 1);
    this.chatSessions.push({ title: nextTitle, history: [] });
    this.activeChatIndex = this.chatSessions.length - 1;
    this.chatHistory = this.chatSessions[this.activeChatIndex].history;
    this.attachedFiles = [];
    this.renderSessionTabs();
    this.renderCurrentChat();
    this.renderAttachments();
  }
  switchChat(index) {
    if (index < 0 || index >= this.chatSessions.length) return;
    this.activeChatIndex = index;
    this.chatHistory = this.chatSessions[index].history;
    this.renderSessionTabs();
    this.renderCurrentChat();
  }
  attachActiveFile() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new import_obsidian2.Notice("Keine aktive Notiz gefunden.");
      return;
    }
    this.addAttachment(activeFile);
  }
  openAttachFileModal() {
    new AttachedFileSuggestModal(this.app, (file) => this.addAttachment(file)).open();
  }
  addAttachment(file) {
    if (!this.attachedFiles.includes(file.path)) {
      this.attachedFiles.push(file.path);
      this.renderAttachments();
      new import_obsidian2.Notice(`Datei angehängt: ${file.path}`);
    }
  }
  removeAttachment(path) {
    this.attachedFiles = this.attachedFiles.filter((p) => p !== path);
    this.renderAttachments();
  }
  renderAttachments() {
    if (!this.attachmentsEl) return;
    this.attachmentsEl.empty();
    for (const path of this.attachedFiles) {
      const chip = this.attachmentsEl.createEl("button", { text: `× ${path}`, cls: "gemini-attachment-chip" });
      chip.onclick = () => this.removeAttachment(path);
    }
  }
  async sendMessage() {
    const userInput = this.inputEl.value.trim();
    if (!userInput || this.isLoading)
      return;
    if (this.plugin.settings.authMethod === "cli") {
      // CLI mode: auth handled by CLI itself - no check needed here
    } else if (this.plugin.settings.authMethod === "oauth") {
      if (!this.plugin.settings.oauthAccessToken) {
        new import_obsidian2.Notice("\u26A0\uFE0F Nicht eingeloggt! Bitte mit Google einloggen (Einstellungen).");
        return;
      }
    } else if (!this.plugin.settings.apiKey) {
      new import_obsidian2.Notice("\u26A0\uFE0F Kein API-Key! Bitte in den Einstellungen eintragen.");
      return;
    }
    this.inputEl.value = "";
    this.isLoading = true;
    this.sendButton.disabled = true;
    this.sendButton.setText("...");
    this.addMessageToUI("user", userInput);
    let noteContext;
    noteContext = await this.getContextContent();
    this.chatHistory.push({
      role: "user",
      content: userInput,
      timestamp: /* @__PURE__ */ new Date()
    });
    const loadingEl = this.addLoadingMessage();
    try {
      const response = await this.plugin.geminiAPI.chat(
        userInput,
        this.chatHistory,
        noteContext
      );
      loadingEl.remove();
      this.addMessageToUI("assistant", response);
      this.chatHistory.push({
        role: "assistant",
        content: response,
        timestamp: /* @__PURE__ */ new Date()
      });
    } catch (error) {
      loadingEl.remove();
      const errMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
      this.addMessageToUI("assistant", `\u274C Fehler: ${errMsg}`);
      new import_obsidian2.Notice(`Gemini Fehler: ${errMsg}`);
    } finally {
      this.isLoading = false;
      this.sendButton.disabled = false;
      this.sendButton.setText("Senden");
    }
  }
  addMessageToUI(role, content) {
    const msgEl = this.messagesContainer.createDiv(
      `gemini-message gemini-message-${role}`
    );
    if (role === "assistant") {
      const contentEl = msgEl.createDiv("gemini-message-content");
      import_obsidian2.MarkdownRenderer.render(this.app, content, contentEl, "", this.plugin);
    } else {
      msgEl.createEl("div", { text: content, cls: "gemini-message-content" });
    }
    msgEl.createEl("div", {
      text: (/* @__PURE__ */ new Date()).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      cls: "gemini-message-time"
    });
    this.messagesContainer.scrollTo({ top: this.messagesContainer.scrollHeight, behavior: "smooth" });
    return msgEl;
  }
  addLoadingMessage() {
    const loadingEl = this.messagesContainer.createDiv(
      "gemini-message gemini-message-assistant gemini-loading"
    );
    loadingEl.createEl("div", { text: "\u23F3 Gemini denkt...", cls: "gemini-message-content" });
    this.messagesContainer.scrollTo({ top: this.messagesContainer.scrollHeight, behavior: "smooth" });
    return loadingEl;
  }
  async getCurrentNoteContent() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile)
      return void 0;
    try {
      const content = await this.app.vault.read(activeFile);
      return `Datei: ${activeFile.path}

${content.slice(0, 8e3)}`;
    } catch (e) {
      return void 0;
    }
  }
  async getContextContent() {
    const parts = [];
    if (this.plugin.settings.includeVaultContext) {
      const current = await this.getCurrentNoteContent();
      if (current) parts.push(current);
    }
    for (const path of this.attachedFiles) {
      const file = this.app.vault.getAbstractFileByPath(path);
      if (file && file instanceof import_obsidian2.TFile) {
        try {
          const content = await this.app.vault.read(file);
          parts.push(`Datei: ${file.path}\n\n${content.slice(0, 12000)}`);
        } catch (e) {
          parts.push(`Datei konnte nicht gelesen werden: ${path}`);
        }
      }
    }
    return parts.length > 0 ? parts.join("\n\n---\n\n") : void 0;
  }
  clearChat() {
    this.chatSessions[this.activeChatIndex].history = [];
    this.chatHistory = this.chatSessions[this.activeChatIndex].history;
    this.messagesContainer.empty();
    this.addWelcomeMessage();
  }
  async onClose() {
  }
};

// src/auth.ts
var GoogleAuthManager = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.SCOPES = "https://www.googleapis.com/auth/generative-language openid email";
    this.TOKEN_URL = "https://oauth2.googleapis.com/token";
    this.AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    this.USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
  }
  async findFreePort() {
    return new Promise((resolve, reject) => {
      const net = require("net");
      const server = net.createServer();
      server.on("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        server.close(() => resolve(port));
      });
    });
  }
  async login() {
    if (!this.plugin.settings.oauthClientId) {
      new import_obsidian3.Notice("⚠️ Bitte zuerst die OAuth Client ID in den Einstellungen eintragen.");
      return;
    }
    try {
      new import_obsidian3.Notice("🔐 Google-Login wird gestartet...");
      const port = await this.findFreePort();
      const redirectUri = "http://127.0.0.1:" + port;
      const state = Math.random().toString(36).substring(2, 15);
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      let rawStr = "";
      array.forEach((b) => rawStr += String.fromCharCode(b));
      const codeVerifier = btoa(rawStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const authUrl = new URL(this.AUTH_URL);
      authUrl.searchParams.set("client_id", this.plugin.settings.oauthClientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", this.SCOPES);
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("code_challenge", codeVerifier);
      authUrl.searchParams.set("code_challenge_method", "plain");
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      window.open(authUrl.toString());
      const code = await this.waitForCallback(port, state);
      await this.exchangeCode(code, codeVerifier, redirectUri);
      await this.fetchUserInfo();
      new import_obsidian3.Notice("✅ Eingeloggt als " + this.plugin.settings.oauthEmail);
      if (this.plugin.settingTab) this.plugin.settingTab.display();
    } catch (error) {
      new import_obsidian3.Notice("❌ Login fehlgeschlagen: " + error.message);
      console.error("Gemini OAuth Fehler:", error);
    }
  }
  waitForCallback(port, expectedState) {
    return new Promise((resolve, reject) => {
      const http = require("http");
      const server = http.createServer((req, res) => {
        try {
          const url = new URL(req.url, "http://127.0.0.1:" + port);
          const code = url.searchParams.get("code");
          const state = url.searchParams.get("state");
          const error = url.searchParams.get("error");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          if (error) {
            res.end("<html><body style='font-family:sans-serif;padding:40px;text-align:center'><h2>❌ Login abgebrochen</h2><p>Du kannst dieses Fenster schlie\xDFen und zu Obsidian zur\xFCckkehren.</p></body></html>");
            server.close();
            reject(new Error("Login abgebrochen: " + error));
          } else if (code && state === expectedState) {
            res.end("<html><body style='font-family:sans-serif;padding:40px;text-align:center'><h2>✅ Login erfolgreich!</h2><p>Kehre zu Obsidian zur\xFCck. Dieses Fenster kann geschlossen werden.</p></body></html>");
            server.close();
            resolve(code);
          } else {
            res.end("<html><body style='font-family:sans-serif;padding:40px;text-align:center'><h2>⚠️ Ung\xFCltige Antwort</h2></body></html>");
            server.close();
            reject(new Error("Ung\xFCltige OAuth-Antwort"));
          }
        } catch (e) {
          server.close();
          reject(e);
        }
      });
      server.listen(port, "127.0.0.1");
      server.on("error", reject);
      setTimeout(() => {
        server.close();
        reject(new Error("Login-Timeout nach 5 Minuten"));
      }, 5 * 60 * 1e3);
    });
  }
  async exchangeCode(code, codeVerifier, redirectUri) {
    const params = new URLSearchParams({
      code,
      client_id: this.plugin.settings.oauthClientId,
      client_secret: this.plugin.settings.oauthClientSecret || "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: codeVerifier
    });
    const response = await fetch(this.TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error("Token-Austausch fehlgeschlagen: " + err);
    }
    const tokens = await response.json();
    this.plugin.settings.oauthAccessToken = tokens.access_token;
    if (tokens.refresh_token) {
      this.plugin.settings.oauthRefreshToken = tokens.refresh_token;
    }
    this.plugin.settings.oauthTokenExpiry = Date.now() + tokens.expires_in * 1e3;
    this.plugin.settings.authMethod = "oauth";
    await this.plugin.saveSettings();
  }
  async fetchUserInfo() {
    const token = this.plugin.settings.oauthAccessToken;
    if (!token) return;
    try {
      const response = await fetch(this.USERINFO_URL, {
        headers: { "Authorization": "Bearer " + token }
      });
      if (response.ok) {
        const info = await response.json();
        this.plugin.settings.oauthEmail = info.email || info.name || "Google-Nutzer";
        await this.plugin.saveSettings();
      }
    } catch (e) {
      console.error("UserInfo fetch failed:", e);
    }
  }
  async getValidAccessToken() {
    const now = Date.now();
    const expiry = this.plugin.settings.oauthTokenExpiry || 0;
    if (this.plugin.settings.oauthAccessToken && now < expiry - 6e4) {
      return this.plugin.settings.oauthAccessToken;
    }
    if (this.plugin.settings.oauthRefreshToken) {
      return await this.refreshToken();
    }
    return null;
  }
  async refreshToken() {
    const params = new URLSearchParams({
      client_id: this.plugin.settings.oauthClientId,
      client_secret: this.plugin.settings.oauthClientSecret || "",
      refresh_token: this.plugin.settings.oauthRefreshToken,
      grant_type: "refresh_token"
    });
    const response = await fetch(this.TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    if (!response.ok) {
      this.plugin.settings.oauthAccessToken = "";
      this.plugin.settings.oauthRefreshToken = "";
      this.plugin.settings.oauthEmail = "";
      this.plugin.settings.authMethod = "apikey";
      await this.plugin.saveSettings();
      new import_obsidian3.Notice("⚠️ Google-Session abgelaufen. Bitte erneut einloggen.");
      if (this.plugin.settingTab) this.plugin.settingTab.display();
      return null;
    }
    const tokens = await response.json();
    this.plugin.settings.oauthAccessToken = tokens.access_token;
    this.plugin.settings.oauthTokenExpiry = Date.now() + tokens.expires_in * 1e3;
    await this.plugin.saveSettings();
    return tokens.access_token;
  }
  async logout() {
    this.plugin.settings.oauthAccessToken = "";
    this.plugin.settings.oauthRefreshToken = "";
    this.plugin.settings.oauthEmail = "";
    this.plugin.settings.oauthTokenExpiry = 0;
    this.plugin.settings.authMethod = "apikey";
    await this.plugin.saveSettings();
    new import_obsidian3.Notice("👋 Erfolgreich ausgeloggt.");
    if (this.plugin.settingTab) this.plugin.settingTab.display();
  }
  isLoggedIn() {
    return !!(this.plugin.settings.oauthEmail && this.plugin.settings.oauthAccessToken);
  }
  async detectCli() {
    const result = { installed: false, loggedIn: false, path: "", email: "" };
    try {
      const os = require("os");
      const path = require("path");
      const fs = require("fs");
      const { execSync } = require("child_process");
      const candidates = [];
      if (os.platform() === "win32") {
        candidates.push("C:\\nvm4w\\nodejs\\gemini.cmd");
        candidates.push(path.join(os.homedir(), "AppData\\Roaming\\npm\\gemini.cmd"));
      } else {
        candidates.push("/usr/local/bin/gemini");
        candidates.push(path.join(os.homedir(), ".npm-global/bin/gemini"));
      }
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          result.installed = true;
          result.path = c;
          break;
        }
      }
      if (!result.installed) {
        try {
          const out = execSync(os.platform() === "win32" ? "where gemini" : "which gemini", { encoding: "utf8" });
          const firstLine = out.split("\n")[0].trim();
          if (firstLine && fs.existsSync(firstLine)) {
            result.installed = true;
            result.path = firstLine;
          }
        } catch (e) {}
      }
      const credsPath = path.join(os.homedir(), ".gemini", "oauth_creds.json");
      const accountsPath = path.join(os.homedir(), ".gemini", "google_accounts.json");
      if (fs.existsSync(credsPath)) {
        try {
          const stat = fs.statSync(credsPath);
          if (stat.size > 100) {
            result.loggedIn = true;
            if (fs.existsSync(accountsPath)) {
              const accounts = JSON.parse(fs.readFileSync(accountsPath, "utf8"));
              if (accounts.active) result.email = accounts.active;
            }
            this.plugin.settings.cliEmail = result.email;
            this.plugin.settings.cliPath = result.path;
            await this.plugin.saveSettings();
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error("CLI detection failed:", e);
    }
    return result;
  }
};

// src/main.ts
var GeminiPlugin = class extends import_obsidian3.Plugin {
  async onload() {
    await this.loadSettings();
    this.authManager = new GoogleAuthManager(this);
    this.geminiAPI = new GeminiAPI(this.settings, this);
    this.registerView(
      GEMINI_CHAT_VIEW_TYPE,
      (leaf) => new GeminiChatView(leaf, this)
    );
    this.settingTab = new GeminiSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);
    this.addRibbonIcon("bot", "Gemini Assistant \xF6ffnen", () => {
      this.activateChatView();
    });
    this.addCommand({
      id: "open-gemini-chat",
      name: "Chat-Sidebar \xF6ffnen",
      callback: () => this.activateChatView()
    });
    this.addCommand({
      id: "summarize-current-note",
      name: "Aktuelle Notiz zusammenfassen",
      checkCallback: (checking) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
          if (!checking) {
            this.summarizeCurrentNote();
          }
          return true;
        }
        return false;
      }
    });
    this.addCommand({
      id: "generate-from-selection",
      name: "Text aus Selektion generieren",
      editorCallback: (editor, view) => {
        const selection = editor.getSelection();
        this.openGenerateModal(editor, selection);
      }
    });
    this.addCommand({
      id: "generate-at-cursor",
      name: "Text an Cursor-Position generieren",
      editorCallback: (editor, view) => {
        this.openGenerateModal(editor, "");
      }
    });
    this.addCommand({
      id: "test-connection",
      name: "API-Verbindung testen",
      callback: () => this.testConnection()
    });
    this.addCommand({
      id: "google-login",
      name: "Mit Google einloggen (OAuth)",
      callback: () => this.authManager.login()
    });
    this.addCommand({
      id: "google-logout",
      name: "Von Google ausloggen",
      callback: () => this.authManager.logout()
    });
    console.log("Gemini Assistant Plugin geladen \u2705");
  }
  onunload() {
    console.log("Gemini Assistant Plugin entladen");
  }
  // --- Chat-Sidebar ---
  async activateChatView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(GEMINI_CHAT_VIEW_TYPE)[0];
    if (!leaf) {
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({ type: GEMINI_CHAT_VIEW_TYPE, active: true });
        leaf = rightLeaf;
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
  // --- Notiz zusammenfassen ---
  async summarizeCurrentNote() {
    var _a, _b;
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new import_obsidian3.Notice("Keine aktive Notiz ge\xF6ffnet.");
      return;
    }
    if (this.settings.authMethod === "cli") {
      // CLI mode: auth handled by CLI itself
    } else if (this.settings.authMethod === "oauth") {
      if (!this.settings.oauthAccessToken) {
        new import_obsidian3.Notice("\u26A0\uFE0F Nicht eingeloggt! Bitte mit Google einloggen.");
        return;
      }
    } else if (!this.settings.apiKey) {
      new import_obsidian3.Notice("\u26A0\uFE0F Kein API-Key! Bitte in den Einstellungen eintragen.");
      return;
    }
    new import_obsidian3.Notice("\u23F3 Zusammenfassung wird erstellt...");
    try {
      const content = await this.app.vault.read(activeFile);
      const summary = await this.geminiAPI.summarizeNote(content, activeFile.basename);
      const summaryFileName = `${activeFile.basename} \u2013 Zusammenfassung.md`;
      const summaryPath = `${(_b = (_a = activeFile.parent) == null ? void 0 : _a.path) != null ? _b : ""}/${summaryFileName}`;
      const summaryContent = `# Zusammenfassung: ${activeFile.basename}

> Erstellt von Gemini Assistant am ${(/* @__PURE__ */ new Date()).toLocaleDateString("de-DE")}
> Quelle: [[${activeFile.basename}]]

${summary}
`;
      await this.app.vault.create(summaryPath, summaryContent);
      new import_obsidian3.Notice(`\u2705 Zusammenfassung gespeichert: ${summaryFileName}`);
      const newFile = this.app.vault.getAbstractFileByPath(summaryPath);
      if (newFile) {
        const leaf = this.app.workspace.getLeaf(true);
        await leaf.openFile(newFile);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
      new import_obsidian3.Notice(`\u274C Fehler: ${errMsg}`);
    }
  }
  // --- Text generieren Modal ---
  openGenerateModal(editor, selection) {
    new GenerateTextModal(this.app, this, editor, selection).open();
  }
  // --- Verbindungstest ---
  async testConnection() {
    if (this.settings.authMethod === "cli") {
      // CLI mode: skip key check
    } else if (this.settings.authMethod === "oauth") {
      if (!this.settings.oauthAccessToken) {
        new import_obsidian3.Notice("\u26A0\uFE0F Nicht eingeloggt. Bitte mit Google einloggen.");
        return;
      }
    } else if (!this.settings.apiKey) {
      new import_obsidian3.Notice("\u26A0\uFE0F Kein API-Key konfiguriert.");
      return;
    }
    new import_obsidian3.Notice("\u{1F504} Verbindung wird getestet...");
    const ok = await this.geminiAPI.testConnection();
    if (ok) {
      new import_obsidian3.Notice("\u2705 Verbindung erfolgreich! Gemini ist erreichbar.");
    } else {
      new import_obsidian3.Notice("\u274C Verbindung fehlgeschlagen. API-Key pr\xFCfen.");
    }
  }
  // --- Settings ---
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (this.settings.authMethod === "oauth") {
      this.settings.authMethod = "cli";
    }
    this.settings.oauthClientId = "";
    this.settings.oauthClientSecret = "";
    this.settings.oauthAccessToken = "";
    this.settings.oauthRefreshToken = "";
    this.settings.oauthTokenExpiry = 0;
    this.settings.oauthEmail = "";
  }
  async saveSettings() {
    var _a;
    await this.saveData(this.settings);
    (_a = this.geminiAPI) == null ? void 0 : _a.updateSettings(this.settings);
  }
};
var GenerateTextModal = class extends import_obsidian3.Modal {
  constructor(app, plugin, editor, selection) {
    super(app);
    this.plugin = plugin;
    this.editor = editor;
    this.selection = selection;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: "\u2728 Text generieren" });
    if (this.selection) {
      contentEl.createEl("p", {
        text: `Selektion: "${this.selection.slice(0, 80)}${this.selection.length > 80 ? "..." : ""}"`,
        cls: "gemini-modal-selection-preview"
      });
    }
    contentEl.createEl("label", { text: "Anweisung an Gemini:" });
    const instructionEl = contentEl.createEl("textarea", {
      placeholder: "z.B. 'Schreibe eine Einleitung f\xFCr diesen Text' oder 'Erstelle 5 Fragen zu diesem Thema'",
      cls: "gemini-modal-input"
    });
    instructionEl.rows = 3;
    instructionEl.style.width = "100%";
    const btnRow = contentEl.createDiv("gemini-modal-buttons");
    const generateBtn = btnRow.createEl("button", {
      text: "Generieren",
      cls: "mod-cta"
    });
    const cancelBtn = btnRow.createEl("button", { text: "Abbrechen" });
    cancelBtn.onclick = () => this.close();
    generateBtn.onclick = async () => {
      const instruction = instructionEl.value.trim();
      if (!instruction)
        return;
      generateBtn.disabled = true;
      generateBtn.setText("\u23F3 Generiert...");
      try {
        let noteContext;
        if (this.plugin.settings.includeVaultContext) {
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile) {
            const content = await this.app.vault.read(activeFile);
            noteContext = content.slice(0, 6e3);
          }
        }
        const result = await this.plugin.geminiAPI.generateText(
          instruction,
          this.selection || void 0,
          noteContext
        );
        if (this.selection) {
          this.editor.replaceSelection(`${this.selection}

${result}`);
        } else {
          const cursor = this.editor.getCursor();
          this.editor.replaceRange(`

${result}

`, cursor);
        }
        this.close();
        new import_obsidian3.Notice("\u2705 Text erfolgreich eingef\xFCgt!");
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Fehler";
        new import_obsidian3.Notice(`\u274C ${errMsg}`);
        generateBtn.disabled = false;
        generateBtn.setText("Generieren");
      }
    };
  }
  onClose() {
    this.contentEl.empty();
  }
};
/*! Bundled license information:

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
