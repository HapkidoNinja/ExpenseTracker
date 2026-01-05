# Export Feature - Technical Documentation

> **Feature Type:** Frontend (Client-side implementation)
> **Related User Documentation:** [User Guide](../user/export.md)

## Overview

The Export feature provides comprehensive data export capabilities for the Expense Tracker application. It includes a cloud-integrated Export Hub modal with multiple export destinations, scheduled exports, shareable links, and direct CSV downloads.

## Architecture

### Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16.1.1 |
| Language | TypeScript |
| State Management | React Context + useState |
| Persistence | LocalStorage |
| Styling | Inline styles with CSS-in-JS patterns |

### Component Structure

```
ExportHub (Main Modal)
├── IntegrationsPanel
│   └── Integration cards with Connect/Disconnect buttons
├── TemplatesPanel
│   ├── Template selection (3-column grid)
│   └── Destination selection
├── HistoryPanel
│   └── Recent exports list with status indicators
├── SchedulePanel
│   ├── Schedule creation form
│   └── Active schedules list
└── SharePanel
    ├── Template and options selection
    └── Share link + QR code display
```

## File Structure

### Primary Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/components/export/ExportHub.tsx` | Main modal component with 5 tab panels | ~849 |
| `src/services/cloudExport.ts` | Export business logic, types, and service class | ~519 |
| `src/lib/utils.ts` | CSV generation and download utilities | ~200 |

### Integration Points

| File | Integration |
|------|-------------|
| `src/components/dashboard/Dashboard.tsx` | "Export Hub" button, modal state management |
| `src/components/expenses/ExpenseList.tsx` | "Export CSV" quick download button |
| `src/context/ExpenseContext.tsx` | Expense data provider |

## Type Definitions

### Integration Types

```typescript
type IntegrationType =
  | 'google-sheets'
  | 'dropbox'
  | 'onedrive'
  | 'email'
  | 'notion'
  | 'airtable';
```

### Export Template Types

```typescript
type ExportTemplateType =
  | 'full-export'
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'weekly-digest';
```

### Core Interfaces

```typescript
interface CloudIntegration {
  id: IntegrationType;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: string;
  description: string;
}

interface ExportTemplate {
  id: ExportTemplateType;
  name: string;
  description: string;
  icon: string;
  fields: string[];
  filters?: {
    dateRange?: 'week' | 'month' | 'quarter' | 'year' | 'all';
    categories?: string[];
  };
}

interface ExportHistoryItem {
  id: string;
  timestamp: string;
  template: ExportTemplateType;
  destination: IntegrationType | 'download' | 'share-link';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordCount: number;
  fileSize?: string;
  shareLink?: string;
  error?: string;
}

interface ScheduledExport {
  id: string;
  template: ExportTemplateType;
  destination: IntegrationType;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: string;
  enabled: boolean;
  createdAt: string;
}

interface ShareableExport {
  id: string;
  link: string;
  qrCode: string;
  expiresAt: string;
  accessCount: number;
  maxAccess: number;
  password?: string;
}
```

## Service Layer

### CloudExportService Class

Location: `src/services/cloudExport.ts`

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getIntegrations()` | - | `CloudIntegration[]` | Fetches integration states from localStorage |
| `toggleIntegration(id)` | `IntegrationType` | `Promise<boolean>` | Connects/disconnects a cloud service |
| `exportToCloud(expenses, template, destination)` | `Expense[], ExportTemplateType, IntegrationType` | `Promise<ExportHistoryItem>` | Sends export to cloud integration |
| `exportViaEmail(expenses, template, email)` | `Expense[], ExportTemplateType, string` | `Promise<ExportHistoryItem>` | Sends export via email |
| `createShareableLink(expenses, template, options)` | `Expense[], ExportTemplateType, ShareOptions` | `Promise<ShareableExport>` | Generates shareable link with QR code |
| `getExportHistory()` | - | `ExportHistoryItem[]` | Returns export history (max 50 items) |
| `createSchedule(template, destination, frequency)` | `ExportTemplateType, IntegrationType, Frequency` | `ScheduledExport` | Creates recurring export schedule |
| `toggleSchedule(id)` | `string` | `void` | Enables/disables a schedule |
| `deleteSchedule(id)` | `string` | `void` | Removes a schedule |
| `generateExportData(expenses, template)` | `Expense[], ExportTemplateType` | `string` | Formats export data as JSON |

### CSV Utilities

Location: `src/lib/utils.ts`

```typescript
// Generate CSV string from expenses
function exportToCSV(expenses: Expense[]): string

