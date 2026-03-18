import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LabPage from './pages/LabPage';
import VdeskPage from './pages/VdeskPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DesignSystemPage from './pages/DesignSystemPage';
import ComponentsPage from './pages/ComponentsPage';
import IconSystemPage from './pages/IconSystemPage';
import PortalSectionsPage from './pages/PortalSectionsPage';
import GetQuotePage from './pages/GetQuotePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import DocPage from './pages/DocPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/vdesk" element={<VdeskPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/icon-system" element={<IconSystemPage />} />
        <Route path="/portal-sections" element={<PortalSectionsPage />} />
        <Route path="/doc" element={<DocPage />} />
        <Route path="/get-quote" element={<GetQuotePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
