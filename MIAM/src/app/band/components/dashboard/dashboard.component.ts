import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';  
import Chart from 'chart.js/auto';

interface Patient {
  id: string;    
  name: string;  
}

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
  selectedPatient: string | null = null;
  
  currentDate: Date = new Date();
  formattedDate: string = '';
  temperatureData: number[] = [35.0, 36.1, 35.4, 37.5]; 
  pulseData: number[] = [72, 75, 78, 76, 74, 73, 77]; 
  chart!: Chart;

  caregivers: Caregiver[] = []; // Array para cuidadores
  expandedCaregiver: string | null = null; // Control de expansión

  @ViewChild('temperatureChart', { static: true }) private temperatureChartRef!: ElementRef;
  @ViewChild('pulseChart', { static: true }) private pulseChartRef!: ElementRef;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadMockCaregivers(); // Carga cuidadores simulados
    this.formattedDate = this.formatDate(this.currentDate); 
  }

  ngAfterViewInit(): void {
    this.createTemperatureChart(); 
    this.createPulseChart(); 
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data.map(patient => ({
          value: patient.id,
          viewValue: patient.name      
        }));
      },
      (error) => {
        console.error('Error al cargar pacientes', error);
      }
    );
  }

  loadMockCaregivers(): void {
    this.caregivers = [
      {
        id: '1',
        name: 'Carolina Segura',
        patients: [
          {
            id: '1',
            name: 'Juan Pérez'
          },
          {
            id: '2',
            name: 'María González'
          }
        ]
      },
      {
        id: '2',
        name: 'Carla Rodríguez',
        patients: []
      }
    ];
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
              font: {
                size: 8
              },
              autoSkip: true,
              maxTicksLimit: 8 
            }
          },
          y: {
            display: true,
            beginAtZero: false,
            ticks: {
              font: {
                size: 8
              }
            },
            title: {
              display: false
            }
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
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: true,
            ticks: {
              font: {
                size: 8
              },
              autoSkip: true,
              maxTicksLimit: 8  
            }
          },
          y: {
            display: true,
            beginAtZero: false,
            ticks: {
              font: {
                size: 8
              }
            },
            title: {
              display: false
            }
          }
        }
      }
    });
  }
}
