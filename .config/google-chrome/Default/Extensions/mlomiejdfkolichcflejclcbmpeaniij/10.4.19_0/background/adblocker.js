import '../npm/@ghostery/adblocker-webextension/dist/esm/index.js';
import { parse } from '../npm/tldts-experimental/dist/es6/index.js';
import scriptlets from '../npm/@ghostery/scriptlets/index.js';
import Options, { isPaused, ENGINES } from '../store/options.js';
import { init, setEnv, get, FIXES_ENGINE, CUSTOM_ENGINE, replace, create, update, TRACKERDB_ENGINE, MAIN_ENGINE } from '../utils/engines.js';
import { setup as setup$1 } from '../utils/trackerdb.js';
import { addListener } from '../utils/options-observer.js';
import '../npm/@ghostery/adblocker/dist/esm/data-view.js';
import '../npm/@ghostery/adblocker/dist/esm/fetch.js';
import '../npm/@ghostery/adblocker/dist/esm/filters/cosmetic.js';
import '../npm/@ghostery/adblocker/dist/esm/lists.js';
import '../npm/@ghostery/adblocker/dist/esm/request.js';
import '../npm/@remusao/small/dist/esm/index.js';
import '../npm/@ghostery/adblocker/dist/esm/filters/network.js';
import '../npm/@ghostery/adblocker/dist/esm/preprocessor.js';
import asyncSetup from '../utils/setup.js';
import { tabStats } from './stats.js';
import './exceptions.js';
import store from '../npm/hybrids/src/store.js';

