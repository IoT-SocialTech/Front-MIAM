import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

interface Alert {
  date: string;
  hour: string;
  patient: string;
  alertType: string;
  description: string;
  caregiver: string;
  actions: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'hour', 'patient', 'alertType', 'description', 'caregiver', 'actions'];
  alerts = new MatTableDataSource<Alert>(); // Inicializamos con un tipo vacío

  constructor() {}

  ngOnInit(): void {
    // Datos de ejemplo para mostrar en la tabla
    const exampleAlerts: Alert[] = [
      {
        date: '2024-09-24',
        hour: '09:49 AM',
        patient: 'María Carrillo',
        alertType: 'High risk of falling',
        description: 'Increased risk of falling',
        caregiver: 'Carolina Suarez',
        actions: 'Monitored'
      },
      {
        date: '2024-09-24',
        hour: '09:49 AM',
        patient: 'José Díaz',
        alertType: 'High temperature',
        description: 'Current temperature: 38.5°C',
        caregiver: 'Carolina Suarez',
        actions: 'Monitored'
      }
    ];

    // Pasamos los datos de ejemplo a la tabla
    this.alerts.data = exampleAlerts;
  }

  // Método para descargar el reporte (simulación)
  downloadReport(): void {
    alert('Downloading report...');
    // Aquí puedes agregar la lógica para descargar el reporte en formato deseado
  }
}
