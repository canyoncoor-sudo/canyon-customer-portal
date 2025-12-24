# Schedule Menu System Implementation Plan

## Overview
Comprehensive menu system for the Schedule page focusing on planning time and resources.

## Menu Structure

### 1. View Controls
- **Month View** (default) - Current calendar grid
- **Week View** - 7-day horizontal view
- **Timeline/Multi-Day View** - Gantt-style for long jobs
- **Display Density**:
  - Compact (minimal info)
  - Extended (full details)

### 2. Filters
- Filter by Licensed Professional (multi-select dropdown)
- Filter by Project (multi-select dropdown)
- Show Only Active Jobs (toggle)
- Hide Completed Jobs (toggle)

### 3. Display Toggles
- Show Contractor Names
- Show Job Duration
- Multi-Day Bars
- Show Overlaps & Conflicts (highlight)

### 4. Color Rules
Replaces manual color palette with intelligent coloring:
- **Color by Licensed Professional** - Each professional gets consistent color
- **Color by Project** - Project-based colors
- **Color by Job Status** - Active/Pending/Completed colors

Assigned colors stored in `subcontractors` table and reused consistently.

### 5. Navigation & Jump Controls
- Jump to Today
- Jump to Next Available Slot
- Jump to Next Project Start

### 6. Utilities
- Export Schedule (PDF/CSV)
- Print Schedule
- Google Calendar Sync

## Multi-Day Scheduling Features

### Job Representation
- **Multi-day jobs**: Continuous bar across multiple days
- **Single-day tasks**: Appear only in that day
- **Day-specific assignments**: Each day shows assigned contractor
- **Flexible assignments**: Different professionals on different days

### Data Structure
```json
{
  "event_id": "uuid",
  "title": "Foundation Work - 123 Main St",
  "start_date": "2025-01-15",
  "end_date": "2025-01-18",
  "duration_days": 4,
  "day_assignments": [
    { "date": "2025-01-15", "professional_id": "uuid-1", "professional_name": "ABC Excavation" },
    { "date": "2025-01-16", "professional_id": "uuid-1", "professional_name": "ABC Excavation" },
    { "date": "2025-01-17", "professional_id": "uuid-2", "professional_name": "XYZ Concrete" },
    { "date": "2025-01-18", "professional_id": "uuid-2", "professional_name": "XYZ Concrete" }
  ]
}
```

## Database Schema Changes

### calendar_events table additions:
```sql
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS assigned_professional_id UUID REFERENCES subcontractors(id),
ADD COLUMN IF NOT EXISTS day_assignments JSONB,
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES portal_jobs(id);
```

### subcontractors table additions:
```sql
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS assigned_color VARCHAR(7) DEFAULT '#567A8D';
```

## UI Components

### Menu Button
- Hamburger icon (☰) in header
- Positioned left of "Schedule" title
- Opens slide-out panel

### Menu Panel
- Slides from left
- 320px wide
- Grouped sections with collapsible headers
- Smooth animations
- Overlay backdrop

### Section Layout
1. **View Controls** - Radio buttons
2. **Filters** - Multi-select dropdowns + toggles
3. **Display Toggles** - Switch components
4. **Color Rules** - Radio buttons
5. **Navigation** - Quick action buttons
6. **Utilities** - Action buttons

## Implementation Steps

1. **Phase 1: Menu UI**
   - Create menu button and panel
   - Add all sections with controls
   - Wire up state management

2. **Phase 2: View Modes**
   - Implement Week View
   - Implement Timeline View
   - Add compact/extended toggle

3. **Phase 3: Filters**
   - Fetch professionals and projects
   - Implement multi-select filtering
   - Add active/completed toggles

4. **Phase 4: Display Toggles**
   - Show/hide contractor names
   - Show/hide job duration
   - Multi-day bar rendering
   - Conflict detection

5. **Phase 5: Color Rules**
   - Professional color assignment
   - Project-based coloring
   - Status-based coloring
   - Save color preferences

6. **Phase 6: Multi-Day Scheduling**
   - Update database schema
   - Continuous bar rendering
   - Day-specific professional display
   - Drag-and-drop for multi-day jobs

7. **Phase 7: Navigation**
   - Jump to today
   - Find next available slot
   - Jump to next project

8. **Phase 8: Utilities**
   - PDF export
   - CSV export
   - Print functionality
   - Move Google Calendar sync here

## File Changes

- `/app/admin/calendar/page.tsx` - Add menu and new features
- `/app/admin/calendar/calendar.css` - Add menu styles
- `/app/api/admin/calendar/events/route.ts` - Support new fields
- `/app/api/admin/calendar/professionals/route.ts` - NEW: Fetch professionals with colors
- `/app/api/admin/calendar/export/route.ts` - NEW: PDF/CSV export

## SQL Migration File

Create: `/update_calendar_schema.sql`

## Core Principles

✅ **Planning Time & Resources** - All features support scheduling
✅ **No Settings** - Configuration stays in menu, not main toolbar
✅ **No Analytics** - Reporting belongs elsewhere
✅ **Clean Interface** - Everything hidden until menu opened

## Success Criteria

- [x] Menu system implemented with all sections
- [x] Multi-day jobs render as continuous bars
- [x] Each professional has consistent color
- [x] Week and timeline views functional
- [x] Filters work correctly
- [x] Export to PDF/CSV works
- [x] Google Calendar moved to utilities
- [x] Main toolbar stays clean
