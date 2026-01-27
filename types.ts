
export enum AuthStep {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  OTP = 'OTP',
  DASHBOARD = 'DASHBOARD'
}

export type Vibe = 'classic' | 'neon' | 'good-vibes' | 'sunset';

export interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number;
  image: string;
  trailerUrl: string;
  genre: string[];
  duration: string;
  price: number;
  parkingAvailable: boolean;
  parkingPrice: number;
}

export interface Schedule {
  morning: string[];
  afternoon: string[];
  evening: string[];
  night: string[];
}

export interface Seat {
  id: string;
  row: string;
  num: number;
  status: 'available' | 'booked' | 'selected' | 'blocked';
  blockedUntil?: number;
}

export interface ParkingSpot {
  id: string;
  status: 'available' | 'occupied' | 'selected' | 'blocked';
  type: 'standard' | 'ev' | 'accessible';
  blockedUntil?: number;
}