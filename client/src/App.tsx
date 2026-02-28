import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Skills from "./pages/Skills";
import Contexts from "./pages/Contexts";
import Playgrounds from "./pages/Playgrounds";
import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";
import Docs from "./pages/Docs";
import SkillDetail from "./pages/SkillDetail";
import Models from "./pages/Models";
import Datasets from "./pages/Datasets";
import Tasks from "./pages/Tasks";
import Organizations from "./pages/Organizations";
import Collections from "./pages/Collections";
import Languages from "./pages/Languages";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import ComingSoon from "./pages/ComingSoon";
import Deps from "./pages/Deps";
import DepsCreate from "./pages/DepsCreate";
import DepsDetail from "./pages/DepsDetail";
import Profile from "./pages/Profile";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/skills" component={Skills} />
      <Route path="/skills/:author/:name" component={SkillDetail} />
      <Route path="/contexts" component={Contexts} />
      <Route path="/contexts/:author/:name" component={ComingSoon} />
      <Route path="/playgrounds" component={Playgrounds} />
      <Route path="/playgrounds/:author/:name" component={ComingSoon} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/docs" component={Docs} />
      <Route path="/docs/:slug" component={Docs} />
      <Route path="/deps" component={Deps} />
      <Route path="/deps/create" component={DepsCreate} />
      <Route path="/deps/:author/:slug" component={DepsDetail} />
      <Route path="/models" component={Models} />
      <Route path="/models/:author/:name" component={ComingSoon} />
      <Route path="/datasets" component={Datasets} />
      <Route path="/datasets/:author/:name" component={ComingSoon} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:id" component={ComingSoon} />
      <Route path="/languages" component={Languages} />
      <Route path="/organizations" component={Organizations} />
      <Route path="/organizations/:handle" component={ComingSoon} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={ComingSoon} />
      <Route path="/posts" component={Community} />
      <Route path="/learn" component={Community} />
      <Route path="/forum" component={Community} />
      <Route path="/community/:section" component={ComingSoon} />
      <Route path="/profile" component={Profile} />
      <Route path="/skills/new" component={ComingSoon} />
      <Route path="/contexts/new" component={ComingSoon} />
      <Route path="/playgrounds/new" component={ComingSoon} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
