import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "workers.json");

function readWorkers() {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return [];
  }
}

function writeWorkers(workers: unknown[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(workers, null, 2), "utf8");
}

export async function GET() {
  return NextResponse.json(readWorkers());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, name, phone, email, service } = body;

  if (!id || !name || !service) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  const workers = readWorkers();
  if (workers.find((w: { id: string }) => w.id === id)) {
    return NextResponse.json(workers.find((w: { id: string }) => w.id === id));
  }

  const worker = {
    id: String(id),
    name: String(name).trim(),
    phone: String(phone || "").trim(),
    email: String(email || "").trim(),
    service: String(service).trim(),
    createdAt: new Date().toISOString(),
  };

  writeWorkers([...workers, worker]);
  return NextResponse.json(worker, { status: 201 });
}
