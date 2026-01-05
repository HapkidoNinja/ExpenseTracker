# Export Feature - User Guide

> **Related Technical Documentation:** [Developer Documentation](../dev/export.md)

## Overview

The Export feature allows you to export your expense data in multiple formats and share it with various cloud services. You can create one-time exports, schedule recurring exports, and generate shareable links.

## Quick Start

### Exporting to CSV (Fastest Method)

1. Navigate to **Expenses** page
2. Click the **Export CSV** button
3. A CSV file will automatically download to your computer

### Using the Export Hub

1. Navigate to the **Dashboard**
2. Click the **Export Hub** button in the top-right area
3. Choose from five tabs: Integrations, Templates, History, Schedule, or Share

---

## Export Hub Features

### 1. Integrations Tab

Connect your expense tracker to popular cloud services for seamless data export.

**Available Integrations:**

| Service | Description |
|---------|-------------|
| 📊 Google Sheets | Sync expenses to a spreadsheet |
| 📦 Dropbox | Save exports to cloud storage |
| ☁️ OneDrive | Backup to Microsoft cloud |
| 📧 Email | Send exports directly to email |
| 📝 Notion | Create expense databases |
| 🗃️ Airtable | Integrate with workflows |

**How to Connect:**

1. Open the **Export Hub**
2. Go to the **Integrations** tab (🔌)
3. Click **Connect** on the service you want to use
4. Wait for the connection to complete
5. The service will show as "Connected" with a green badge

**How to Disconnect:**

1. Find the connected service
2. Click **Disconnect**
3. The service will return to disconnected state

---

### 2. Templates Tab

Choose from pre-configured export templates designed for different use cases.

**Available Templates:**

#### Full Export
- **Best for:** Complete data backup
- **Includes:** All expense records with full details
- **Fields:** Date, Category, Amount, Description, Created At

#### Tax Report
- **Best for:** Tax filing and deduction documentation
- **Includes:** Last 12 months of expenses
- **Fields:** Date, Category, Amount, Description, Tax Category

#### Monthly Summary
- **Best for:** Budget reviews and monthly planning
- **Includes:** Current month data aggregated by category
- **Fields:** Category, Total Amount, Transaction Count, Average

#### Category Analysis
- **Best for:** Understanding spending patterns
- **Includes:** Last 3 months with trend analysis
- **Fields:** Category, Amount, Percentage, Trend

#### Weekly Digest
- **Best for:** Quick weekly check-ins
- **Includes:** Last 7 days summary
- **Fields:** Day, Total Spent, Top Category, Transaction Count

**How to Export Using Templates:**

1. Open the **Export Hub**
2. Go to the **Templates** tab (📋)
3. Click on your desired template
4. Select a destination (only connected services are shown)
5. Click **Export [X] Records**
6. Wait for the export to complete
7. Check the **History** tab for status

---

### 3. History Tab

View all your past exports with their status and details.

**Information Shown:**

- Template used
- Destination service
- Timestamp
- Number of records exported
- File size estimate
- Status (Done ✓, Failed ✕, or Processing ⟳)

**How to Use:**

1. Open the **Export Hub**
2. Go to the **History** tab (📜)
3. Scroll through your export history
4. Click **Clear History** to remove all records

> **Note:** History is limited to the last 50 exports.

---

### 4. Schedule Tab

Set up automatic recurring exports to keep your data regularly backed up.

**Available Frequencies:**

- **Daily** - Exports every day
- **Weekly** - Exports every week
- **Monthly** - Exports on the first of each month

**How to Create a Schedule:**

1. Open the **Export Hub**
2. Go to the **Schedule** tab (⏰)
3. Click **+ New Schedule**
4. Select a template from the dropdown
5. Choose a destination (must be connected first)
6. Select the frequency
7. Click **Create Schedule**

**Managing Schedules:**

- **Enable/Disable:** Use the toggle switch next to each schedule
- **Delete:** Click the **Delete** button to remove a schedule

**Schedule Information:**

- Template name and destination
- Frequency (Daily, Weekly, Monthly)
- Next scheduled run time

---

### 5. Share Tab

Generate shareable links with optional password protection for your expense data.

**Features:**

- Time-limited access (1, 7, 30, or 90 days)
- View limits (1, 5, 10, 100, or unlimited views)
- Optional password protection
- QR code for easy mobile access

**How to Create a Shareable Link:**

1. Open the **Export Hub**
2. Go to the **Share** tab (🔗)
3. Select a template (Full Export, Tax Report, or Monthly Summary)
4. Set expiration time
5. Set maximum number of views
6. (Optional) Enter a password for protection
7. Click **Generate Share Link**
8. Copy the link or scan the QR code

**Sharing Options:**

| Setting | Options |
|---------|---------|
| Expiration | 1 day, 7 days, 30 days, 90 days |
| Max Views | 1, 5, 10, 100, Unlimited |
| Password | Optional text password |

---

## CSV Export Details

When you export to CSV, the file includes:

| Column | Description |
|--------|-------------|
| Date | The date of the expense |
| Category | Category name (e.g., Food, Transport) |
| Description | Your expense description |
| Amount | Expense amount in currency |

**File Naming:**
- Format: `expenses-YYYY-MM-DD.csv`
- Example: `expenses-2026-01-04.csv`

**Opening the File:**
- Microsoft Excel
- Google Sheets
- Apple Numbers
- Any text editor

---

## Tips and Best Practices

### For Regular Backups
1. Connect Google Sheets or Dropbox
2. Create a **Weekly** schedule with **Full Export** template
3. Your data will be automatically backed up every week

### For Tax Season
1. Use the **Tax Report** template
2. Export to your preferred destination
3. The report includes the last 12 months automatically

### For Budget Reviews
1. Export **Monthly Summary** at the end of each month
2. Use the category breakdown to identify spending patterns

### For Sharing with Others
1. Use the **Share** tab
2. Set appropriate expiration and view limits
3. Add a password if sharing sensitive data
4. Send the link or QR code to the recipient

---

## Troubleshooting

### Export Failed

**Possible causes:**
- Temporary connection issue
- Browser storage full

**Solutions:**
1. Try the export again
2. Clear your browser cache
3. Check if the integration is still connected

### Can't See Connected Services as Destinations

**Solution:**
1. Go to the **Integrations** tab
2. Make sure the service shows "Connected"
3. If not, click **Connect** and wait for completion

### Export History Not Showing

**Possible causes:**
- Browser data was cleared
- Different browser or device

**Solution:**
- Export history is stored locally in your browser
- Use the same browser to see your history

### QR Code Not Loading

**Possible causes:**
- Network connectivity issues

**Solutions:**
1. Check your internet connection
2. Try generating the link again

---

## Frequently Asked Questions

**Q: Where is my data stored?**
A: All export data is stored locally in your browser. Cloud integrations send data to the respective services when you export.

**Q: Can I export specific date ranges?**
A: Yes, templates have pre-configured date ranges. Use **Tax Report** for 12 months, **Monthly Summary** for current month, or **Weekly Digest** for 7 days.

**Q: How many exports can I track in history?**
A: The last 50 exports are saved in your history.

**Q: Are my cloud connections secure?**
A: Connection states are stored locally in your browser. For production use, OAuth authentication would be implemented.

**Q: Can I cancel a scheduled export?**
A: Yes, use the toggle to disable a schedule, or click Delete to remove it completely.

**Q: How long do shareable links last?**
A: You choose the duration when creating the link: 1, 7, 30, or 90 days.

---

## Related Documentation

- [Technical Documentation](../dev/export.md) - For developers
- [README](../../README.md) - Project overview
