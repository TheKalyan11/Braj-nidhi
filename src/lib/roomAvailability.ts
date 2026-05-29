import fs from 'fs';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoomType = 'deluxe2' | 'deluxe3' | 'deluxe4';

export const TOTAL_ROOMS: Record<RoomType, number> = {
  deluxe2: 3,
  deluxe3: 3,
  deluxe4: 2,
};

export const UPGRADE_ORDER: RoomType[] = ['deluxe2', 'deluxe3', 'deluxe4'];

export const ROOM_NAMES: Record<RoomType, string> = {
  deluxe2: 'Deluxe 2 – Twin Bedded Room',
  deluxe3: 'Deluxe 3 – Triple Room',
  deluxe4: 'Deluxe 4 – Family Room',
};

export const ROOM_PRICES: Record<RoomType, number> = {
  deluxe2: 3500,
  deluxe3: 4500,
  deluxe4: 6500,
};

export interface BookingRecord {
  id: string;
  roomType: RoomType;
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  rooms: number;
  adults: number;
  children: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  bookedAt: string;  // ISO timestamp
  status: 'confirmed' | 'cancelled';
  erpReservationId?: string;
  erpSyncStatus?: 'synced' | 'pending' | 'failed';
}

// ─── Storage Abstraction ──────────────────────────────────────────────────────
// • Vercel (production) → Upstash Redis  (UPSTASH_REDIS_REST_URL + _TOKEN set)
// • Local dev           → src/data/bookings.json  (file on disk)

const KV_KEY = 'bn:bookings';

// ── Local file helpers (dev only) ─────────────────────────────────────────────

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'bookings.json');

function fileReadBookings(): BookingRecord[] {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_PATH))
      fs.writeFileSync(DATA_PATH, JSON.stringify({ bookings: [] }, null, 2));
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return (JSON.parse(raw).bookings ?? []) as BookingRecord[];
  } catch {
    return [];
  }
}

function fileWriteBookings(bookings: BookingRecord[]) {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify({ bookings }, null, 2));
  } catch (e) {
    console.error('[storage] file write error:', e);
  }
}

// ── Redis helpers (production) ────────────────────────────────────────────────

function getRedis() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

function isRedisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

// ── Public read / write ───────────────────────────────────────────────────────

export async function readBookings(): Promise<BookingRecord[]> {
  if (isRedisConfigured()) {
    try {
      const redis = getRedis();
      const data = await redis.get(KV_KEY);
      if (!data) return [];
      // Upstash auto-parses JSON
      return Array.isArray(data) ? data as BookingRecord[] : [];
    } catch (e) {
      console.error('[storage] Redis read error, falling back to []:', e);
      return [];
    }
  }
  return fileReadBookings();
}

