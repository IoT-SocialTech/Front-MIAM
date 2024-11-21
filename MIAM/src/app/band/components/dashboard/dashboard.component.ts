import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';  
import { AccountService } from '../../services/account.service';
import Chart from 'chart.js/auto';
import { PatientCaregiverService } from '../../services/patient-caregiver.service';
import { MedicationAlertsService } from '../../services/medication-alerts.service';
import { forkJoin, map, Observable } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { Alert } from '../../models/alert.model';
import { ReportHistoryService } from '../../services/report-history.service';
import { FeingClientService } from '../../services/feing-client.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public tempChart: any;
  public pulseChart: any;
  private subscription: Subscription = new Subscription();

  patients: { value: string, viewValue: string }[] = [];
  selectedPatient: Patient | null = null;  // Esto ya no se usará para las alertas
  alerts: { data: Alert[] } = { data: [] }; 

  currentDate: Date = new Date();
  formattedDate: string = '';
  temperatureData: any[] = []; 
  pulseData: any[] = []; 
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
    private medicationAlertService: MedicationAlertsService,
    private reportHistoryService: ReportHistoryService,
    private feingClientService: FeingClientService,
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.temperatureData = []; 
    this.pulseData = [];

    this.loadCaregivers();  // Cargamos los cuidadores y sus pacientes
    this.formattedDate = this.formatDate(this.currentDate); 
    this.loadAlerts();

    this.subscription = interval(5000)
      .pipe(
        switchMap(() => this.loadChartData())  // fetches and updates chart data
      )
      .subscribe({
        next: (response) => {
          // handle success
        },
        error: (error) => console.error('Error fetching data:', error)
      });
        
      }

  ngAfterViewInit(): void {
    this.createTemperatureChart(); 
    this.createPulseChart(); 

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
 
  loadAlerts(): void {
    const caregiverId = parseInt(localStorage.getItem('caregiverId') || '', 10);
  
    this.reportHistoryService.getReportsByCaregiverId(caregiverId.toString()).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {

          const filteredAlerts = response.filter((alert: Alert) => alert.reportType !== 'NORMAL_METRICS');
          this.alerts.data = filteredAlerts;
  
          filteredAlerts.forEach((alert: Alert) => {
            this.getPatientName(alert.patientId).subscribe(
              (patientName) => {
                alert.patientId = patientName;
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
  
  
  getAlertType(type: string): string {
    switch(type) {
      case 'HIGH_HEART_RATE': return 'High heart rate';
      case 'LOW_HEART_RATE': return 'Low heart rate';
      case 'HIGH_TEMPERATURE': return 'High temperature';
      case 'LOW_TEMPERATURE': return 'Low temperature';
      case 'NORMAL_METRICS': return 'Normal metrics';
      default: return 'Unknown alert type';
    }
  }

  getPatientName(patientId: string): Observable<string> {
    return this.patientService.getPatient(patientId).pipe(
      map(patient => {
        return `${patient?.name || 'Unknown'} ${patient?.lastName || 'Unknown'}`;
      })
    );
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
    
    const alertRequests = allPatients.map(patient =>
      this.medicationAlertService.getMedicationAlertsByPatientId(patient.id)
    );
  
  
    forkJoin(alertRequests).subscribe(
      (alerts) => {
  
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
        },
      (error) => {
        console.error('Error loading medication alerts:', error);
      }
    );
  }
  
  
  updateTemperatureChart(newTemp: number): void {
    if (!Array.isArray(this.temperatureData)) {
      this.temperatureData = []; // Asegúrate de que sea un array
    }
  
    this.temperatureData.push(newTemp); // Agrega el nuevo valor
    console.log('Temperature data before shift:', this.temperatureData);
  
    // Limitar la cantidad de datos a 10 elementos
    while (this.temperatureData.length > 10) {
      this.temperatureData.shift();
    }
  
    console.log('Temperature data after shift:', this.temperatureData);
  
    // Actualiza el gráfico si existe
    if (this.tempChart) {
      this.tempChart.data.datasets[0].data = this.temperatureData; // Actualiza los datos del gráfico
      this.tempChart.update(); // Actualiza la visualización
    }
  }
  
  updatePulseChart(newPulse: number): void {
    if (!Array.isArray(this.pulseData)) {
      this.pulseData = []; // Asegúrate de que sea un array
    }
  
    this.pulseData.push(newPulse); // Agrega el nuevo valor
    console.log('Pulse data before shift:', this.pulseData);
  
    // Limitar la cantidad de datos a 10 elementos
    while (this.pulseData.length > 10) {
      this.pulseData.shift();
    }
  
    console.log('Pulse data after shift:', this.pulseData);
  
    // Actualiza el gráfico si existe
    if (this.pulseChart) {
      this.pulseChart.data.datasets[0].data = this.pulseData; // Actualiza los datos del gráfico
      this.pulseChart.update(); // Actualiza la visualización
    }
  }


  loadChartData(): Observable<any> {

    console.log('Loading chart data...'); 

    return forkJoin({
      temperature: this.feingClientService.getTemperature("1"),
      heartRate: this.feingClientService.getHeartRate("1")
    }).pipe(
      map(({ temperature, heartRate }) => {
        this.temperatureData.push(temperature.temperature);
        this.pulseData.push(heartRate.heartRate);

        console.log('Temperature data:', temperature.temperature);
        console.log('Pulse data:', heartRate.heartRate);

        if(temperature.temperature!= null && heartRate.heartRate != null){
          this.updateTemperatureChart(temperature.temperature);
          this.updatePulseChart(heartRate.heartRate);
        }
      })
    );
  }
  

  markAsTaken(alert: any): void {
    
    this.medicationAlertService.editMedicationAlert(alert.id, true).subscribe(
      (response) => {
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
