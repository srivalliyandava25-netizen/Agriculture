import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import { Navbar } from './components/common/Navbar.jsx';
import { Footer } from './components/common/Footer.jsx';
import { VoiceAssistant } from './components/common/VoiceAssistant.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { FeaturesPage } from './pages/FeaturesPage.jsx';
import { HelpContactPage } from './pages/HelpContactPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.jsx';

import { DashboardPage } from './pages/DashboardPage.jsx';
import { SoilAnalysisPage } from './pages/SoilAnalysisPage.jsx';
import { SoilReportsPage } from './pages/SoilReportsPage.jsx';
import { SoilReportDetailPage } from './pages/SoilReportDetailPage.jsx';
import { CropRecommendationPage } from './pages/CropRecommendationPage.jsx';
import { FertilizerAdvisoryPage } from './pages/FertilizerAdvisoryPage.jsx';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage.jsx';
import { WeatherPage } from './pages/WeatherPage.jsx';
import { CostCalculatorPage } from './pages/CostCalculatorPage.jsx';
import { MarketPricesPage } from './pages/MarketPricesPage.jsx';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage.jsx';
import { ActivityCalendarPage } from './pages/ActivityCalendarPage.jsx';
import { CommunityPage } from './pages/CommunityPage.jsx';
import { AskExpertPage } from './pages/AskExpertPage.jsx';
import { SustainableFarmingPage } from './pages/SustainableFarmingPage.jsx';
import { WaterManagementPage } from './pages/WaterManagementPage.jsx';
import { AffordableFarmingPage } from './pages/AffordableFarmingPage.jsx';
import { InsuranceAssistancePage } from './pages/InsuranceAssistancePage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-500">Authenticating...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-500">Checking credentials...</div>;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/help" element={<HelpContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/market-prices" element={<MarketPricesPage />} />
                  <Route path="/schemes" element={<GovernmentSchemesPage />} />
                  <Route path="/sustainability" element={<SustainableFarmingPage />} />
                  <Route path="/water" element={<WaterManagementPage />} />
                  <Route path="/affordable-farming" element={<AffordableFarmingPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/:postId" element={<CommunityPage />} />

                  {/* Protected Farmer Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/soil-analysis"
                    element={
                      <ProtectedRoute>
                        <SoilAnalysisPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/soil-reports"
                    element={
                      <ProtectedRoute>
                        <SoilReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/soil-reports/:id"
                    element={
                      <ProtectedRoute>
                        <SoilReportDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/crop-recommendation"
                    element={
                      <ProtectedRoute>
                        <CropRecommendationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/fertilizer-advisory"
                    element={
                      <ProtectedRoute>
                        <FertilizerAdvisoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/disease-detection"
                    element={
                      <ProtectedRoute>
                        <DiseaseDetectionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calculator"
                    element={
                      <ProtectedRoute>
                        <CostCalculatorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute>
                        <ActivityCalendarPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ask-expert"
                    element={
                      <ProtectedRoute>
                        <AskExpertPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/insurance"
                    element={
                      <ProtectedRoute>
                        <InsuranceAssistancePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Admin Console */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <VoiceAssistant />
            </div>
          </NotificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

