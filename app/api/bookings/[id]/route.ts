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
  fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2), "utf8");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { workerId, workerName } = body;

  if (!workerId || !workerName) {
    return NextResponse.json({ error: "workerId y workerName son requeridos." }, { status: 400 });
  }

  const bookings = readBookings();
  const idx = bookings.findIndex((b: { id: string }) => b.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
  }

  bookings[idx] = { ...bookings[idx], workerId, workerName, status: "assigned" };
  writeBookings(bookings);

  return NextResponse.json(bookings[idx]);
}
