import { jwtDecode } from '../npm/jwt-decode/build/esm/index.js';
import { GHOSTERY_DOMAIN } from './urls.js';

const AUTH_URL = `https://consumerapi.${GHOSTERY_DOMAIN}/api/v2`;
const ACCOUNT_URL = `https://accountapi.${GHOSTERY_DOMAIN}/api/v2.1.0`;
const COOKIE_DOMAIN = `.${GHOSTERY_DOMAIN}`;
const COOKIE_URL = `https://${GHOSTERY_DOMAIN}`;
const COOKIE_DURATION = 60 * 60 * 24 * 90;
const COOKIE_SHORT_DURATION = 60 * 60;
let COOKIE_EXPIRATION_DATE_OFFSET = 0;
const HOME_PAGE_URL = `https://www.${GHOSTERY_DOMAIN}/`;
const SIGNON_PAGE_URL = `https://www.${GHOSTERY_DOMAIN}/signin`;
const CREATE_ACCOUNT_PAGE_URL = `https://www.${GHOSTERY_DOMAIN}/register`;
const ACCOUNT_PAGE_URL = `https://www.${GHOSTERY_DOMAIN}/account`;
const WTM_PAGE_URL = `https://www.${GHOSTERY_DOMAIN}/whotracksme/`;
async function isFirstPartyIsolation() {
  {
    if (isFirstPartyIsolation.value === void 0) {
      try {
        await chrome.cookies.getAll({ domain: "" });
        isFirstPartyIsolation.value = false;
      } catch (e) {
        isFirstPartyIsolation.value = e.message.indexOf("firstPartyDomain") > -1;
      }
    }
    return isFirstPartyIsolation.value;
  }
}
async function getCookie(name) {
  const cookie = await chrome.cookies.get({
    url: COOKIE_URL,
    name,
    ...await isFirstPartyIsolation() ? { firstPartyDomain: GHOSTERY_DOMAIN } : {}
  });
  if (cookie && (cookie.session || cookie.expirationDate * (1e3 ) > Date.now())) {
    return cookie;
  }
  return null;
}
async function setCookie(name, value, durationInSec = COOKIE_DURATION) {
  return chrome.cookies[value !== void 0 ? "set" : "remove"]({
    name,
    url: COOKIE_URL,
    ...value !== void 0 ? {
      path: "/",
      value,
      domain: COOKIE_DOMAIN,
      expirationDate: Date.now() / 1e3 + durationInSec + COOKIE_EXPIRATION_DATE_OFFSET
    } : {},
    ...await isFirstPartyIsolation() ? { firstPartyDomain: GHOSTERY_DOMAIN } : {}
  });
}
async function session() {
  const userId = await getCookie("user_id");
  if (!userId) return null;
  let accessToken = await getCookie("access_token");
  try {
    if (!accessToken) {
      const refreshToken = await getCookie("refresh_token");
      if (!refreshToken) return null;
      const res = await fetch(`${AUTH_URL}/refresh_token`, {
        method: "post",
        headers: {
          UserId: userId.value,
          RefreshToken: refreshToken.value
        },
        credentials: "omit"
      });
      if (res.ok) {
        const data = await res.json();
        accessToken = { value: data.access_token };
        await Promise.all([
          setCookie("user_id", data.user_id),
          setCookie("refresh_token", data.refresh_token),
          setCookie("access_token", data.access_token, COOKIE_SHORT_DURATION),
          setCookie("csrf_token", data.csrf_token, COOKIE_SHORT_DURATION)
        ]);
      } else if (res.status === 400) {
        await Promise.all([
          setCookie("user_id", void 0),
          setCookie("refresh_token", void 0),
          setCookie("access_token", void 0),
          setCookie("csrf_token", void 0)
        ]);
        throw new Error("Invalid refresh token");
      } else {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    }
  } catch (e) {
    console.error("[api] Failed to refresh access token:", e);
    accessToken = void 0;
  }
  return accessToken ? jwtDecode(accessToken.value) : null;
}
async function getUserOptions() {
  const userId = await getCookie("user_id");
  const accessToken = await getCookie("access_token");
  const csrfToken = await getCookie("csrf_token");
  const res = await fetch(`${ACCOUNT_URL}/options/${userId.value}`, {
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${accessToken.value}`,
      "X-CSRF-Token": csrfToken.value
    },
    credentials: "omit"
  });
  if (!res.ok) {
    throw Error(`Failed to get options: ${res.status} ${res.statusText}`);
  }
  return (await res.json()).data.attributes.options || {};
}
async function setUserOptions(options) {
  const userId = await getCookie("user_id");
  const accessToken = await getCookie("access_token");
  const csrfToken = await getCookie("csrf_token");
  const res = await fetch(`${ACCOUNT_URL}/options/${userId.value}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${accessToken.value}`,
      "X-CSRF-Token": csrfToken.value
    },
    credentials: "omit",
    body: JSON.stringify({
      data: {
        type: "options",
        id: userId.value,
        attributes: { options }
      }
    })
  });
  if (!res.ok) {
    throw Error(`Failed to save options: ${res.status} ${res.statusText}`);
  }
  return (await res.json()).data.attributes.options || {};
}

export { ACCOUNT_PAGE_URL, COOKIE_DOMAIN, CREATE_ACCOUNT_PAGE_URL, HOME_PAGE_URL, SIGNON_PAGE_URL, WTM_PAGE_URL, getUserOptions, session, setCookie, setUserOptions };
