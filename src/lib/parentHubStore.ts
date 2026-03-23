type ParentHubState = {
  favorites: string[];
  readArticles: string[];
  checklistDone: string[];
  lastVisited?: string;
  views: Record<string, number>;
};

const KEY = "mojput_parent_hub_state";

const defaultState: ParentHubState = {
  favorites: [],
  readArticles: [],
  checklistDone: [],
  lastVisited: undefined,
  views: {},
};

function getState(): ParentHubState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...(JSON.parse(raw) as ParentHubState) };
  } catch {
    return defaultState;
  }
}

function setState(next: ParentHubState) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function toggleFavorite(id: string) {
  const state = getState();
  const exists = state.favorites.includes(id);
  const favorites = exists ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
  setState({ ...state, favorites });
}

export function toggleReadArticle(slug: string) {
  const state = getState();
  const exists = state.readArticles.includes(slug);
  const readArticles = exists ? state.readArticles.filter((item) => item !== slug) : [...state.readArticles, slug];
  setState({ ...state, readArticles });
}

export function toggleChecklist(item: string) {
  const state = getState();
  const exists = state.checklistDone.includes(item);
  const checklistDone = exists ? state.checklistDone.filter((entry) => entry !== item) : [...state.checklistDone, item];
  setState({ ...state, checklistDone });
}

export function setLastVisited(path: string) {
  const state = getState();
  setState({ ...state, lastVisited: path });
}

export function incrementView(slug: string) {
  const state = getState();
  const views = { ...state.views, [slug]: (state.views[slug] || 0) + 1 };
  setState({ ...state, views });
}

export function readParentHubState() {
  return getState();
}
