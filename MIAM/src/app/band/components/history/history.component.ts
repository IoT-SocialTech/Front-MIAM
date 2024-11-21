import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReportHistoryService } from '../../services/report-history.service';
import { PatientService } from '../../services/patient.service';
import { Alert } from '../../models/alert.model';
import { map, Observable } from 'rxjs';

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

  constructor(
    private reportHistoryService: ReportHistoryService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  ngAfterViewInit() {
    this.alerts.paginator = this.paginator;
  }
  

  private loadAlerts(): void {
    const caregiverId = parseInt(localStorage.getItem('caregiverId') || '', 10);

  this.reportHistoryService.getReportsByCaregiverId(caregiverId.toString()).subscribe({
    next: (response: Alert[]) => {
      if (Array.isArray(response)) {
        // Asignar directamente las alertas sin filtrar
        this.alerts.data = response;

        // Reemplazar patientId con patientName para cada alerta
        response.forEach((alert: Alert) => {
          this.getPatientName(alert.patientId).subscribe(
            (patientName) => {
              alert.patientId = patientName; // Cambia el patientId por el nombre del paciente
            },
            (error) => {
              console.error('Error fetching patient name for alert:', error);
            }
          );
        });
      } else {
        console.error('Unexpected response format. Expected an array of alerts.');
      }
    },
    error: (err) => {
      console.error('Error loading alerts:', err);
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


  getAlertType(type: string): string {
    console.log('Alert type:', type); 
    switch(type) {
      case 'HIGH_HEART_RATE': return 'High heart rate';
      case 'LOW_HEART_RATE': return 'Low heart rate';
      case 'HIGH_TEMPERATURE': return 'High temperature';
      case 'LOW_TEMPERATURE': return 'Low temperature';
      case 'NORMAL_METRICS': return 'Normal metrics';
      default: return 'Unknown alert type';
    }
  }

  getDate(dateTime: string): string {
    return dateTime.split('T')[0]; 
  }
  
  getTime(dateTime: string): string {
    return dateTime.split('T')[1].split('.')[0]; 
  }

  getPatientName(patientId: string): Observable<string> {
    return this.patientService.getPatient(patientId).pipe(
      map(patient => {
        return `${patient?.name || 'Unknown'} ${patient?.lastName || 'Unknown'}`;
      })
    );
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
    private dialogRef: MatDialogRef<DialogContent>,
    private patientService: PatientService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  calculateTimeSpent(): string {
    const alertDateTime = new Date(`${this.data.generatedDate}`);
    const attendedDateTime = new Date(this.data.attendingDate);
    
    const timeDiff = attendedDateTime.getTime() - alertDateTime.getTime(); 
    const minutes = Math.floor((timeDiff / 1000) / 60); 
    
    return `${minutes} minutes`; 
  }

  getAlertType(type: string): string {
    console.log('Alert type:', type); 
    switch(type) {
      case 'HIGH_HEART_RATE': return 'High heart rate';
      case 'LOW_HEART_RATE': return 'Low heart rate';
      case 'HIGH_TEMPERATURE': return 'High temperature';
      case 'LOW_TEMPERATURE': return 'Low temperature';
      case 'NORMAL_METRICS': return 'Normal metrics';
      default: return 'Unknown alert type';
    }
  }

  getDate(dateTime: string): string {
    return dateTime.split('T')[0]; 
  }

  getTime(dateTime: string): string {
    return dateTime.split('T')[1].split('.')[0]; 
  }

  getPatientName(patientId: string): Observable<string> {
    return this.patientService.getPatient(patientId).pipe(
      map(patient => {
        return `${patient?.name || 'Unknown'} ${patient?.lastName || 'Unknown'}`;
      })
    );
  }
}

