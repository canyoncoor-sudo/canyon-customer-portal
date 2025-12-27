# Section Control Center Implementation Guide

## Overview
Each major section of the Canyon Admin Portal now has a **Control Center** - a consistent, user-friendly slide-out menu panel that provides centralized access to view options, filters, and actions for that section.

## Implemented Sections
✅ **Licensed Professionals** - Fully implemented with Control Center

## Sections Ready for Implementation
The following sections are ready to have Control Centers added:

### 1. **Projects (Jobs)**
   - Location: `/app/admin/jobs/page.tsx`
   - Features to add:
     - **View**: List view, Kanban board (by status), Timeline view
     - **Filters**: Status, Priority, Project Type, Date Range
     - **Actions**: New Project, Export to CSV, Bulk Status Update
     - **Sort**: By date, customer name, priority

### 2. **Customers**
   - Location: `/app/admin/customers/page.tsx`
   - Features to add:
     - **View**: Grid cards, List view
     - **Filters**: Active/Inactive, By City, Portal Access
     - **Actions**: New Customer, Export Contacts, Send Email
     - **Search**: By name, address, phone, email

### 3. **Documents**
   - Location: `/app/admin/documents/page.tsx`
   - Features to add:
     - **View**: By category, Recent, Templates
     - **Filters**: Document type, Date created
     - **Actions**: Upload Document, Create Template, Download All
     - **Sort**: By name, date, type

### 4. **Schedule (Calendar)**
   - Location: `/app/admin/calendar/page.tsx`
   - **Already has Schedule Controls** - Can be refactored to use the shared SectionMenu component
   - Features:
     - Display: Month/Week/Timeline views
     - Filters: All events, Professionals only, Projects, Open slots
     - Calendar: Event types, Professional colors
     - Actions: Add event, Google sync

### 5. **Dashboard**
   - Location: `/app/admin/dashboard/page.tsx`
   - Features to add:
     - **View**: Overview, Metrics, Activity Feed
     - **Filters**: Time period (Today, This Week, This Month)
     - **Actions**: Quick Add (Job, Customer, Event), Reports
     - **Widgets**: Toggle visibility of dashboard widgets

## How to Implement

### Step 1: Import the SectionMenu Component

```tsx
import SectionMenu from '../components/SectionMenu';
```

### Step 2: Add State Management

```tsx
// Menu visibility
const [showMenu, setShowMenu] = useState(false);

// Section toggles (one for each collapsible section)
const [showViewSection, setShowViewSection] = useState(false);
const [showFiltersSection, setShowFiltersSection] = useState(false);
const [showActionsSection, setShowActionsSection] = useState(false);
const [showSortSection, setShowSortSection] = useState(false);

// Your filter/view states
const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
const [filterStatus, setFilterStatus] = useState('all');
const [searchQuery, setSearchQuery] = useState('');
// ... etc
```

### Step 3: Define Menu Sections

```tsx
const menuSections = [
  {
    title: 'View',
    isOpen: showViewSection,
    onToggle: () => setShowViewSection(!showViewSection),
    content: (
      <div className="control-group">
        <div className="radio-group">
          <label className={viewMode === 'list' ? 'active' : ''}>
            <input 
              type="radio" 
              name="viewMode" 
              value="list"
              checked={viewMode === 'list'}
              onChange={(e) => setViewMode('list')}
            />
            <span>List View</span>
          </label>
          <label className={viewMode === 'grid' ? 'active' : ''}>
            <input 
              type="radio" 
              name="viewMode" 
              value="grid"
              checked={viewMode === 'grid'}
              onChange={(e) => setViewMode('grid')}
            />
            <span>Grid View</span>
          </label>
        </div>
      </div>
    )
  },
  {
    title: 'Filters',
    isOpen: showFiltersSection,
    onToggle: () => setShowFiltersSection(!showFiltersSection),
    content: (
      <>
        <div className="control-group">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </>
    )
  },
  {
    title: 'Actions',
    isOpen: showActionsSection,
    onToggle: () => setShowActionsSection(!showActionsSection),
    content: (
      <div className="control-group">
        <button 
          className="btn-menu-action"
          onClick={() => {
            setShowMenu(false);
            router.push('/admin/path/new');
          }}
        >
          + Add New Item
        </button>
      </div>
    )
  }
];
```

