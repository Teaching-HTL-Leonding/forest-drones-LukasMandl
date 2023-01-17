export interface Drone {
  id: number;
  isActive: boolean;
  position? : Position;
}

export interface Position
{
  x: number;
  y: number;
}

export interface ScanResult
{
  dronePosition: Position;
  damagedTrees: Position[];
}
