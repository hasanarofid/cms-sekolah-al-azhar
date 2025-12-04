import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './routes/HomePage'
import DynamicPage from './routes/DynamicPage'
import PostPage from './routes/PostPage'
import ContactPage from './routes/ContactPage'
import LoginPage from './routes/LoginPage'
import DashboardPage from './routes/admin/DashboardPage'
import SlidersPage from './routes/admin/SlidersPage'
import SliderNewPage from './routes/admin/SliderNewPage'
import SliderEditPage from './routes/admin/SliderEditPage'
import HomeSectionsPage from './routes/admin/HomeSectionsPage'
import HomeSectionNewPage from './routes/admin/HomeSectionNewPage'
import HomeSectionEditPage from './routes/admin/HomeSectionEditPage'
import FAQsPage from './routes/admin/FAQsPage'
import FAQNewPage from './routes/admin/FAQNewPage'
import FAQEditPage from './routes/admin/FAQEditPage'
import SplitScreensPage from './routes/admin/SplitScreensPage'
import FiguresPage from './routes/admin/FiguresPage'
import PartnershipsPage from './routes/admin/PartnershipsPage'
import PagesPage from './routes/admin/PagesPage'
import PageEditPage from './routes/admin/PageEditPage'
import PageNewPage from './routes/admin/PageNewPage'
import PageHeroPage from './routes/admin/PageHeroPage'
import PageSectionPage from './routes/admin/PageSectionPage'
import PostsPage from './routes/admin/PostsPage'
import PostNewPage from './routes/admin/PostNewPage'
import PostEditPage from './routes/admin/PostEditPage'
import ContactsPage from './routes/admin/ContactsPage'
import MenusPage from './routes/admin/MenusPage'
import MenuEditPage from './routes/admin/MenuEditPage'
import MenuNewPage from './routes/admin/MenuNewPage'
import CategoriesPage from './routes/admin/CategoriesPage'
import SettingsPage from './routes/admin/SettingsPage'
import SEOPage from './routes/admin/SEOPage'
import PlaceholderPage from './routes/admin/PlaceholderPage'
import NotFound from './routes/NotFound'
import NotFoundPage from './routes/NotFoundPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/berita/:slug" element={<PostPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/:slug" element={<DynamicPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/sliders" element={<SlidersPage />} />
        <Route path="/admin/sliders/new" element={<SliderNewPage />} />
        <Route path="/admin/sliders/:id" element={<SliderEditPage />} />
        <Route path="/admin/home-sections" element={<HomeSectionsPage />} />
        <Route path="/admin/home-sections/new" element={<HomeSectionNewPage />} />
        <Route path="/admin/home-sections/:id" element={<HomeSectionEditPage />} />
        <Route path="/admin/faqs" element={<FAQsPage />} />
        <Route path="/admin/faqs/new" element={<FAQNewPage />} />
        <Route path="/admin/faqs/:id" element={<FAQEditPage />} />
        <Route path="/admin/figures" element={<FiguresPage />} />
        <Route path="/admin/partnerships" element={<PartnershipsPage />} />
        <Route path="/admin/pages" element={<PagesPage />} />
        <Route path="/admin/pages/new" element={<PageNewPage />} />
        <Route path="/admin/pages/:id" element={<PageEditPage />} />
        <Route path="/admin/pages/:pageId/hero" element={<PageHeroPage />} />
        <Route path="/admin/pages/:pageId/sections" element={<PageSectionPage />} />
        <Route path="/admin/posts" element={<PostsPage />} />
        <Route path="/admin/posts/new" element={<PostNewPage />} />
        <Route path="/admin/posts/:id" element={<PostEditPage />} />
        <Route path="/admin/contacts" element={<ContactsPage />} />
        <Route path="/admin/menus" element={<MenusPage />} />
        <Route path="/admin/menus/new" element={<MenuNewPage />} />
        <Route path="/admin/menus/:id" element={<MenuEditPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/seo" element={<SEOPage />} />
        <Route path="/admin/split-screens" element={<SplitScreensPage />} />
        <Route path="/admin/masjid-al-fatih" element={<PlaceholderPage title="Masjid AL FATIH" />} />
        <Route path="/admin/university-maps" element={<PlaceholderPage title="University Map" />} />
        <Route path="/admin/global-stages" element={<PlaceholderPage title="Global Stage" />} />
        <Route path="/admin/media" element={<PlaceholderPage title="Media Library" />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
