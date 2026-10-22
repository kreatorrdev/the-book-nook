import { mkdirSync, writeFileSync } from "node:fs";
import { seedBooks } from "../src/lib/catalog";
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function wrap(text: string, max = 18) {
  const lines: string[] = []; let line = "";
  for (const word of text.split(" ")) { if ((line + " " + word).trim().length > max && line) { lines.push(line); line = word; } else line = (line + " " + word).trim(); }
  if (line) lines.push(line); return lines;
}
function ornament(motif: string) {
  const leaf = `<path d="M0 0Q-30-24-22-52Q5-43 0 0ZM0 0Q29-20 24-46Q-3-38 0 0Z" fill="currentColor" stroke="none"/>`;
  if (["garden", "botanical", "flowers"].includes(motif)) return `<g transform="translate(180 380)" fill="none" stroke="currentColor" stroke-width="2"><path d="M0 64V-108M0 10Q-62-35-87-110M0 28Q59-16 80-90M0-41Q-38-64-45-124M0-61Q35-82 44-134"/>${[-1, 1].map(sign => [0, 1, 2].map(i => `<g transform="translate(${sign * (25 + i * 20)} ${5 - i * 34}) rotate(${sign * (20 + i * 12)})">${leaf}</g>`).join("")).join("")}<circle cx="0" cy="-112" r="15"/><circle cx="-87" cy="-110" r="13"/><circle cx="80" cy="-90" r="13"/><path d="M-105 80Q0 60 105 80"/></g>`;
  if (motif === "deco") return `<g fill="none" stroke="currentColor" stroke-width="2">${[0, 1, 2, 3, 4].map(i => `<path d="M${40 + i * 20} 430V${295 + i * 12}L180 ${210 + i * 28}L${320 - i * 20} ${295 + i * 12}V430"/>`).join("")}<circle cx="180" cy="350" r="36"/><path d="M180 302V398M132 350H228"/></g>`;
  if (motif === "window") return `<g fill="none" stroke="currentColor" stroke-width="3"><path d="M86 429V304a94 94 0 0 1 188 0v125ZM180 212V429M86 327H274"/><path d="M67 446H293M110 430Q117 380 92 355M250 430Q244 375 266 351"/>${[0,1,2].map(i=>`<path d="M${112+i*5} ${410-i*14}q-35-35-43-9q18 20 43 9M${249-i*5} ${410-i*14}q35-35 43-9q-18 20-43 9"/>`).join("")}</g>`;
  if (motif === "moon") return `<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="180" cy="326" r="83"/><path d="M198 245a75 75 0 1 0 52 120a80 80 0 0 1-52-120Z" fill="currentColor" opacity=".7"/>${[[73,261],[280,241],[87,394],[271,418]].map(([x,y])=>`<path d="M${x-7} ${y}h14M${x} ${y-7}v14"/>`).join("")}<path d="M65 449Q180 406 295 449"/></g>`;
  return `<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="180" cy="294" r="42"/>${[0,1,2,3,4,5].map(i=>`<path d="M36 ${345+i*20}q36-28 72 0t72 0t72 0t72 0"/>`).join("")}</g>`;
}
mkdirSync("public/covers", { recursive: true });
for (const book of seedBooks) {
  const lines = wrap(book.title, 19); const font = lines.length > 3 ? 28 : 34;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="540" viewBox="0 0 360 540"><title>${escape(book.title)} — original Book Nook cover</title><defs><pattern id="grain" width="7" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".6" fill="${book.ink}" opacity=".1"/></pattern><linearGradient id="spine"><stop stop-color="#000" stop-opacity=".22"/><stop offset=".4" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="360" height="540" fill="${book.color}"/><rect width="360" height="540" fill="url(#grain)"/><g color="${book.ink}"><rect x="22" y="22" width="316" height="496" rx="1" fill="none" stroke="currentColor" stroke-width="1" opacity=".65"/><path d="M37 46H323M37 488H323" stroke="currentColor" opacity=".7"/><text x="180" y="66" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="currentColor">THE BOOK NOOK COLLECTION</text><text x="180" y="106" text-anchor="middle" font-family="Georgia,serif" font-size="14" letter-spacing="1" fill="currentColor">${escape(book.author.toUpperCase())}</text>${lines.map((line, i) => `<text x="180" y="${151 + i * (font + 5)}" text-anchor="middle" font-family="Georgia,serif" font-size="${font}" fill="currentColor">${escape(line)}</text>`).join("")}<g transform="translate(0 ${Math.max(0, (lines.length - 2) * 18)}) scale(1 ${lines.length > 3 ? .85 : 1})">${ornament(book.motif)}</g><text x="180" y="505" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="2" fill="currentColor">A STORY TO KEEP</text></g><rect width="17" height="540" fill="url(#spine)"/></svg>`;
  writeFileSync(`public/covers/${book.slug}.svg`, svg);
}
writeFileSync("public/icon.svg", '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#743c46"/><path d="M32 18c-7-5-15-5-22-2v30c8-3 15-2 22 3 7-5 14-6 22-3V16c-7-3-15-3-22 2Zm0 0v31" fill="none" stroke="#f7f2e9" stroke-width="3" stroke-linejoin="round"/></svg>');
console.log(`Created ${seedBooks.length} original covers.`);
