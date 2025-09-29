import { LabeledImage, ProcessItem, ReviewRow } from "@/types";

type UniqueInfo = { rows: ReviewRow[]; notes: Record<string, string> };

export const buildReviewRows = (
	items: ProcessItem[],
	localImages: LabeledImage[],
): ReviewRow[] => {
	const previewByName = new Map(
		localImages.map((i) => [i.file.name, URL.createObjectURL(i.file)]),
	);
	return items.map((it) => {
		const { folder } = splitPath(it.storage_path);

		const defaultFolder = it.person
			? `People/${it.person}`
			: folder || "People/Unknown";

		const previewURL = previewByName.get(it.filename) || "";
		return {
			key: it.storage_path,
			previewURL,
			suggestedFolder: defaultFolder,
			filename: it.filename.replace(/[/\\]/g, "_"),
		};
	});
};

const splitPath = (p: string) => {
	const clean = p.replace(/\\/g, "/").replace(/\/+/g, "/");
	const parts = clean.split("/");
	const filename = parts.pop() || "";
	const orgIdx = parts.indexOf("organized");
	const inBatch =
		orgIdx >= 0 ? parts.slice(orgIdx + 3).join("/") : parts.join("/");
	return { folder: inBatch, filename };
};

export const dedupeByKey = (rows: ReviewRow[]) => {
	const seen = new Set<string>();
	return rows.filter((r) => {
		if (seen.has(r.key)) return false;
		seen.add(r.key);
		return true;
	});
};

const sanitizeSegment = (s: string) =>
	s
		.trim()
		.replace(/[<>:"|?*\u0000-\u001F]/g, "_")
		.replace(/\/+/g, "/")
		.replace(/^\.+$/, "_");

export const safeFolder = (folder: string) => {
	let f = folder.replace(/\\/g, "/").trim();
	if (!f) return "People/Unknown";
	f = f.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
	return f
		.split("/")
		.map((seg) => sanitizeSegment(seg) || "_")
		.join("/");
};

const splitExt = (name: string) => {
	const i = name.lastIndexOf(".");
	if (i <= 0) return { base: name, ext: "" };
	return { base: name.slice(0, i), ext: name.slice(i) };
};

export const enforceUniqueDestinations = (rows: ReviewRow[]): UniqueInfo => {
	const seen = new Map<string, number>();
	const notes: Record<string, string> = {};
	const updated = rows.map((r) => {
		const folder = safeFolder(r.suggestedFolder || "People/Unknown");
		const { base, ext } = splitExt(r.filename || "photo.jpg");

		const candidate = `${folder}/${base}${ext}`;
		const n = seen.get(candidate) || 0;

		if (n === 0) {
			seen.set(candidate, 1);
			return { ...r, suggestedFolder: folder, filename: `${base}${ext}` };
		}

		let k = n + 1;
		let newName = `${base}_${k}${ext}`;
		let newPath = `${folder}/${newName}`;
		while (seen.has(newPath)) {
			k += 1;
			newName = `${base}_${k}${ext}`;
			newPath = `${folder}/${newName}`;
		}
		seen.set(newPath, 1);
		notes[r.key] = `Auto-renamed to avoid duplicate → ${newName}`;
		return { ...r, suggestedFolder: folder, filename: newName };
	});

	return { rows: updated, notes };
};
