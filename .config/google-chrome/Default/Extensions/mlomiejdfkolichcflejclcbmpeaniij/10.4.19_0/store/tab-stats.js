import { parse } from '../npm/tldts-experimental/dist/es6/index.js';
import AutoSyncingMap from '../utils/map.js';
import Tracker from './tracker.js';
import TrackerException from './tracker-exception.js';
import { getCurrentTab } from '../utils/tabs.js';
import store from '../npm/hybrids/src/store.js';

const StatsTracker = {
  ...Tracker,
  blocked: false,
  modified: false,
  requests: [{ url: "", blocked: false, modified: false }],
  requestsCount: 0,
  requestsBlocked: ({ requests }) => requests.filter((r) => r.blocked),
  requestsModified: ({ requests }) => requests.filter((r) => r.modified),
  requestsObserved: ({ requests }) => requests.filter((r) => !r.blocked && !r.modified)
};
let tab = void 0;
const Stats = {
  hostname: "",
  trackers: [StatsTracker],
  trackersBlocked: ({ trackers }) => trackers.reduce((acc, { blocked }) => acc + Number(blocked), 0),
  trackersModified: ({ trackers }) => trackers.reduce((acc, { modified }) => acc + Number(modified), 0),
  categories: ({ trackers }) => trackers.map((t) => t.category),
  topCategories: ({ categories }) => {
    const counts = Object.entries(
      categories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {})
    );
    if (counts.length < 6) return categories;
    return [
      ...counts.slice(0, 5).map(([category, count]) => Array(count).fill(category)).flat(),
      ...Array(counts.slice(5).reduce((acc, [, count]) => acc + count, 0)).fill(
        "other"
      )
    ];
  },
  [store.connect]: {
    async get() {
      tab ||= await getCurrentTab();
      if (!tab || !tab.url.startsWith("http")) return {};
      const tabStats = await AutoSyncingMap.get("tabStats:v1", tab.id);
      if (tabStats && tab.url.includes(tabStats.hostname)) {
        await store.resolve([TrackerException]);
        return tabStats;
      }
      const hostname = parse(tab.url).hostname?.replace(/^www\./, "");
      return { hostname };
    },
    observe: false
  }
};
{
  chrome.storage.onChanged.addListener((changes) => {
    if (changes["tabStats:v1"]) {
      store.clear(Stats, false);
    }
  });
}

export { Stats as default };
