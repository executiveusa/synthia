import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import SkillsMarketplace from "./pages/SkillsMarketplace";
import AdminDashboard from "./pages/AdminDashboard";
import Onboarding from "./pages/Onboarding";
import OnboardingPairing from "./pages/OnboardingPairing";
import OnboardingSuccess from "./pages/OnboardingSuccess";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/skills"} component={SkillsMarketplace} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/control"} component={AdminDashboard} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/onboarding/pairing/:clientId"} component={OnboardingPairing} />
      <Route path={"/onboarding/success"} component={OnboardingSuccess} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
