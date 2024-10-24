import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

interface Alert {
  date: string;
  hour: string;
  patient: string;
  alertType: string;
  description: string;
  caregiver: string;
  actions: string;
  caregivernotes: string;
  caregiverAttendedDate: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'hour', 'patient', 'alertType', 'description', 'caregiver', 'actions'];
  alerts = new MatTableDataSource<Alert>();
  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit(): void {
    const exampleAlerts: Alert[] = [
      {
        date: '2024-09-24',
        hour: '09:49 AM',
        patient: 'María Carrillo',
        alertType: 'High risk of falling',
        description: 'Increased risk of falling',
        caregiver: 'Carolina Suarez',
        actions: 'Patient attended with no incidents',
        caregivernotes: 'Patient is feeling dizzy but resting now',
        caregiverAttendedDate: '2024-09-24 10:00 AM'
      },
      {
        date: '2024-09-24',
        hour: '08:52 AM',
        patient: 'José Díaz',
        alertType: 'High temperature',
        description: 'Current temperature: 38.5°C',
        caregiver: 'Carolina Suarez',
        actions: 'Patient monitored and temperature decreased to 37.5°C',
        caregivernotes: 'Patient is feeling better',
        caregiverAttendedDate: '2024-09-24 09:10 AM'
      }
    ];

    this.alerts.data = exampleAlerts;
  }

  ngAfterViewInit() {
    this.alerts.paginator = this.paginator;
  }

  downloadReport(): void {
    alert('Downloading report...');
  }
  
  openDialog(alert: Alert) {
    const dialogRef = this.dialog.open(DialogContent, {
      data: alert 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
  imports: [MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Alert, // Recibiendo datos de la alerta
    private dialogRef: MatDialogRef<DialogContent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  calculateTimeSpent(): string {
    const alertDateTime = new Date(`${this.data.date} ${this.data.hour}`);
    const attendedDateTime = new Date(this.data.caregiverAttendedDate);
    
    const timeDiff = attendedDateTime.getTime() - alertDateTime.getTime(); 
    
    const minutes = Math.floor((timeDiff / 1000) / 60); 
    
    return `${minutes} minutes`; 
  }
}
