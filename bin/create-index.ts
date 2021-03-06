import mustache from "https://unpkg.com/mustache@3.2.0/mustache.mjs";

const te = new TextEncoder();
const td = new TextDecoder();

function readFile(name: string) {
	const buffer = Deno.readFileSync(name);
	return td.decode(buffer);
}

if (Deno.args.length < 1) { throw new Error("Pass template name as an argument"); }

const template = readFile(Deno.args[0]);
const data = {
	generated: new Date().toDateString()
};
const partials: Record<string, string> = {};

["games", "utils", "old", "projects", "talks", "writings"].forEach(name => {
	partials[name] = readFile(`build/${name}.partial`);
});

const result = (mustache as any).render(template, data, partials);
Deno.stdout.writeSync(te.encode(result));
