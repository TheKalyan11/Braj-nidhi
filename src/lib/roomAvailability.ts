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
  erpReservationId?: string;   // set when ERP sync succeeds
  erpSyncStatus?: 'synced' | 'pending' | 'failed';
}

// ─── Local file store ─────────────────────────────────────────────────────────

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'bookings.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH))
    fs.writeFileSync(DATA_PATH, JSON.stringify({ bookings: [] }, null, 2));
}

export function readBookings(): BookingRecord[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return (JSON.parse(raw).bookings ?? []) as BookingRecord[];
  } catch {
    return [];
  }
}

export function writeBookings(bookings: BookingRecord[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_PATH, JSON.stringify({ bookings }, null, 2));
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

// ─── Availability queries ──────────────────────────────────────────────────────

/** How many rooms are booked on each date in [from, to) */
export function getBookedCountsForRange(
  roomType: RoomType,
  from: string,
  to: string,
): Record<string, number> {
  const bookings = readBookings().filter(
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
export function getAvailabilityForRange(
  roomType: RoomType,
  from: string,
  to: string,
): Record<string, number> {
  const booked = getBookedCountsForRange(roomType, from, to);
  const total = TOTAL_ROOMS[roomType];
  const out: Record<string, number> = {};
  for (const [date, count] of Object.entries(booked)) {
    out[date] = Math.max(0, total - count);
  }
  return out;
}

/** Dates where availability < rooms needed */
export function getUnavailableDates(
  roomType: RoomType,
  from: string,
  to: string,
  rooms = 1,
): string[] {
  const avail = getAvailabilityForRange(roomType, from, to);
  return Object.entries(avail)
    .filter(([, a]) => a < rooms)
    .map(([d]) => d);
}

/** Next upgradeable room type with enough availability */
export function suggestUpgrade(
  roomType: RoomType,
  checkIn: string,
  checkOut: string,
  rooms = 1,
): { roomType: RoomType; name: string; price: number; available: number } | null {
  const idx = UPGRADE_ORDER.indexOf(roomType);
  for (let i = idx + 1; i < UPGRADE_ORDER.length; i++) {
    const candidate = UPGRADE_ORDER[i];
    const avail = getAvailabilityForRange(candidate, checkIn, checkOut);
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

/** Call ERP and push booking as reservation */
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
      error: `ERP room type ID for ${booking.roomType} not configured. Set ERP_ROOM_TYPE_${booking.roomType.toUpperCase()} in .env.local`,
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
    const erpReservationId: string | undefined = result.reservationId ?? result.reservation_id ?? result.name;
    return { status: 'synced', erpReservationId };
  } catch (e: any) {
    return { status: 'failed', error: e.message ?? 'Network error' };
  }
}

// ─── Search ERP for room availability (when room types are configured) ─────────

export async function searchERPRooms(params: {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}): Promise<{ available: boolean; erpData?: any; error?: string }> {
  if (!ERP_BASE || !process.env.ERP_API_KEY) {
    return { available: false, error: 'ERP not configured' };
  }
  try {
    const res = await fetch(`${ERP_BASE}.search_rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: ERP_AUTH },
      body: JSON.stringify({
        property: ERP_PROPERTY,
        check_in_date: params.checkIn,
        check_out_date: params.checkOut,
        guests: params.guests,
        rooms: params.rooms,
        booking_type: ERP_BOOKING_TYPE,
        hold_type: ERP_HOLD_TYPE,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    const data = await res.json();
    const result = data.message ?? data;
    return {
      available: (result.availableRooms?.length ?? 0) > 0,
      erpData: result,
    };
  } catch (e: any) {
    return { available: false, error: e.message };
  }
}

// ─── Booking management ───────────────────────────────────────────────────────

/** Create a booking locally and attempt ERP sync */
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
  // Check local availability first
  const avail = getAvailabilityForRange(params.roomType, params.checkIn, params.checkOut);
  const values = Object.values(avail);
  if (values.length === 0) return { success: false, error: 'Invalid date range' };
  const minAvail = Math.min(...values);

  if (minAvail < params.rooms) {
    return {
      success: false,
      error: `Only ${minAvail} room(s) available for the selected dates`,
    };
  }

  // Create local record
  const bookings = readBookings();
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
  writeBookings(bookings);

  // Try ERP sync (non-blocking — don't fail if ERP is down)
  let erpError: string | undefined;
  try {
    const erpResult = await syncToERP(booking);
    const all = readBookings();
    const idx = all.findIndex(b => b.id === booking.id);
    if (idx !== -1) {
      all[idx].erpSyncStatus = erpResult.status;
      if (erpResult.erpReservationId) all[idx].erpReservationId = erpResult.erpReservationId;
      writeBookings(all);
      booking.erpSyncStatus = erpResult.status;
      booking.erpReservationId = erpResult.erpReservationId;
    }
    if (erpResult.status === 'failed') erpError = erpResult.error;
  } catch (e: any) {
    erpError = e.message;
  }

  return { success: true, booking, erpError };
}

/** Cancel a booking */
export function cancelBooking(id: string): boolean {
  const bookings = readBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = 'cancelled';
  writeBookings(bookings);
  return true;
}

/** Restore a cancelled booking */
export function restoreBooking(id: string): boolean {
  const bookings = readBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = 'confirmed';
  writeBookings(bookings);
  return true;
}

/** Retry ERP sync for a failed booking */
export async function retryERPSync(id: string): Promise<{ success: boolean; error?: string }> {
  const bookings = readBookings();
  const booking = bookings.find(b => b.id === id);
  if (!booking) return { success: false, error: 'Booking not found' };
  const result = await syncToERP(booking);
  const idx = bookings.findIndex(b => b.id === id);
  bookings[idx].erpSyncStatus = result.status;
  if (result.erpReservationId) bookings[idx].erpReservationId = result.erpReservationId;
  writeBookings(bookings);
  return { success: result.status === 'synced', error: result.error };
}
