export type PackageStatus = 'transit' | 'delivered' | 'exception';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Package {
  id: string;
  trackingNo: string;
  recipient: string;
  address: string;
  currentCity: string;
  destinationCity: string;
  status: PackageStatus;
  progress: number;
  estimatedDelivery: string;
  x: number;
  y: number;
  route: { x: number; y: number }[];
  tagIds: string[];
}

export type MapMode = 'normal' | 'satellite';
export type FilterStatus = 'all' | PackageStatus;
export type FilterTag = 'all' | string;
