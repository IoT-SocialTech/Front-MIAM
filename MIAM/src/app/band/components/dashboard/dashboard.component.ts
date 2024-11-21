import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';  
import { AccountService } from '../../services/account.service';
import Chart from 'chart.js/auto';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';
import { MedicationAlertsService } from '../../services/medication-alerts.service';
import { forkJoin, map } from 'rxjs';
import { Patient } from '../../models/patient.model';


interface Caregiver {
  id: string;
  name: string;
  patients: Patient[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  public tempChart: any;
  public pulseChart: any;

  patients: { value: string, viewValue: string }[] = [];
  selectedPatient: Patient | null = null;  // Esto ya no se usará para las alertas

  currentDate: Date = new Date();
  formattedDate: string = '';
  temperatureData: number[] = [35.0, 36.1, 35.4, 37.5]; 
  pulseData: number[] = [72, 75, 78, 76, 74, 73, 77]; 
  chart!: Chart;

  caregivers: Caregiver[] = []; // Array para cuidadores
  allMedicationAlerts: any[] = []; // Array para todas las alertas de medicación
  expandedCaregiver: string | null = null; // Control de expansión

  @ViewChild('temperatureChart', { static: true }) private temperatureChartRef!: ElementRef;
  @ViewChild('pulseChart', { static: true }) private pulseChartRef!: ElementRef;

  constructor(
    private patientService: PatientService, 
    private accountService: AccountService,
    private patientCaregiverService: PatientCaregiverService,
    private medicationAlertService: MedicationAlertsService
  ) {}

  ngOnInit(): void {
    this.loadCaregivers();  // Cargamos los cuidadores y sus pacientes
    this.formattedDate = this.formatDate(this.currentDate); 
  }

  ngAfterViewInit(): void {
    this.createTemperatureChart(); 
    this.createPulseChart(); 
  }

  loadCaregivers(): void {
    const accountId = parseInt(localStorage.getItem('accountId') || '', 10);
    const caregiverId = parseInt(localStorage.getItem('caregiverId') || '', 10);

    if (accountId && !isNaN(caregiverId)) {
      this.accountService.getAccountById(accountId).subscribe(
        (account) => {
          if (account.role.id == 2) { // Caregiver
            this.patientCaregiverService.getPatientsByCaregiverId(caregiverId.toString()).subscribe(
              (response) => {
                const caregiverMap = new Map<string, Caregiver>();
                
                if (Array.isArray(response)) {
                  response.forEach(item => {
                    const caregiverId = item.caregiver.id.toString();
                    if (!caregiverMap.has(caregiverId)) {
                      caregiverMap.set(caregiverId, {
                        id: caregiverId,
                        name: item.caregiver.name,
                        patients: [] 
                      });
                    }
                    caregiverMap.get(caregiverId)?.patients.push(item.patient);
                  });

                  this.caregivers = Array.from(caregiverMap.values());
                  this.loadMedicationAlerts(); // Una vez cargados los cuidadores y pacientes, cargamos las alertas
                } else {
                  console.warn('Response is not an array');
                }
              },
              (error) => {
                console.error('Error fetching patients for caregiver:', error);
              }
            );
          } else if (account.role.id == 4) {
            // Lógica para el caso de Nursing Home (si aplica)
          }
        },
        (error) => {
          console.error('Error fetching account:', error);
        }
      );
    } else {
      console.error('Invalid accountId or caregiverId');
    }
  }

  loadMedicationAlerts(): void {
    this.allMedicationAlerts = []; // Limpiar lista de alertas previas
  
    const allPatients = this.caregivers.flatMap(caregiver => caregiver.patients || []);
  
    console.log('All patients:', allPatients); 
  
    const alertRequests = allPatients.map(patient =>
      this.medicationAlertService.getMedicationAlertsByPatientId(patient.id)
    );
  
    console.log('All alert requests:', alertRequests); 
  
    forkJoin(alertRequests).subscribe(
      (alerts) => {
        console.log('All alerts received:', alerts); 
  
        alerts.forEach((alertData, index) => {
          const patient = allPatients[index];
  
          if (alertData && Array.isArray(alertData) && alertData.length > 0) {
            // Filtrar las alertas donde 'taken' sea false
            const filteredAlerts = alertData.filter(alert => alert.taken === false);
  
            if (filteredAlerts.length > 0) {
              // Mapeamos solo las alertas no tomadas
              this.allMedicationAlerts.push({
                patientName: `${patient.name} ${patient.lastName}`,
                patientId: patient.id,  
                alerts: filteredAlerts.map(alert => ({
                  id: alert.id,
                  medicationName: alert.medicationName,
                  dose: alert.dose,
                  hour: alert.hour,
                  taken: alert.taken
                }))
              });
            }
          } else {
            console.error('Invalid alert data for patient:', patient.name, alertData);
          }
        });
  
        console.log('Filtered medication alerts:', this.allMedicationAlerts); 
      },
      (error) => {
        console.error('Error loading medication alerts:', error);
      }
    );
  }
  
  
  

  markAsTaken(alert: any): void {
    // Logic to mark the alert as taken
    console.log('Marking alert as taken:', alert);
    
    this.medicationAlertService.editMedicationAlert(alert.id, true).subscribe(
      (response) => {
        console.log('Alert marked as taken:', response);
        this.loadMedicationAlerts(); // Recargar las alertas
      },
      (error) => {
        console.error('Error marking alert as taken:', error);
      }
    );
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }); 
    const year = date.getFullYear();
    const daySuffix = this.getDaySuffix(day);
    return `${month} ${day}${daySuffix}, ${year}`;
  }

  getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';  
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  createTemperatureChart() {
    const labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'];
    this.tempChart = new Chart(this.temperatureChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: this.temperatureData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: true,
            ticks: {
              font: { size: 8 },
              autoSkip: true,
              maxTicksLimit: 8 
            }
          },
          y: {
            display: true,
            beginAtZero: false,
            ticks: {
              font: { size: 8 }
            },
            title: { display: false }
          }
        }
      }
    });
  }

  createPulseChart() {
    const labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'];
    this.pulseChart = new Chart(this.pulseChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: this.pulseData,
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            display: true,
            ticks: {
              font: { size: 8 },
              autoSkip: true,
              maxTicksLimit: 8  
            }
          },
          y: {
            display: true,
            beginAtZero: false,
            ticks: {
              font: { size: 8 }
            },
            title: { display: false }
          }
        }
      }
    });
  }
}
