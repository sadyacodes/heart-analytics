import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import PredictionHistoryPage from './pages/PredictionHistoryPage';
import ReportsPage from './pages/ReportsPage';
import HealthAnalyticsPage from './pages/HealthAnalyticsPage';
import RecommendationsPage from './pages/RecommendationsPage';

const queryClient = new QueryClient();

// Layout component with sidebar
function Layout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <main className="flex-1 p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: Layout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const predictionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prediction-history',
  component: PredictionHistoryPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const healthAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health-analytics',
  component: HealthAnalyticsPage,
});

const recommendationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recommendations',
  component: RecommendationsPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  predictionHistoryRoute,
  reportsRoute,
  healthAnalyticsRoute,
  recommendationsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
