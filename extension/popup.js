const SCRIPTS_KEY = "ait-scripts";
const CURRENT_SCRIPT_KEY = "ait-script-current";

async function get(key, def = null) {
  const obj = await browser.storage.local.get(key);
  return obj[key] ?? def;
}

async function set(key, value) {
  await browser.storage.local.set({ [key]: value });
}

function renderScripts(scripts) {
  const list = document.getElementById("script-list");
  const seen = new Set();

  for (const script of scripts) {
    seen.add(script.id);
    let li = list.querySelector(`[data-id="${script.id}"]`);
    if (!li) {
      li = document.createElement("li");
      li.dataset.id = script.id;

      const input = document.createElement("input");
      input.className = "script-name";
      input.placeholder = "script name";
      input.value = script.name ?? "";
      input.addEventListener("input", async (e) => {
        const current = await get(SCRIPTS_KEY, []);
        const idx = current.findIndex((x) => x.id === script.id);
        if (idx !== -1) {
          current[idx].name = e.target.value;
          await set(SCRIPTS_KEY, current);
        }
      });
      li.appendChild(input);

      const btnEdit = document.createElement("button");
      btnEdit.className = "edit-btn";
      btnEdit.innerHTML = "edit";
      btnEdit.addEventListener("click", async () => {
        await set(CURRENT_SCRIPT_KEY, script.id);
        await openEdit();
      });
      li.appendChild(btnEdit);

      const btnDelete = document.createElement("button");
      btnDelete.className = "remove-btn";
      btnDelete.innerHTML = "delete";
      btnDelete.addEventListener("click", async () => {
        const current = await get(SCRIPTS_KEY, []);
        await set(
          SCRIPTS_KEY,
          current.filter((x) => x.id !== script.id),
        );
      });
      li.appendChild(btnDelete);

      const inputEnable = document.createElement("input");
      inputEnable.type = "checkbox";
      inputEnable.className = "enable-input";
      inputEnable.checked = script.enabled;
      inputEnable.title = "enabled";
      inputEnable.addEventListener("input", async () => {
        const localScripts = await get(SCRIPTS_KEY, []);
        const scriptIndex = localScripts.findIndex((s) => s.id === id);
        if (scriptIndex === -1) return;
        localScripts[scriptIndex].enabled = inputEnable.checked;
        await set(SCRIPTS_KEY, localScripts);
      });
      li.appendChild(inputEnable);

      list.appendChild(li);
    } else {
      const input = li.querySelector(".script-name");
      if (input.value !== script.name) input.value = script.name;
    }
  }

  list.querySelectorAll("li").forEach((li) => {
    if (!seen.has(li.dataset.id)) li.remove();
  });
}

async function refreshScripts() {
  renderScripts(await get(SCRIPTS_KEY, []));
}

async function createScript(name) {
  const scripts = await get(SCRIPTS_KEY, []);
  scripts.push({ id: crypto.randomUUID(), name, content: "", enabled: true });
  await set(SCRIPTS_KEY, scripts);
}

document
  .getElementById("new-script-btn")
  .addEventListener("click", () => createScript(""));

async function openEdit() {
  const scriptId = await get(CURRENT_SCRIPT_KEY);
  if (!scriptId) return;
  const script = (await get(SCRIPTS_KEY, [])).find((s) => s.id === scriptId);
  if (!script) return;
  window.open(
    `editor.html#${scriptId}`,
    "script-editor",
    "width=900,height=700",
  );
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes[SCRIPTS_KEY]) refreshScripts();
  if (changes[CURRENT_SCRIPT_KEY]) openEdit();
});
refreshScripts();
