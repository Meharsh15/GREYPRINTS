import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "index.html");
const outDir = resolve(root, "www");
await mkdir(outDir, { recursive: true });

let html = await readFile(source, "utf8");

// The Android build uses the exact same catalogue and pricing source as the live website.
// Only the generated copy receives native-app styling and navigation.
if (!html.includes('id="native-app-styles"')) {
  html = html.replace(
    "</head>",
    '  <link id="native-app-styles" rel="stylesheet" href="./native-app.css">\n</head>'
  );
}
if (!html.includes('native-app.bundle.js')) {
  html = html.replace(
    "</body>",
    '  <script type="module" src="./native-app.bundle.js"></script>\n</body>'
  );
}

// Keep WhatsApp quote generation identical; the native wrapper intercepts the action
// and opens the WhatsApp URL through Android's external-app handler.
await writeFile(resolve(outDir, "index.html"), html, "utf8");
await copyFile(resolve(root, "src/native-app.css"), resolve(outDir, "native-app.css"));
console.log("Prepared www/ from the existing GREYPRINTS catalogue.");
