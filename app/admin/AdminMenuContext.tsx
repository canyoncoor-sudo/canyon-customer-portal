'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminMenuContextType {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  menuSections: any[];
  setMenuSections: (sections: any[]) => void;
  sectionName: string;
  setSectionName: (name: string) => void;
}

const AdminMenuContext = createContext<AdminMenuContextType | undefined>(undefined);

export function AdminMenuProvider({ children }: { children: ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuSections, setMenuSections] = useState<any[]>([]);
  const [sectionName, setSectionName] = useState('');

  return (
    <AdminMenuContext.Provider
      value={{
        showMenu,
        setShowMenu,
        menuSections,
        setMenuSections,
        sectionName,
        setSectionName,
      }}
    >
      {children}
    </AdminMenuContext.Provider>
  );
}

export function useAdminMenu() {
  const context = useContext(AdminMenuContext);
  if (context === undefined) {
    throw new Error('useAdminMenu must be used within AdminMenuProvider');
  }
  return context;
}
