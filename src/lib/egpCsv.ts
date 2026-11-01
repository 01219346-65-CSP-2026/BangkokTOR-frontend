// The file e-GP's announcement search exports (its "Export .CSV" button):
// every row of a search, not just the page on screen. A few title lines come
// before the header ("ข้อมูลโครงการจัดซื้อจัดจ้าง ประจำปีงบประมาณ …", the
// keyword, the announcement type), so the header is found by its
// project-number column rather than assumed to be line 1.

export type EgpCsvProject = {
  projectId: string;
  title?: string;
  agency?: string;
  province?: string;
  /** สถานะโครงการ as e-GP words it. Preview only: the worker reads the stage from e-GP. */
  status?: string;
};

export type EgpCsv = {
  projects: EgpCsvProject[];
  /** Data rows whose project number was not 11 digits, or repeated one already seen. */
  skipped: number;
};

/** e-GP project number: BE year + month + 7 digits. The backend checks the same. */
const PROJECT_ID = /^\d{11}$/;

const COLUMNS = {
  projectId: "เลขที่โครงการ",
  title: "ชื่อโครงการ",
  agency: "หน่วยงาน",
  province: "จังหวัด",
  status: "สถานะโครงการ",
} as const;

/** RFC 4180: commas and newlines inside quotes, "" for a quote, CRLF or LF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = false;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** The projects in an e-GP export, or null when the file has no project-number column. */
export function parseEgpCsv(text: string): EgpCsv | null {
  const rows = parseCsv(text.replace(/^﻿/, ""));
  const headerAt = rows.findIndex((r) => r.some((cell) => cell.trim() === COLUMNS.projectId));
  if (headerAt < 0) return null;

  const header = rows[headerAt].map((cell) => cell.trim());
  const at = Object.fromEntries(
    Object.entries(COLUMNS).map(([key, name]) => [key, header.indexOf(name)]),
  ) as Record<keyof typeof COLUMNS, number>;
  const read = (row: string[], index: number) => {
    const value = index >= 0 ? row[index]?.trim() : undefined;
    return value ? value : undefined;
  };

  const seen = new Set<string>();
  const projects: EgpCsvProject[] = [];
  let skipped = 0;

  for (const row of rows.slice(headerAt + 1)) {
    if (row.every((cell) => cell.trim() === "")) continue;
    const projectId = read(row, at.projectId) ?? "";
    if (!PROJECT_ID.test(projectId) || seen.has(projectId)) {
      skipped++;
      continue;
    }
    seen.add(projectId);
    projects.push({
      projectId,
      title: read(row, at.title),
      agency: read(row, at.agency),
      province: read(row, at.province),
      status: read(row, at.status),
    });
  }

  return { projects, skipped };
}
