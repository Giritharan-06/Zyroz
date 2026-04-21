const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src");

function walkSync(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let devPath = path.join(dir, file);
    if (fs.statSync(devPath).isDirectory()) {
      walkSync(devPath, callback);
    } else {
      callback(devPath);
    }
  });
}

const replacements = [
  // Text fading
  { regex: /\btext-white\/80\b/g, repl: "text-slate-800 dark:text-white/80" },
  { regex: /\btext-white\/60\b/g, repl: "text-slate-600 dark:text-white/60" },
  { regex: /\btext-white\/40\b/g, repl: "text-slate-400 dark:text-white/40" },
  { regex: /\btext-white\/20\b/g, repl: "text-slate-300 dark:text-white/20" },

  // Borders
  { regex: /\bborder-white\/20\b/g, repl: "border-gray-300 dark:border-white/20" },
  { regex: /\bborder-white\/10\b/g, repl: "border-gray-200 dark:border-white/10" },
  { regex: /\bborder-white\/5\b/g, repl: "border-gray-100 dark:border-white/5" },

  // Backgrounds
  { regex: /\bbg-white\/10\b/g, repl: "bg-brand/10 dark:bg-white/10" },
  { regex: /\bbg-white\/5\b/g, repl: "bg-brand/5 dark:bg-white/5" },
  
  // Base text/bg adjustments to avoid white-on-white text
  // We avoid replacing general text-white because it might be fine on buttons.
  // We'll target specific full blocks like `bg-black text-white`
  // Actually we shouldn't indiscriminately change `text-white` without knowing context.
];

walkSync(SRC_DIR, (filePath) => {
  if (!filePath.endsWith(".tsx")) return;

  let content = fs.readFileSync(filePath, "utf-8");
  let modified = content;

  replacements.forEach(({ regex, repl }) => {
    modified = modified.replace(regex, repl);
  });

  if (modified !== content) {
    fs.writeFileSync(filePath, modified, "utf-8");
    console.log("Updated", filePath);
  }
});
