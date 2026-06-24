"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, Languages, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "km" : "en";
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-semibold lg:hidden text-primary">My Work</h2>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 p-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title={t("common.language")}
        >
          <Languages className="w-5 h-5" />
          <span className="hidden sm:inline-block uppercase">{i18n.language}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title={t("common.theme")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium hidden md:inline-block">Admin</span>
          </button>
          
          {/* Dropdown - Simple CSS hover for now */}
          <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg py-1 hidden group-hover:block z-50">
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("common.profile")}
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              {t("common.logout")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
