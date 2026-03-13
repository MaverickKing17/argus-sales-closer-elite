import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Lead {
  id: string;
  name: string;
  assetClass: string;
  sentiment: 'HOT' | 'WARM' | 'NEUTRAL' | 'COLD';
  message: string;
  temporal: string;
  initials: string;
}

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sebastian Vasseur',
    assetClass: 'Penthouse',
    sentiment: 'HOT',
    message: '"Confirmed viewing for Tuesday at ..."',
    temporal: '2M AGO',
    initials: 'SV'
  },
  {
    id: '2',
    name: 'Elena Rodriguez',
    assetClass: 'Detached',
    sentiment: 'WARM',
    message: '"Interested in the Forest Hill listing."',
    temporal: '14M AGO',
    initials: 'ER'
  },
  {
    id: '3',
    name: 'Marcus Tan',
    assetClass: 'Commercial',
    sentiment: 'NEUTRAL',
    message: '"Requested disclosure docs for revi..."',
    temporal: '45M AGO',
    initials: 'MT'
  },
  {
    id: '4',
    name: 'Sarah Jenkins',
    assetClass: 'Condo',
    sentiment: 'COLD',
    message: '"Just browsing at the moment, tha..."',
    temporal: '1H AGO',
    initials: 'SJ'
  }
];
