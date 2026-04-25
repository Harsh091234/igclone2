import { Switch } from "../../components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../utils/ThemeProvider";

const SwitchAppearancePage = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="h-screen px-4 sm:px-8 py-6 bg-background">
      
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          Switch Appearance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how Instagram looks for you
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-2xl">
        <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl border border-border bg-card">
          
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4">
            
            {/* ICON WRAPPER */}
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-muted">
              {isDark ? (
                <Moon className="w-5 h-5 text-yellow-400" />
              ) : (
                <Sun className="w-5 h-5 text-orange-400" />
              )}
            </div>

            {/* TEXT */}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">
                {isDark ? "Dark Mode" : "Light Mode"}
              </p>

              <p className="text-xs text-muted-foreground">
                Current: {theme}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE TOGGLE */}
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => {
              setTheme(checked ? "dark" : "light");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SwitchAppearancePage;