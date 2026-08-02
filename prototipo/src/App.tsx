import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ListingDetail from "./pages/ListingDetail";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import SellerProfile from "./pages/SellerProfile";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";
import MyOrders from "./pages/MyOrders";
import MyPayments from "./pages/MyPayments";
import Checkout from "./pages/Checkout";
import PaymentReceipt from "./pages/PaymentReceipt";
import BoostListing from "./pages/BoostListing";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import Plans from "./pages/Plans";
import HowItWorks from "./pages/HowItWorks";
import Help from "./pages/Help";
import LegalDocument from "./pages/LegalDocument";
import PrivacyCenter from "./pages/PrivacyCenter";
import SellerTaxes from "./pages/SellerTaxes";
import BusinessPlan from "./pages/BusinessPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

/**
 * HandMade 5.0 — árvore de rotas.
 *
 * Mudanças em relação à 4.0:
 * - /carteira foi removida (B3), dando lugar a /meus-pagamentos, /pagamento/:id
 *   e /pagamento/recibo/:id.
 * - O impulsionamento ganhou rota própria, /impulsionar/:id (B2).
 * - Termos, Política de Privacidade, Central de Privacidade e guia de tributos
 *   passaram a ser telas do produto (L1 e L2).
 * - Um ErrorBoundary envolve a aplicação: qualquer falha inesperada mostra tela
 *   de recuperação em lugar de tela branca.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <BrowserRouter>
          <AuthProvider>
            <ErrorBoundary>
              <ScrollToTop />
              <Toaster />
              <Sonner position="top-center" closeButton richColors />
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/criar-anuncio" element={<CreateListing />} />
                  <Route path="/editar-anuncio/:id" element={<EditListing />} />
                  <Route path="/anuncio/:id" element={<ListingDetail />} />
                  <Route path="/impulsionar/:id" element={<BoostListing />} />
                  <Route path="/pagamento/:id" element={<Checkout />} />
                  <Route path="/pagamento/recibo/:id" element={<PaymentReceipt />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/chat/:conversationId" element={<Chat />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/vendedor/:email" element={<SellerProfile />} />
                  <Route path="/perfil/editar" element={<EditProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/meus-anuncios" element={<MyListings />} />
                  <Route path="/meus-pedidos" element={<MyOrders />} />
                  <Route path="/meus-pagamentos" element={<MyPayments />} />
                  <Route path="/favoritos" element={<Favorites />} />
                  <Route path="/notificacoes" element={<Notifications />} />
                  <Route path="/planos" element={<Plans />} />
                  <Route path="/como-funciona" element={<HowItWorks />} />
                  <Route path="/ajuda" element={<Help />} />
                  <Route path="/termos" element={<LegalDocument document="terms" />} />
                  <Route
                    path="/politica-de-privacidade"
                    element={<LegalDocument document="privacy" />}
                  />
                  <Route path="/privacidade" element={<PrivacyCenter />} />
                  <Route path="/tributos" element={<SellerTaxes />} />
                  <Route path="/plano-de-negocio" element={<BusinessPlan />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/bem-vindo" element={<Welcome />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
