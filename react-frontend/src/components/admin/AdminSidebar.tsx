import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Home, 
  Sliders, 
  FileText, 
  Newspaper, 
  // Image, 
  Menu as MenuIcon, 
  Settings,
  ChevronDown,
  ChevronRight,
  Layout,
  // GraduationCap,
  // School
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface MenuItem {
  title: string
  href?: string
  icon: React.ReactNode
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: 'Home',
    icon: <Home size={20} />,
    children: [
      {
        title: 'Hero Slider',
        href: '/admin/sliders',
        icon: <Sliders size={18} />,
      },
      {
        title: 'Home Section',
        href: '/admin/home-sections',
        icon: <Layout size={18} />,
      },
      // {
      //   title: 'Split Screen Section',
      //   href: '/admin/split-screens',
      //   icon: <Layout size={18} />,
      // },
      // {
      //   title: 'FAQ Section',
      //   href: '/admin/faqs',
      //   icon: <Layout size={18} />,
      // },
      // {
      //   title: 'Masjid AL FATIH',
      //   href: '/admin/masjid-al-fatih',
      //   icon: <Layout size={18} />,
      // },
      // {
      //   title: 'University Map',
      //   href: '/admin/university-maps',
      //   icon: <Layout size={18} />,
      // },
      // {
      //   title: 'Tokoh-Tokoh',
      //   href: '/admin/figures',
      //   icon: <Layout size={18} />,
      // },
      // {
      //   title: 'Global Stage',
      //   href: '/admin/global-stages',
      //   icon: <Layout size={18} />,
      // },
      // {
      //   title: 'Kerjasama',
      //   href: '/admin/partnerships',
      //   icon: <Layout size={18} />,
      // },
    ],
  },
  // {
  //   title: 'SMP',
  //   href: '/admin/pages?slug=smp',
  //   icon: <School size={20} />,
  // },
  // {
  //   title: 'SMA',
  //   href: '/admin/pages?slug=sma',
  //   icon: <GraduationCap size={20} />,
  // },
  {
    title: 'Halaman',
    href: '/admin/pages',
    icon: <FileText size={20} />,
  },
  {
    title: 'Berita',
    href: '/admin/posts',
    icon: <Newspaper size={20} />,
  },
  {
    title: 'Menu',
    href: '/admin/menus',
    icon: <MenuIcon size={20} />,
  },
  // {
  //   title: 'Kategori',
  //   href: '/admin/categories',
  //   icon: <Layout size={20} />,
  // },
  // {
  //   title: 'Media',
  //   href: '/admin/media',
  //   icon: <Image size={20} />,
  // },
  {
    title: 'Pengaturan',
    href: '/admin/settings',
    icon: <Settings size={20} />,
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Home'])

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    
    // Extract base path from href (remove query parameters)
    const hrefBase = href.split('?')[0]
    
    // Special handling for /admin/pages with query parameters
    if (location.pathname === '/admin/pages' && hrefBase === '/admin/pages') {
      const slugParam = searchParams.get('slug')
      
      // If href contains query parameter, check if it matches
      if (href.includes('?slug=')) {
        const hrefSlug = href.split('?slug=')[1]
        return slugParam === hrefSlug
      }
      
      // If href is just '/admin/pages' without query, only active if no slug param
      return !slugParam
    }
    
    // For other paths, use standard matching
    return location.pathname.startsWith(hrefBase)
  }

  const isParentActive = (item: MenuItem): boolean => {
    if (item.href && isActive(item.href)) return true
    if (item.children) {
      return item.children.some((child) => isActive(child.href))
    }
    return false
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">CMS Sekolah</h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedMenus.includes(item.title)
            const isItemActive = isParentActive(item)

            return (
              <div key={item.title}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                        isItemActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.title}
                            to={child.href || '#'}
                            className={cn(
                              'flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors',
                              isActive(child.href)
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )}
                          >
                            {child.icon}
                            <span className="text-sm">{child.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href || '#'}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                      isActive(item.href)
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            © 2025 CMS Sekolah
          </p>
        </div>
      </div>
    </aside>
  )
}

