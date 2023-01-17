import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Drone, Position, ScanResult } from '../model'

@Component({
  selector: 'app-drones',
  templateUrl: './drones.component.html',
  styleUrls: ['./drones.component.css']
})
export class DronesComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.drones = []
    this.selectedFlyToMeDroneId = 0;
    this.selectedScanDroneId = 0;
    this.flyToX = 0;
    this.flyToY = 0;
    this.scanX = 0;
    this.scanY = 0;
    this.examineX = 0;
    this.examineY = 0;
    this.nearestTreeX = 0;
    this.nearestTreeY = 0;
    this.distanceTreeX = 0;
    this.distanceTreeY = 0;
   }
  public selectedScanDroneId: number;
  public selectedFlyToMeDroneId: number;
  public flyToX: number;
  public flyToY: number;
  public scanX: number;
  public scanY: number;
  public examineX: number;
  public examineY: number;
  public nearestTreeX: number;
  public nearestTreeY: number;
  public distanceTreeX: number;
  public distanceTreeY: number;
  private drones: Drone[];
  public scanResult?: ScanResult;
  public getTreePositions(): Position[] {
    if(this.scanResult != undefined)
    {
      return this.scanResult.damagedTrees;
    }
    return [];
  }

  public examine(): void {
    this.http.post('http://localhost:5110/trees/markAsExamined',
    {
      x: this.examineX,
      y: this.examineY
    })
    .subscribe(_ => this.scan());

  }

  public scan(): void {
    this.http.get<ScanResult>(`http://localhost:5110/drones/${this.selectedScanDroneId}/scan`,
    {})
    .subscribe(data =>
      {
        this.scanResult = data;
        this.setNearestTree();
      }
    );
  }

  public examineNextTree(): void {
    this.examineX = this.nearestTreeX;
    this.examineY = this.nearestTreeY;
    this.examine();
    this.examineX = 0;
    this.examineY = 0;
  }


  public flyAndScan(): void{
    this.flyToMe();
    this.selectedScanDroneId = this.selectedFlyToMeDroneId;
    this.scan();

  }

  private setNearestTree(): void {
    if(this.scanResult != undefined && this.scanResult.damagedTrees.length > 0)
    {
      let currentX = this.drones[this.selectedScanDroneId - 1].position?.x;
      let currentY = this.drones[this.selectedScanDroneId - 1].position?.y;

      if(currentX == undefined || currentY == undefined)
      {
        return;
      }
      let minDifference = Math.abs(currentX - this.scanResult.damagedTrees[0].x) + Math.abs(currentY - this.scanResult.damagedTrees[0].y);
      this.nearestTreeX = this.scanResult.damagedTrees[0].x;
      this.nearestTreeY = this.scanResult.damagedTrees[0].y;
      for (let index = 1; index < this.scanResult.damagedTrees.length; index++) {
        if(Math.abs(currentX - this.scanResult.damagedTrees[index].x) + Math.abs(currentY - this.scanResult.damagedTrees[index].y) < minDifference)
        {
          this.nearestTreeX = this.scanResult.damagedTrees[index].x;
          this.nearestTreeY = this.scanResult.damagedTrees[index].y;
          this.distanceTreeX = Math.abs(currentX - this.scanResult.damagedTrees[index].x);
          this.distanceTreeY = Math.abs(currentY - this.scanResult.damagedTrees[index].y);
          minDifference = Math.abs(currentX - this.scanResult.damagedTrees[index].x) + Math.abs(currentY - this.scanResult.damagedTrees[index].y);
        }

      }
    }
  }






  public getDrones(): Drone[] {
    return this.drones;
  }
  public getDronePositionString(droneIx: number): string {
    if(this.drones[droneIx].position!= undefined)
    {
      return `x: ${this.drones[droneIx].position?.x} y: ${this.drones[droneIx].position?.y}`;
    }
    return 'x: - y: -'
  }
  changeDroneStaus(droneIx: number): void {
    console.log("Test")
    console.log(this.drones[droneIx])
    if(this.drones[droneIx].isActive)
    {
      this.http.post(`http://localhost:5110/drones/${droneIx + 1}/shutdown`,
      {})
      .subscribe();
    }else
    {
      console.log(`http://localhost:5110/drones/${droneIx + 1}/activate`)
      this.http.post(`http://localhost:5110/drones/${droneIx + 1}/activate`,
      {})
      .subscribe();
    }
    this.reloadDrones();
  }
  public getActivatedDrones(): Drone[] {
    return this.drones.filter(drone => drone.isActive);
  }

  public flyToMe(): void {
    console.log(`http://localhost:5110/drones/${this.selectedFlyToMeDroneId}/flyTo`);
    this.http.post(`http://localhost:5110/drones/${this.selectedFlyToMeDroneId}/flyTo`,
    {
      x: this.flyToX,
      y: this.flyToY
    },
    {
    })
    .subscribe(_ => this.reloadDrones());
  }

  private reloadDrones(): void {
    this.http.get<Drone[]>('http://localhost:5110/drones',
    {

    })
    .subscribe(data => this.drones = data
    );
  }
  ngOnInit(): void {
    this.reloadDrones();
  }

}
