import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HealthAlertsService } from '../../services/health-alerts.service';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'hour', 'patient', 'alertType', 'description', 'caregiver', 'actions'];
  alerts = new MatTableDataSource<Alert>();
  readonly dialog = inject(MatDialog);
  private caregiverId = localStorage.getItem('caregiverId') || '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private alertService: HealthAlertsService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  ngAfterViewInit() {
    this.alerts.paginator = this.paginator;
  }

  private loadAlerts(): void {
    this.alertService.getHealthAlertsByCaregiverId(this.caregiverId).subscribe({
      next: (data: Alert[]) => {
        this.alerts.data = data; // Asigna los datos a la fuente de datos de la tabla
      },
      error: (err) => {
        console.error('Error fetching alerts:', err);
      }
    });
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
    @Inject(MAT_DIALOG_DATA) public data: Alert,
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
