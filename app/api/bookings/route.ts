import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "bookings.json");

function readBookings() {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return [];
  }
}

function writeBookings(bookings: unknown[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2), "utf8");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workerId = searchParams.get("workerId");
  const bookings = readBookings();
  const result = workerId
    ? bookings.filter((b: { workerId: string | null }) => b.workerId === workerId)
    : bookings;
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, address, service, date, notes } = body;

  if (!name || !phone || !address || !service || !date) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  const booking = {
    id: `bk_${Date.now()}`,
    name: String(name).trim(),
    phone: String(phone).trim(),
    address: String(address).trim(),
    service: String(service).trim(),
    date: String(date).trim(),
    notes: String(notes || "").trim(),
    status: "pending",
    workerId: null,
    workerName: null,
    createdAt: new Date().toISOString(),
  };

  const bookings = readBookings();
  writeBookings([...bookings, booking]);

  return NextResponse.json(booking, { status: 201 });
}