### Step 4: Add the Menu Components to Your JSX

```tsx
return (
  <div className="your-page-container">
    {/* Backdrop overlay */}
    {showMenu && <div className="menu-backdrop" onClick={() => setShowMenu(false)} />}
    
    {/* Control Center Menu */}
    <SectionMenu
      sectionName="Your Section Name"
      isOpen={showMenu}
      onClose={() => setShowMenu(false)}
      sections={menuSections}
    />

    {/* Page Header with Hamburger */}
    <header className="page-header">
      <div className="header-content">
        <div className="header-left">
          <button 
            className="btn-menu-hamburger"
            onClick={() => setShowMenu(!showMenu)}
            title="Control Center"
          >
            ☰
          </button>
          <h1>Your Section Title</h1>
        </div>
        <button 
          onClick={() => router.push('/path/new')}
          className="btn-primary"
        >
          + Add New
        </button>
      </div>
    </header>

    {/* Your page content */}
  </div>
);
```

### Step 5: Add CSS for Layout

The `SectionMenu.css` file already includes most styles you need. Just ensure your header supports the layout:

```css
.page-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Menu backdrop is in SectionMenu.css */
```

## Component API

### SectionMenu Props

```tsx
interface SectionMenuProps {
  sectionName: string;        // e.g., "Projects", "Customers", "Documents"
  isOpen: boolean;            // Controls menu visibility
  onClose: () => void;        // Called when user closes menu
  sections: MenuSection[];    // Array of collapsible sections
}

interface MenuSection {
  title: string;              // Section header text
  content: ReactNode;         // JSX content for the section
  isOpen: boolean;            // Is this section expanded?
  onToggle: () => void;       // Toggle function for this section
}
```

## CSS Classes Available

From `SectionMenu.css`:
- `.btn-menu-action` - Primary blue action button
- `.btn-menu-action.secondary` - Canyon rust red button
- `.btn-menu-action.tertiary` - White outlined button
- `.control-group` - Wraps form controls with spacing
- `.radio-group` - Styled radio buttons with active states
- `.checkbox-group` - Styled checkboxes
- `.menu-info` - Italic gray helper text
- `.menu-divider` - Horizontal divider line
- `.menu-color-list` / `.menu-color-item` - For displaying color swatches

## Best Practices

1. **Section Organization**: Group related controls together
   - View options (how to display data)
   - Filters (what data to show)
   - Sort options (order of data)
   - Actions (what user can do)

2. **State Management**: Keep filter state at the top level so it can be used both in the menu and in the main page logic

3. **Naming Convention**: Use `show[SectionName]Section` for section visibility toggles

4. **Close on Action**: When a menu action navigates away or performs a primary action, close the menu:
   ```tsx
   onClick={() => {
     setShowMenu(false);
     doSomething();
   }}
   ```

5. **Active States**: Use the `active` class on radio buttons to show current selection

6. **Clear Filters**: Always provide a way to reset filters back to defaults

7. **Result Counts**: Show how many items match current filters

## Example: Full Implementation

See `/app/admin/professionals/page.tsx` for a complete working example with:
- View toggling (Groups vs List)
- Trade filtering
- Search functionality
- Clear filters button
- Multiple action buttons
- Active filter banner

## Files Created

1. `/app/admin/components/SectionMenu.tsx` - Reusable menu component
2. `/app/admin/components/SectionMenu.css` - Shared menu styles
3. Updated: `/app/admin/professionals/page.tsx` - First implementation

## Next Steps

Roll out Control Centers to:
1. ✅ Licensed Professionals (DONE)
2. 🔲 Projects (Jobs)
3. 🔲 Customers  
4. 🔲 Documents
5. 🔲 Schedule (refactor existing controls)
6. 🔲 Dashboard

Each implementation will follow the same pattern, ensuring a consistent user experience across the entire Canyon Admin Portal.
