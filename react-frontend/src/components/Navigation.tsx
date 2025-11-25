'use client'

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface MenuItem {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  menuType?: string
  externalUrl?: string | null
  children?: MenuItem[]
}

interface NavigationProps {
  menus: MenuItem[]
  locale?: 'id' | 'en'
  logo?: string | null
  websiteName?: string | null
  showWebsiteName?: boolean
}

export function Navigation({ menus, locale = 'id', logo, websiteName, showWebsiteName = true }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [openSubmenuLevel2, setOpenSubmenuLevel2] = useState<string | null>(null)

  const toggleSubmenu = (menuId: string) => {
    setOpenSubmenu(openSubmenu === menuId ? null : menuId)
    setOpenSubmenuLevel2(null) // Reset level 2 when toggling level 1
  }

  const toggleSubmenuLevel2 = (menuId: string) => {
    setOpenSubmenuLevel2(openSubmenuLevel2 === menuId ? null : menuId)
  }

  const hasLogoOrTitle = (logo && showWebsiteName) || showWebsiteName
  const shouldCenterMenu = !hasLogoOrTitle

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {hasLogoOrTitle ? (
            <div className="flex items-center space-x-3">
              {logo && showWebsiteName && (
                <Link to="/" className="flex items-center">
                  <img
                    src={logo}
                    alt={websiteName || 'Logo'}
                    className="h-12 w-auto object-contain drop-shadow-lg"
                  />
                </Link>
              )}
              {showWebsiteName && (
                <Link to="/" className="text-2xl md:text-3xl font-bold text-white hover:text-white/90 transition-colors drop-shadow-lg">
                  {websiteName || 'Al Azhar IIBS'}
                </Link>
              )}
            </div>
          ) : (
            <div className="hidden md:block flex-1"></div>
          )}

          {/* Desktop Menu */}
          <div className={`hidden md:flex md:items-center md:space-x-2 ${shouldCenterMenu ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
            {menus.map((menu: any) => (
              <div key={menu.id} className="relative group">
                {menu.menuType === 'external' && menu.externalUrl ? (
                  <a
                    href={menu.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-white hover:text-white/80 font-semibold text-sm transition-colors flex items-center drop-shadow-md"
                  >
                    {locale === 'en' && menu.titleEn ? menu.titleEn : menu.title}
                    {menu.children && menu.children.length > 0 && (
                      <span className="ml-1 text-white/90">+</span>
                    )}
                  </a>
                ) : (
                  menu.slug.startsWith('#') ? (
                    <span className="px-3 py-2 text-white font-semibold text-sm flex items-center drop-shadow-md cursor-default">
                      {locale === 'en' && menu.titleEn ? menu.titleEn : menu.title}
                      {menu.children && menu.children.length > 0 && (
                        <span className="ml-1 text-white/90">+</span>
                      )}
                    </span>
                  ) : (
                    <Link
                      to={`/${menu.slug}`}
                      className="px-3 py-2 text-white hover:text-white/80 font-semibold text-sm transition-colors flex items-center drop-shadow-md"
                    >
                      {locale === 'en' && menu.titleEn ? menu.titleEn : menu.title}
                      {menu.children && menu.children.length > 0 && (
                        <span className="ml-1 text-white/90">+</span>
                      )}
                    </Link>
                  )
                )}
                {menu.children && menu.children.length > 0 && (
                  <div className="absolute left-0 mt-1 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200/50">
                    <div className="py-2">
                      {menu.children.map((child: any) => (
                        <div key={child.id} className="relative group/submenu">
                          {child.menuType === 'external' && child.externalUrl ? (
                            <a
                              href={child.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 font-medium transition-colors relative"
                            >
                              {locale === 'en' && child.titleEn ? child.titleEn : child.title}
                              {child.children && child.children.length > 0 && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">›</span>
                              )}
                            </a>
                          ) : (
                            child.slug.startsWith('#') ? (
                              <span className="block px-4 py-2.5 text-sm text-gray-800 font-medium relative">
                                {locale === 'en' && child.titleEn ? child.titleEn : child.title}
                                {child.children && child.children.length > 0 && (
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">›</span>
                                )}
                              </span>
                            ) : (
                              <Link
                                to={`/${child.slug}`}
                                className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 font-medium transition-colors relative"
                              >
                                {locale === 'en' && child.titleEn ? child.titleEn : child.title}
                                {child.children && child.children.length > 0 && (
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">›</span>
                                )}
                              </Link>
                            )
                          )}
                          {/* Level 2 Submenu */}
                          {child.children && child.children.length > 0 && (
                            <div className="absolute left-full top-0 ml-1 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 border border-gray-200/50 z-50">
                              <div className="py-2">
                                {child.children.map((grandchild: any) => (
                                  grandchild.menuType === 'external' && grandchild.externalUrl ? (
                                    <a
                                      key={grandchild.id}
                                      href={grandchild.externalUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 font-medium transition-colors"
                                    >
                                      {locale === 'en' && grandchild.titleEn ? grandchild.titleEn : grandchild.title}
                                    </a>
                                  ) : (
                                    grandchild.slug.startsWith('#') ? (
                                      <span
                                        key={grandchild.id}
                                        className="block px-4 py-2.5 text-sm text-gray-800 font-medium"
                                      >
                                        {locale === 'en' && grandchild.titleEn ? grandchild.titleEn : grandchild.title}
                                      </span>
                                    ) : (
                                      <Link
                                        key={grandchild.id}
                                        to={`/${grandchild.slug}`}
                                        className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 font-medium transition-colors"
                                      >
                                        {locale === 'en' && grandchild.titleEn ? grandchild.titleEn : grandchild.title}
                                      </Link>
                                    )
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Language Switcher with Flag Icons */}
            <div className={`${shouldCenterMenu ? 'ml-6' : 'ml-6'} flex items-center space-x-1 border-l border-white/30 pl-4`}>
              <Link
                to="/?locale=en"
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded transition-all",
                  locale === 'en' 
                    ? "bg-white/30 backdrop-blur-sm shadow-md" 
                    : "hover:bg-white/20 backdrop-blur-sm"
                )}
                title="English"
              >
                <span className="text-lg drop-shadow-md">🇬🇧</span>
              </Link>
              <Link
                to="/?locale=id"
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded transition-all",
                  locale === 'id' 
                    ? "bg-white/30 backdrop-blur-sm shadow-md" 
                    : "hover:bg-white/20 backdrop-blur-sm"
                )}
                title="Indonesia"
              >
                <span className="text-lg drop-shadow-md">🇮🇩</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80 drop-shadow-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menus.map((menu: any) => (
              <div key={menu.id}>
                <div className="flex items-center justify-between">
                  {menu.menuType === 'external' && menu.externalUrl ? (
                    <a
                      href={menu.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-2 text-gray-800 hover:bg-primary-50 rounded-md font-medium flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      {locale === 'en' && menu.titleEn ? menu.titleEn : menu.title}
                    </a>
                  ) : (
                    menu.slug.startsWith('#') ? (
                      <span className="block px-3 py-2 text-gray-800 font-medium flex-1">
                        {locale === 'en' && menu.titleEn ? menu.titleEn : menu.title}
                      </span>
                    ) : (
                      <Link
                        to={`/${menu.slug}`}
                        className="block px-3 py-2 text-gray-800 hover:bg-primary-50 rounded-md font-medium flex-1"
                        onClick={() => !menu.children || menu.children.length === 0 ? setIsOpen(false) : undefined}
                      >
                        {locale === 'en' && menu.titleEn ? menu.titleEn : menu.title}
                      </Link>
                    )
                  )}
                  {menu.children && menu.children.length > 0 && (
                    <button
                      onClick={() => toggleSubmenu(menu.id)}
                      className="px-3 py-2"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenu === menu.id && "rotate-180"
                        )}
                      />
                    </button>
                  )}
                </div>
                {menu.children && menu.children.length > 0 && openSubmenu === menu.id && (
                  <div className="pl-4 space-y-1">
                    {menu.children.map((child: any) => (
                      <div key={child.id}>
                        <div className="flex items-center justify-between">
                          {child.menuType === 'external' && child.externalUrl ? (
                            <a
                              href={child.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 rounded-md flex-1"
                              onClick={() => !child.children || child.children.length === 0 ? setIsOpen(false) : undefined}
                            >
                              {locale === 'en' && child.titleEn ? child.titleEn : child.title}
                            </a>
                          ) : (
                            child.slug.startsWith('#') ? (
                              <span className="block px-3 py-2 text-sm text-gray-600 flex-1">
                                {locale === 'en' && child.titleEn ? child.titleEn : child.title}
                              </span>
                            ) : (
                              <Link
                                to={`/${child.slug}`}
                                className="block px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 rounded-md flex-1"
                                onClick={() => !child.children || child.children.length === 0 ? setIsOpen(false) : undefined}
                              >
                                {locale === 'en' && child.titleEn ? child.titleEn : child.title}
                              </Link>
                            )
                          )}
                          {child.children && child.children.length > 0 && (
                            <button
                              onClick={() => toggleSubmenuLevel2(child.id)}
                              className="px-3 py-2"
                            >
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  openSubmenuLevel2 === child.id && "rotate-180"
                                )}
                              />
                            </button>
                          )}
                        </div>
                        {child.children && child.children.length > 0 && openSubmenuLevel2 === child.id && (
                          <div className="pl-4 space-y-1">
                            {child.children.map((grandchild: any) => (
                              grandchild.menuType === 'external' && grandchild.externalUrl ? (
                                <a
                                  key={grandchild.id}
                                  href={grandchild.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-3 py-2 text-xs text-gray-500 hover:bg-primary-50 rounded-md"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {locale === 'en' && grandchild.titleEn ? grandchild.titleEn : grandchild.title}
                                </a>
                              ) : (
                                grandchild.slug.startsWith('#') ? (
                                  <span
                                    key={grandchild.id}
                                    className="block px-3 py-2 text-xs text-gray-500"
                                  >
                                    {locale === 'en' && grandchild.titleEn ? grandchild.titleEn : grandchild.title}
                                  </span>
                                ) : (
                                  <Link
                                    key={grandchild.id}
                                    to={`/${grandchild.slug}`}
                                    className="block px-3 py-2 text-xs text-gray-500 hover:bg-primary-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {locale === 'en' && grandchild.titleEn ? grandchild.titleEn : grandchild.title}
                                  </Link>
                                )
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t flex space-x-2">
              <Link
                to="/?locale=en"
                className={cn(
                  "flex-1 text-center px-3 py-2 text-sm rounded",
                  locale === 'en' ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700"
                )}
                onClick={() => setIsOpen(false)}
              >
                English
              </Link>
              <Link
                to="/?locale=id"
                className={cn(
                  "flex-1 text-center px-3 py-2 text-sm rounded",
                  locale === 'id' ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700"
                )}
                onClick={() => setIsOpen(false)}
              >
                Indonesia
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