let options = Options;
function getEnabledEngines(config) {
  if (config.terms) {
    const list = ENGINES.filter(({ key }) => config[key]).map(
      ({ name }) => name
    );
    if (config.regionalFilters.enabled) {
      list.push(...config.regionalFilters.regions.map((id) => `lang-${id}`));
    }
    if (list.length) {
      list.push(FIXES_ENGINE);
    }
    if (config.customFilters.enabled) {
      list.push(CUSTOM_ENGINE);
    }
    return list;
  }
  return [];
}
async function reloadMainEngine() {
  const enabledEngines = getEnabledEngines(options);
  const resolvedEngines = (await Promise.all(
    enabledEngines.map(
      (id) => init(id).catch(() => {
        console.error(`[adblocker] failed to load engine: ${id}`);
        return null;
      })
    )
  )).filter((engine) => engine);
  if (resolvedEngines.length) {
    replace(MAIN_ENGINE, resolvedEngines);
    console.info(
      `[adblocker] Main engine reloaded with: ${enabledEngines.join(", ")}`
    );
  } else {
    await create(MAIN_ENGINE);
    console.info("[adblocker] Main engine reloaded with no filters");
  }
}
let updating = false;
async function updateEngines() {
  if (updating) return;
  try {
    updating = true;
    const enabledEngines = getEnabledEngines(options);
    if (enabledEngines.length) {
      let updated = false;
      await Promise.all(
        enabledEngines.filter((id) => id !== CUSTOM_ENGINE).map(async (id) => {
          await init(id);
          updated = await update(id) || updated;
        })
      );
      setup$1.pending && await setup$1.pending;
      await update(TRACKERDB_ENGINE);
      await store.set(Options, { filtersUpdatedAt: Date.now() });
      return updated;
    }
  } finally {
    updating = false;
  }
}
const HOUR_IN_MS = 60 * 60 * 1e3;
const setup = asyncSetup("adblocker", [
  addListener(
    async function adblockerEngines(value, lastValue) {
      options = value;
      const enabledEngines = getEnabledEngines(value);
      const prevEnabledEngines = lastValue && getEnabledEngines(lastValue);
      if (
        // Reload/mismatched main engine
        !await init(MAIN_ENGINE) || // Enabled engines changed
        prevEnabledEngines && (enabledEngines.length !== prevEnabledEngines.length || enabledEngines.some((id, i) => id !== prevEnabledEngines[i]))
      ) {
        await reloadMainEngine();
      }
      if (options.filtersUpdatedAt < Date.now() - HOUR_IN_MS) {
        if (await updateEngines()) await reloadMainEngine();
      }
    }
  ),
  addListener(
    "experimentalFilters",
    async (value, lastValue) => {
      setEnv("env_experimental", value);
      if (lastValue !== void 0 && value) {
        await updateEngines();
      }
    }
  )
]);
function injectScriptlets(filters, tabId, frameId) {
  for (const filter of filters) {
    const parsed = filter.parseScript();
    if (!parsed) {
      console.warn(
        "[adblocker] could not inject script filter:",
        filter.toString()
      );
      continue;
    }
    const scriptletName = `${parsed.name}${parsed.name.endsWith(".js") ? "" : ".js"}`;
    const scriptlet = scriptlets[scriptletName];
    if (!scriptlet) {
      console.warn("[adblocker] unknown scriptlet with name:", scriptletName);
      continue;
    }
    chrome.scripting.executeScript(
      {
        injectImmediately: true,
        world: chrome.scripting.ExecutionWorld?.MAIN ?? ("MAIN"),
        target: {
          tabId,
          frameIds: [frameId]
        },
        func: scriptlet.func,
        args: parsed.args.map((arg) => decodeURIComponent(arg))
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn(chrome.runtime.lastError);
        }
      }
    );
  }
}
function injectStyles(styles, tabId, frameId) {
  const target = { tabId };
  if (frameId !== void 0) {
    target.frameIds = [frameId];
  } else {
    target.allFrames = true;
  }
  chrome.scripting.insertCSS({
    css: styles,
    origin: "USER",
    target
  }).catch((e) => console.warn("[adblocker] failed to inject CSS", e));
}
async function injectCosmetics(details, config) {
  try {
    setup.pending && await setup.pending;
  } catch (e) {
    console.error("[adblocker] not ready for cosmetic injection", e);
    return;
  }
  const { frameId, url, tabId } = details;
  const parsed = parse(url);
  const domain = parsed.domain || "";
  const hostname = parsed.hostname || "";
  if (isPaused(options, hostname)) return;
  const tabHostname = tabStats.get(tabId)?.hostname;
  if (tabHostname && isPaused(options, tabHostname)) {
    return;
  }
  const engine = get(MAIN_ENGINE);
  const isBootstrap = config.bootstrap;
  {
    const { matches } = engine.matchCosmeticFilters({
      domain,
      hostname,
      url,
      classes: config.classes,
      hrefs: config.hrefs,
      ids: config.ids,
      getBaseRules: false,
      // This needs to be done only once per frame
      getInjectionRules: isBootstrap,
      getExtendedRules: isBootstrap,
      getRulesFromHostname: isBootstrap,
      getPureHasRules: true,
      // This will be done every time we get information about DOM mutation
      getRulesFromDOM: !isBootstrap
    });
    const styleFilters = [];
    const scriptFilters = [];
    for (const { filter, exception } of matches) {
      if (exception === void 0) {
        if (filter.isScriptInject()) {
          scriptFilters.push(filter);
        } else {
          styleFilters.push(filter);
        }
      }
    }
    if (isBootstrap && scriptFilters.length > 0) {
      injectScriptlets(scriptFilters, tabId, frameId);
    }
    const { styles } = engine.injectCosmeticFilters(styleFilters, {
      url,
      injectScriptlets: isBootstrap,
      injectExtended: isBootstrap,
      injectPureHasSafely: true,
      allowGenericHides: false,
      getBaseRules: false
    });
    if (styles) {
      injectStyles(styles, tabId, frameId);
    }
  }
  if (frameId === 0 && isBootstrap) {
    const { styles } = engine.getCosmeticsFilters({
      domain,
      hostname,
      url,
      // This needs to be done only once per tab
      getBaseRules: true,
      getInjectionRules: false,
      getExtendedRules: false,
      getRulesFromDOM: false,
      getRulesFromHostname: false
    });
    injectStyles(styles, tabId);
  }
}
chrome.webNavigation.onCommitted.addListener(
  (details) => {
    injectCosmetics(details, { bootstrap: true });
  },
  { url: [{ urlPrefix: "http://" }, { urlPrefix: "https://" }] }
);
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "injectCosmetics" && sender.tab) {
    const details = {
      url: sender.url,
      tabId: sender.tab.id,
      frameId: sender.frameId
    };
    injectCosmetics(details, msg);
  }
});

export { reloadMainEngine, setup };