export async function writeBookings(bookings: BookingRecord[]): Promise<void> {
  if (isRedisConfigured()) {
    try {
      const redis = getRedis();
      await redis.set(KV_KEY, bookings);
    } catch (e) {
      console.error('[storage] Redis write error:', e);
    }
  } else {
    fileWriteBookings(bookings);
  }
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** All calendar dates from `from` (inclusive) up to but NOT including `to` */
export function dateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const cur = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  while (cur < end) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// ─── Availability queries (all async now) ──────────────────────────────────────

/** How many rooms are booked on each date in [from, to) */
export async function getBookedCountsForRange(
  roomType: RoomType,
  from: string,
  to: string,
): Promise<Record<string, number>> {
  const allBookings = await readBookings();
  const bookings = allBookings.filter(
    b => b.roomType === roomType && b.status === 'confirmed',
  );
  const dates = dateRange(from, to);
  const counts: Record<string, number> = {};

  for (const date of dates) {
    counts[date] = 0;
    for (const b of bookings) {
      if (b.checkIn <= date && date < b.checkOut) {
        counts[date] += b.rooms;
      }
    }
  }
  return counts;
}

/** Available rooms per date in [from, to) */
export async function getAvailabilityForRange(
  roomType: RoomType,
  from: string,
  to: string,
): Promise<Record<string, number>> {
  const booked = await getBookedCountsForRange(roomType, from, to);
  const total = TOTAL_ROOMS[roomType];
  const out: Record<string, number> = {};
  for (const [date, count] of Object.entries(booked)) {
    out[date] = Math.max(0, total - count);
  }
  return out;
}

/** Dates where availability < rooms needed */
export async function getUnavailableDates(
  roomType: RoomType,
  from: string,
  to: string,
  rooms = 1,
): Promise<string[]> {
  const avail = await getAvailabilityForRange(roomType, from, to);
  return Object.entries(avail)
    .filter(([, a]) => a < rooms)
    .map(([d]) => d);
}

/** Next upgradeable room type with enough availability */
export async function suggestUpgrade(
  roomType: RoomType,
  checkIn: string,
  checkOut: string,
  rooms = 1,
): Promise<{ roomType: RoomType; name: string; price: number; available: number } | null> {
  const idx = UPGRADE_ORDER.indexOf(roomType);
  for (let i = idx + 1; i < UPGRADE_ORDER.length; i++) {
    const candidate = UPGRADE_ORDER[i];
    const avail = await getAvailabilityForRange(candidate, checkIn, checkOut);
    const values = Object.values(avail);
    const minAvail = values.length ? Math.min(...values) : TOTAL_ROOMS[candidate];
    if (minAvail >= rooms) {
      return {
        roomType: candidate,
        name: ROOM_NAMES[candidate],
        price: ROOM_PRICES[candidate],
        available: minAvail,
      };
    }
  }
  return null;
}

// ─── ERP Integration ──────────────────────────────────────────────────────────

const ERP_BASE = (process.env.ERP_BASE_URL ?? '').replace(/\/$/, '');
const ERP_AUTH = `token ${process.env.ERP_API_KEY ?? ''}:${process.env.ERP_API_SECRET ?? ''}`;
const ERP_PROPERTY = process.env.ERP_PROPERTY ?? 'BRAJ-NIDHI-GUEST-HOUSE-VRN';
const ERP_BOOKING_TYPE = process.env.ERP_BOOKING_TYPE ?? 'Walk-In';
const ERP_HOLD_TYPE = process.env.ERP_HOLD_TYPE ?? 'BN-Website Hold-0001';

const ERP_ROOM_TYPE_MAP: Record<RoomType, string | undefined> = {
  deluxe2: process.env.ERP_ROOM_TYPE_DELUXE2 || undefined,
  deluxe3: process.env.ERP_ROOM_TYPE_DELUXE3 || undefined,
  deluxe4: process.env.ERP_ROOM_TYPE_DELUXE4 || undefined,
};

export async function syncToERP(booking: BookingRecord): Promise<{
  erpReservationId?: string;
  status: 'synced' | 'failed';
  error?: string;
}> {
  const erpRoomTypeId = ERP_ROOM_TYPE_MAP[booking.roomType];

  if (!ERP_BASE || !process.env.ERP_API_KEY) {
    return { status: 'failed', error: 'ERP credentials not configured' };
  }
  if (!erpRoomTypeId) {
    return {
      status: 'failed',
      error: `ERP room type ID for ${booking.roomType} not configured. Set ERP_ROOM_TYPE_${booking.roomType.toUpperCase()}`,
    };
  }

  try {
    const res = await fetch(`${ERP_BASE}.create_reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: ERP_AUTH },
      body: JSON.stringify({
        property: ERP_PROPERTY,
        check_in_date: booking.checkIn,
        check_out_date: booking.checkOut,
        booking_type: ERP_BOOKING_TYPE,
        hold_type: ERP_HOLD_TYPE,
        guest: {
          name: booking.guestName || 'Guest',
          email: booking.guestEmail || '',
          phone: booking.guestPhone || '',
        },
        rooms: [
          {
            room_type: erpRoomTypeId,
            qty: booking.rooms,
            adults: booking.adults,
            children: booking.children,
          },
        ],
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok || data.exc || data.exception) {
      const errMsg = data._error_message || data.exception || JSON.stringify(data).slice(0, 200);
      return { status: 'failed', error: errMsg };
    }

    const result = data.message ?? data;
    const erpReservationId: string | undefined =
      result.reservationId ?? result.reservation_id ?? result.name;
    return { status: 'synced', erpReservationId };
  } catch (e: any) {
    return { status: 'failed', error: e.message ?? 'Network error' };
  }
}

// ─── Booking management ───────────────────────────────────────────────────────

export async function createBooking(params: {
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}): Promise<{ success: boolean; booking?: BookingRecord; error?: string; erpError?: string }> {
  // Check availability
  const avail = await getAvailabilityForRange(params.roomType, params.checkIn, params.checkOut);
  const values = Object.values(avail);
  if (values.length === 0) return { success: false, error: 'Invalid date range' };
  const minAvail = Math.min(...values);

  if (minAvail < params.rooms) {
    return {
      success: false,
      error: `Only ${minAvail} room(s) available for the selected dates`,
    };
  }

  // Build and save booking
  const bookings = await readBookings();
  const booking: BookingRecord = {
    id: `BK${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    roomType: params.roomType,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    rooms: params.rooms,
    adults: params.adults,
    children: params.children,
    guestName: params.guestName,
    guestEmail: params.guestEmail,
    guestPhone: params.guestPhone,
    bookedAt: new Date().toISOString(),
    status: 'confirmed',
    erpSyncStatus: 'pending',
  };

  bookings.push(booking);
  await writeBookings(bookings);

  // ERP sync (non-blocking)
  let erpError: string | undefined;
  try {
    const erpResult = await syncToERP(booking);
    const all = await readBookings();
    const idx = all.findIndex(b => b.id === booking.id);
    if (idx !== -1) {
      all[idx].erpSyncStatus = erpResult.status;
      if (erpResult.erpReservationId) all[idx].erpReservationId = erpResult.erpReservationId;
      await writeBookings(all);
      booking.erpSyncStatus = erpResult.status;
      booking.erpReservationId = erpResult.erpReservationId;
    }
    if (erpResult.status === 'failed') erpError = erpResult.error;
  } catch (e: any) {
    erpError = e.message;
  }

  return { success: true, booking, erpError };
}

export async function cancelBooking(id: string): Promise<boolean> {
  const bookings = await readBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = 'cancelled';
  await writeBookings(bookings);
  return true;
}

export async function restoreBooking(id: string): Promise<boolean> {
  const bookings = await readBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = 'confirmed';
  await writeBookings(bookings);
  return true;
}

export async function retryERPSync(id: string): Promise<{ success: boolean; error?: string }> {
  const bookings = await readBookings();
  const booking = bookings.find(b => b.id === id);
  if (!booking) return { success: false, error: 'Booking not found' };
  const result = await syncToERP(booking);
  const idx = bookings.findIndex(b => b.id === id);
  bookings[idx].erpSyncStatus = result.status;
  if (result.erpReservationId) bookings[idx].erpReservationId = result.erpReservationId;
  await writeBookings(bookings);
  return { success: result.status === 'synced', error: result.error };
}
