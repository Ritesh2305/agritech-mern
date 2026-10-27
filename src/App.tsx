import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { ReportGeneratorModal } from './components/ReportGeneratorModal.tsx';
import { PostmanExportModal } from './components/PostmanExportModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';

import { DashboardPage } from './pages/DashboardPage.tsx';
import { FarmsAndCropsPage } from './pages/FarmsAndCropsPage.tsx';
import { SoilHealthPage } from './pages/SoilHealthPage.tsx';
import { WeatherAndPestsPage } from './pages/WeatherAndPestsPage.tsx';
import { MarketplacePage } from './pages/MarketplacePage.tsx';
import { ConsultationsAndForumPage } from './pages/ConsultationsAndForumPage.tsx';
import { GovtSchemesAndMandiPage } from './pages/GovtSchemesAndMandiPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

import { api } from './services/api.ts';
import { Leaf, Code2, Download, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showPostmanModal, setShowPostmanModal] = useState<boolean>(false);

  // Application Data State
  const [farms, setFarms] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [soilTests, setSoilTests] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [govtSchemes, setGovtSchemes] = useState<any[]>([]);
  const [mandiPrices, setMandiPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    try {
      const [
        farmsData,
        cropsData,
        soilData,
        weatherData,
        alertsData,
        resourcesData,
        ordersData,
        consultationsData,
        forumData,
      ] = await Promise.all([
        api.getFarms(),
        api.getCrops(),
        api.getSoilTests(),
        api.getWeather(user?.region || 'Hyderabad, Telangana'),
        api.getPestAlerts(),
        api.getResources(),
        api.getMyOrders(),
        api.getConsultations(),
        api.getForumPosts(),
      ]);

      setFarms(farmsData || []);
      setCrops(cropsData || []);
      setSoilTests(soilData || []);
      setWeather(weatherData);
      setAlerts(alertsData || []);
      setResources(resourcesData || []);
      setOrders(ordersData || []);
      setConsultations(consultationsData || []);
      setForumPosts(forumData || []);
      setGovtSchemes(api.getGovtSchemes());
      setMandiPrices(api.getMandiPrices());
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-emerald-600 selection:text-white">
      {/* Top Bar following 3-Zone Contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenReport={() => setShowReportModal(true)}
        onOpenPostman={() => setShowPostmanModal(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardPage
            farms={farms}
            crops={crops}
            soilTests={soilTests}
            weather={weather}
            alerts={alerts}
            mandiPrices={mandiPrices}
            setCurrentTab={setCurrentTab}
            onOpenReport={() => setShowReportModal(true)}
            onOpenPostman={() => setShowPostmanModal(true)}
          />
        )}

        {currentTab === 'farms' && (
          <FarmsAndCropsPage
            farms={farms}
            crops={crops}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'soil' && (
          <SoilHealthPage
            farms={farms}
            soilTests={soilTests}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherAndPestsPage
            weather={weather}
            alerts={alerts}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'market' && (
          <MarketplacePage
            resources={resources}
            orders={orders}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'community' && (
          <ConsultationsAndForumPage
            consultations={consultations}
            forumPosts={forumPosts}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'schemes' && (
          <GovtSchemesAndMandiPage
            schemes={govtSchemes}
            mandiPrices={mandiPrices}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage onRefresh={loadAllData} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white">
              <Leaf className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{t.appName}</span>
            <span aria-hidden="true">·</span>
            <span>{t.appTagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPostmanModal(true)}
              className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Postman APIs</span>
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Reports</span>
            </button>
            <span>© 2026 AgriTech Open Agriculture Project</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ReportGeneratorModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        farms={farms}
        crops={crops}
        soilTests={soilTests}
      />

      <PostmanExportModal
        isOpen={showPostmanModal}
        onClose={() => setShowPostmanModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
