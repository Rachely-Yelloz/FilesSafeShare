import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

interface LogEntry {
  userName: string;
  action: string;
  createdAt: string;
  isSuccess: boolean;
  details?: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: string;
  trend?: number;
  color?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchText = signal('');
  statusFilter = signal('all');
  timeFilter = signal('week');
  loading = signal(true);
  recentLogs = signal<LogEntry[]>([]);
  public Math = Math;

  stats: StatCard[] = [
    { title: 'קבצים שהועלו', value: 0, icon: 'cloud_upload', trend: 12, color: '#DC2626' },
    { title: 'הורדות מוצלחות', value: 0, icon: 'cloud_download', trend: 8, color: '#059669' },
    { title: 'קישורים פעילים', value: 0, icon: 'link', trend: -3, color: '#7C3AED' },
    { title: 'ניסיונות כושלים', value: 0, icon: 'error_outline', trend: -15, color: '#EA580C' }
  ];

  displayedColumns = ['user', 'action', 'time', 'status', 'actions'];

  activitySummary = {
    todayActions: 0,
    weeklyGrowth: 0,
    mostActiveUser: '',
    peakHour: ''
  };

  filteredLogs = computed(() => {
    let logs = this.recentLogs();
    const search = this.searchText().toLowerCase();
    const status = this.statusFilter();
    const time = this.timeFilter();

    // Time filter
    if (time !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      switch(time) {
        case 'day': filterDate.setDate(now.getDate() - 1); break;
        case 'week': filterDate.setDate(now.getDate() - 7); break;
        case 'month': filterDate.setMonth(now.getMonth() - 1); break;
      }
      logs = logs.filter(log => new Date(log.createdAt) >= filterDate);
    }

    // Search filter
    if (search) {
      logs = logs.filter(log => log.userName.toLowerCase().includes(search) || log.action.toLowerCase().includes(search));
    }

    // Status filter
    if (status !== 'all') {
      logs = logs.filter(log => status === 'success' ? log.isSuccess : !log.isSuccess);
    }

    return logs;
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }
  logOut(): void {
    if(typeof window !== 'undefined' && localStorage) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('useremail');
    window.location.href = '/login';
    }
  }
  loadData(): void {
    this.http.get<LogEntry[]>('https://filessafeshare-1.onrender.com/api/Loges/logs').subscribe({
      next: (data) => {
        this.recentLogs.set(data);
        this.updateStats();
        this.updateActivitySummary();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading logs:', err);
        this.loading.set(false);
      }
    });
  }

  updateStats(): void {
    const logs = this.recentLogs();
    if (!logs.length) return;

    const uploads = logs.filter(log => log.action === 'uploadFile' && log.isSuccess).length;
    const downloads = logs.filter(log => log.action === 'downloadFile' && log.isSuccess).length;
    const generatedLinks = logs.filter(log => log.action === 'generate protected link' && log.isSuccess).length;
    const deletedLinks = logs.filter(log => log.action === 'delete protected link' && log.isSuccess).length;
    const activeLinks = Math.max(0, generatedLinks - deletedLinks);
    const failures = logs.filter(log => !log.isSuccess).length;

    this.stats = [
      { ...this.stats[0], value: uploads },
      { ...this.stats[1], value: downloads },
      { ...this.stats[2], value: activeLinks },
      { ...this.stats[3], value: failures }
    ];
  }

  updateActivitySummary(): void {
    const logs = this.recentLogs();
    const today = new Date(); today.setHours(0,0,0,0);

    this.activitySummary.todayActions = logs.filter(log => new Date(log.createdAt) >= today).length;

    const userCounts = logs.reduce((acc, log) => { acc[log.userName] = (acc[log.userName] || 0) + 1; return acc; }, {} as Record<string, number>);
    const mostActive = Object.entries(userCounts).sort(([,a],[,b]) => b - a)[0];
    this.activitySummary.mostActiveUser = mostActive ? mostActive[0] : 'אין נתונים';

    const hourCounts = logs.reduce((acc, log) => { const hour = new Date(log.createdAt).getHours(); acc[hour] = (acc[hour] || 0) + 1; return acc; }, {} as Record<number,number>);
    const peakHour = Object.entries(hourCounts).sort(([,a],[,b]) => b - a)[0];
    this.activitySummary.peakHour = peakHour ? `${peakHour[0]}:00` : 'אין נתונים';
  }

  exportToCSV(): void {
    const logs = this.filteredLogs();
    const csv = [
      ['משתמש','פעולה','זמן','סטטוס'],
      ...logs.map(log => [log.userName, log.action, new Date(log.createdAt).toLocaleString('he-IL'), log.isSuccess ? 'מוצלח':'כושל'])
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  refreshData(): void {
    this.loading.set(true);
    this.loadData();
  }

  getStatusColor(isSuccess: boolean): string {
    return isSuccess ? 'success-chip' : 'error-chip';
  }

  getActionIcon(action: string): string {
    const iconMap: Record<string,string> = {
      'uploadFile': 'cloud_upload',
      'downloadFile': 'cloud_download',
      'generate protected link': 'link',
      'delete protected link': 'link_off'
    };
    return iconMap[action] || 'description';
  }
}
