import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SessionSetup } from './pages/SessionSetup';
import { ProductForm } from './pages/ProductForm';
import { SessionReview } from './pages/SessionReview';
import { PresentationMode } from './pages/PresentationMode';
import { ExportPage } from './pages/ExportPage';
import { Header } from './components/layout/Header';

function Layout({ children }) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/session/new" element={<Layout><SessionSetup /></Layout>} />
        <Route path="/session/:sessionId/product/:productId" element={<ProductForm />} />
        <Route path="/session/:sessionId/review" element={<SessionReview />} />
        <Route path="/session/:sessionId/present" element={<PresentationMode />} />
        <Route path="/session/:sessionId/export" element={<ExportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
