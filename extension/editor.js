const SCRIPTS_KEY = "ait-scripts";

async function get(key, def = null) {
  const obj = await browser.storage.local.get(key);
  return obj[key] ?? def;
}

async function set(key, value) {
  await browser.storage.local.set({ [key]: value });
}

async function load() {
  const id = location.hash.slice(1);
  if (!id) return;

  const scripts = await get(SCRIPTS_KEY, []);
  const script = scripts.find((s) => s.id === id);

  const name = document.getElementById("name");
  name.value = script.name ?? "";
  name.addEventListener("input", async (e) => {
    const cur = await get(SCRIPTS_KEY, []);
    const i = cur.findIndex((s) => s.id === id);
    if (i === -1) return;
    cur[i].name = e.target.value;
    await set(SCRIPTS_KEY, cur);
  });

  const content = document.getElementById("content");
  content.value = script.content ?? "";
  content.addEventListener("input", async (e) => {
    const localScripts = await get(SCRIPTS_KEY, []);
    const scriptIndex = localScripts.findIndex((s) => s.id === id);
    if (scriptIndex === -1) return;
    localScripts[scriptIndex].content = e.target.value;
    await set(SCRIPTS_KEY, localScripts);
  });
}

load();
