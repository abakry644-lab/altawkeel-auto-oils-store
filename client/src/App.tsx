import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoreShell from "@/components/store/StoreShell";
import BrandLoadingScreen from "@/components/store/BrandLoadingScreen";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminProducts from "./pages/AdminProducts";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";

const isGitHubPages = import.meta.env.VITE_GITHUB_PAGES === "true";

function StoreRouter() {
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter
      base={isGitHubPages ? "" : import.meta.env.BASE_URL}
      hook={isGitHubPages ? useHashLocation : undefined}
    >
      <Switch>
        <Route path="/admin" component={AdminProducts} />
        <Route>
          <StoreShell>
            <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/shop"} component={Shop} />
          <Route path={"/products/:handle"}>
            {params => <ProductDetail handle={params.handle} />}
          </Route>
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
            </Switch>
          </StoreShell>
        </Route>
      </Switch>
    </WouterRouter>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <BrandLoadingScreen />
          <StoreRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
