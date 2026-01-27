
const API_BASE_URL = 'http://localhost:5000/api';

const BLOCK_KEY = 'flixa_temporary_blocks';

export const BlockManager = {
  getBlocks: (): Record<string, number> => {
    const data = localStorage.getItem(BLOCK_KEY);
    if (!data) return {};
    const blocks = JSON.parse(data);
    const now = Date.now();
    
    // Clean up expired blocks
    const activeBlocks: Record<string, number> = {};
    Object.entries(blocks).forEach(([id, expiry]) => {
      if ((expiry as number) > now) {
        activeBlocks[id] = expiry as number;
      }
    });
    
    if (Object.keys(activeBlocks).length !== Object.keys(blocks).length) {
      localStorage.setItem(BLOCK_KEY, JSON.stringify(activeBlocks));
    }
    
    return activeBlocks;
  },

  addBlocks: (ids: string[]) => {
    const blocks = BlockManager.getBlocks();
    const expiry = Date.now() + 3600000; // 1 hour from now
    ids.forEach(id => {
      blocks[id] = expiry;
    });
    localStorage.setItem(BLOCK_KEY, JSON.stringify(blocks));
  },

  isBlocked: (id: string): boolean => {
    const blocks = BlockManager.getBlocks();
    return !!blocks[id] && blocks[id] > Date.now();
  }
};

const MockDB = {
  getUsers: () => JSON.parse(localStorage.getItem('flixa_mock_users') || '{}'),
  saveUser: (email: string, data: any) => {
    const users = MockDB.getUsers();
    users[email] = { ...users[email], ...data };
    localStorage.setItem('flixa_mock_users', JSON.stringify(users));
  },
  getOTP: (email: string) => MockDB.getUsers()[email]?.otp
};

export const api = {
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const response = await fetch(`${API_BASE_URL}/health`, { 
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch { 
      return false; 
    }
  },

  async register(email: string, phone: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      if (!res.ok) throw new Error();
      return { status: 'success', isOffline: false };
    } catch {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      MockDB.saveUser(email, { phone, otp, is_verified: 0 });
      console.log(`%c[FLIXA SIMULATION] OTP for ${email}: ${otp}`, 'color: #00f2ff; font-weight: bold;');
      return { status: 'success', isOffline: true, simulatedOtp: otp };
    }
  },

  async confirmBooking(bookingData: any) {
    // Add temporary 1-hour blocks for seats and parking
    const idsToBlock = [...bookingData.seats];
    if (bookingData.parking_spot !== 'None') {
      idsToBlock.push(bookingData.parking_spot);
    }
    BlockManager.addBlocks(idsToBlock);

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      return { ...data, isOffline: false };
    } catch {
      console.log('%c[FLIXA SIMULATION] Booking created in LocalStorage with 1hr block', 'color: #ff007a; font-weight: bold;');
      return { status: 'success', booking_id: `SIM-${Date.now()}`, isOffline: true };
    }
  }
};