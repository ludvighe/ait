const SCRIPTS_KEY = "ait-scripts";
async function get(key, def = null) {
  const obj = await browser.storage.local.get(key);
  return obj[key] ?? def;
}
async function inject() {
  const scripts = await get(SCRIPTS_KEY, []);
  for (const script of scripts) {
    if (!script.enabled) continue;
    console.debug("[AIT]:", "executing script", script.name);
    const injectionScript = document.createElement("script");
    injectionScript.textContent = script.content;
    document.documentElement.appendChild(injectionScript);
    injectionScript.parentNode && injectionScript.remove();
  }
}

console.debug("[AIT]:", "loaded");
inject();