// Trigger browser download of CSV file
function downloadCSV(expenses: Expense[], filename?: string): void
```

## Storage Schema

### LocalStorage Keys

| Key | Data Type | Max Items | Description |
|-----|-----------|-----------|-------------|
| `expense-tracker-integrations` | `CloudIntegration[]` | 6 | Integration connection states |
| `expense-tracker-export-history` | `ExportHistoryItem[]` | 50 | Export records |
| `expense-tracker-scheduled-exports` | `ScheduledExport[]` | - | Recurring schedules |
| `expense-tracker-shares` | `ShareableExport[]` | 20 | Shareable link data |

## Export Templates

### Full Export
- **Fields:** Date, Category, Amount, Description, Created At
- **Date Range:** All records
- **Use Case:** Complete data backup

### Tax Report
- **Fields:** Date, Category, Amount, Description, Tax Category
- **Date Range:** Last 12 months
- **Use Case:** Tax filing documentation

### Monthly Summary
- **Fields:** Category, Total Amount, Transaction Count, Average
- **Date Range:** Current month
- **Use Case:** Monthly budget reviews

### Category Analysis
- **Fields:** Category, Amount, Percentage, Trend
- **Date Range:** Last 3 months
- **Use Case:** Spending behavior analysis

### Weekly Digest
- **Fields:** Day, Total Spent, Top Category, Transaction Count
- **Date Range:** Last 7 days
- **Use Case:** Quick weekly reviews

## Cloud Integrations

| Integration | Icon | Color | Description |
|-------------|------|-------|-------------|
| Google Sheets | `📊` | `#34A853` | Spreadsheet sync |
| Dropbox | `📦` | `#0061FF` | Cloud storage |
| OneDrive | `☁️` | `#0078D4` | Microsoft backup |
| Email | `📧` | `#EA4335` | Direct send (always enabled) |
| Notion | `📝` | `#000000` | Database creation |
| Airtable | `🗃️` | `#18BFFF` | Workflow sync |

## Data Flow

### Export Flow

```
useExpenses() Context
        ↓
    expenses array
        ↓
  ExportHub Component
        ↓
  CloudExportService
        ↓
     localStorage
        ↓
   History Update
```

### CSV Download Flow

```
ExpenseList Component
        ↓
  "Export CSV" Click
        ↓
    downloadCSV()
        ↓
    exportToCSV()
        ↓
    Create Blob
        ↓
  Browser Download
```

## State Management

### Component State (ExportHub.tsx)

```typescript
const [activeTab, setActiveTab] = useState<TabType>('integrations');
const [integrations, setIntegrations] = useState<CloudIntegration[]>([]);
const [history, setHistory] = useState<ExportHistoryItem[]>([]);
const [schedules, setSchedules] = useState<ScheduledExport[]>([]);
const [isProcessing, setIsProcessing] = useState(false);
const [connectingId, setConnectingId] = useState<string | null>(null);
const [notification, setNotification] = useState<NotificationState | null>(null);
```

## Simulated Operations

The current implementation simulates cloud operations for development:

| Operation | Delay | Success Rate |
|-----------|-------|--------------|
| Integration toggle | 1,500ms | 100% |
| Cloud export | 2,000ms | 90% |
| Email export | 1,500ms | 100% |
| Share link generation | 1,000ms | 100% |

## File Size Calculation

```typescript
function calculateFileSize(recordCount: number): string {
  const avgBytesPerRecord = 150;
  const bytes = recordCount * avgBytesPerRecord;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

## Error Handling

- Try-catch blocks wrap localStorage operations
- 90% success rate simulation for cloud exports (10% failures for realistic testing)
- Error messages stored in export history
- Fallback values for missing data
- Toast notifications for operation feedback

## UI Components

### Tab Navigation

| Tab | Icon | Purpose |
|-----|------|---------|
| Integrations | `🔌` | Cloud service connections |
| Templates | `📋` | Export format selection |
| History | `📜` | Recent export records |
| Schedule | `⏰` | Recurring export automation |
| Share | `🔗` | Shareable link generation |

### Notification System

- Toast-style notifications
- 4-second auto-dismiss
- Success (green) and Error (red) variants
- Positioned at top of modal

## Browser Compatibility

**Requirements:**
- LocalStorage API
- Blob API
- URL.createObjectURL()

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Backend Implementation

To implement real cloud integrations, the following would be needed:

1. **API Routes:**
   - `/api/export/cloud` - Cloud service exports
   - `/api/export/email` - Email delivery
   - `/api/share/[token]` - Share link validation

2. **Services:**
   - OAuth token management for each provider
   - Email delivery service (SendGrid, SES, etc.)
   - QR code generation service
   - Job queue for scheduled exports

3. **Database:**
   - Export history table
   - Scheduled exports table
   - Share links table with access tracking

4. **Authentication:**
   - User accounts
   - OAuth flows for cloud providers
   - API key management

## Testing Considerations

- Mock the CloudExportService for unit tests
- Test localStorage operations with in-memory storage
- Verify CSV output format
- Test all export templates
- Verify schedule calculation logic
- Test notification display and dismissal

## Performance Notes

- Export history capped at 50 items to limit storage
- Share links capped at 20 items
- Memoized calculations in context (useMemo)
- No unnecessary re-renders with proper state management

## Related Documentation

- [User Guide: Export Feature](../user/export.md)
- [README](../../README.md)
