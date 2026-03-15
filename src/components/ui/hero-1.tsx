'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Menu, X } from 'lucide-react'

import VaporizeTextCycle, { Tag } from './vapour-text-effect'
import { GradientButton } from './gradient-button'

interface NavigationItem {
  name: string
  href: string
}

interface AnnouncementBanner {
  text: string
  linkText: string
  linkHref: string
}

interface CallToAction {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

interface HeroLandingProps {
  // Logo and branding
  logo?: {
    src: string
    alt: string
    companyName: string
  }
  
  // Navigation
  navigation?: NavigationItem[]
  loginText?: string
  loginHref?: string
  
  // Hero content
  title: string
  description: string
  announcementBanner?: AnnouncementBanner
  callToActions?: CallToAction[]
  
  // Styling options
  titleSize?: 'small' | 'medium' | 'large'
  gradientColors?: {
    from: string
    to: string
  }
  
  // Additional customization
  className?: string
  children?: React.ReactNode
}

const defaultProps: Partial<HeroLandingProps> = {
  logo: {
    src: "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600",
    alt: "Company Logo",
    companyName: "Your Company"
  },
  navigation: [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
  ],
  loginText: "Log in",
  loginHref: "#",
  titleSize: "large",
  gradientColors: {
    from: "oklch(1 0 0)", // white roughly
    to: "oklch(0.6 0.2 145)" // green roughly
  },
  callToActions: [
    { text: "Get started", href: "#", variant: "primary" },
    { text: "Learn more", href: "#", variant: "secondary" }
  ]
}

export function HeroLanding(props: HeroLandingProps) {
  const {
    logo,
    navigation,
    loginText,
    loginHref,
    title,
    description,
    announcementBanner,
    callToActions,
    titleSize,
    gradientColors,
    className,
    children
  } = { ...defaultProps, ...props }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getTitleSizeClasses = () => {
    switch (titleSize) {
      case 'small':
        return 'text-2xl sm:text-3xl md:text-5xl'
      case 'medium':
        return 'text-2xl sm:text-4xl md:text-6xl'
      case 'large':
      default:
        return 'text-3xl sm:text-5xl md:text-7xl'
    }
  }

  const renderCallToAction = (cta: CallToAction, index: number) => {
    if (cta.variant === 'primary') {
      return (
        <GradientButton key={index} asChild size="default">
          <a href={cta.href}>
            {cta.text}
          </a>
        </GradientButton>
      )
    } else {
      return (
        <GradientButton key={index} asChild variant="variant" size="default">
          <a href={cta.href}>
            {cta.text} <span aria-hidden="true" className="ml-2">→</span>
          </a>
        </GradientButton>
      )
    }
  }

  return (
    <div className={`min-h-screen w-screen overflow-x-hidden relative ${className || ''}`}>
      {/* Top gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: `linear-gradient(to top right, ${gradientColors?.from}, ${gradientColors?.to})`
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>
      
      {/* Bottom gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: `linear-gradient(to top right, ${gradientColors?.from}, ${gradientColors?.to})`
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>

      {logo || (navigation && navigation.length > 0) ? (
        <header className="absolute inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-4 sm:p-6 lg:px-8">
            <div className="flex lg:flex-1">
              {logo && (
                <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                  <span className="sr-only">{logo.companyName}</span>
                  {logo.src && (
                    <img
                      alt={logo.alt}
                      src={logo.src}
                      className="h-8 sm:h-10 w-auto"
                    />
                  )}
                </a>
              )}
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <Menu aria-hidden="true" className="size-6" />
              </button>
            </div>
            {navigation && navigation.length > 0 && (
              <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-12">
                {navigation.map((item) => (
                  <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-foreground hover:text-muted-foreground transition-colors">
                    {item.name}
                  </a>
                ))}
              </div>
            )}
            {loginText && loginHref && (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href={loginHref} className="text-sm/6 font-semibold text-foreground hover:text-muted-foreground transition-colors">
                  {loginText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            )}
          </nav>
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-card px-4 py-4 sm:px-6 sm:py-6 sm:max-w-sm sm:ring-1 sm:ring-border lg:hidden">
              <div className="flex items-center justify-between">
                {logo && (
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">{logo.companyName}</span>
                    {logo.src && (
                      <img
                        alt={logo.alt}
                        src={logo.src}
                        className="h-8 sm:h-10 w-auto"
                      />
                    )}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Close menu</span>
                  <X aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-2 flow-root">
                <div className="-my-6 divide-y divide-border">
                  {navigation && navigation.length > 0 && (
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                  {loginText && loginHref && (
                    <div className="py-6">
                      <a
                        href={loginHref}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {loginText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>
      ) : null}

      <div className="relative isolate px-6 pt-4 min-h-screen flex flex-col justify-start pb-20">        
        <div className="mx-auto w-full max-w-6xl pt-20 sm:pt-24 mt-10">
          {/* Announcement banner */}
          {announcementBanner && (
            <div className="hidden sm:mb-2 sm:flex sm:justify-center">
              <div className="relative rounded-full px-4 py-1.5 text-sm/6 text-muted-foreground ring-1 ring-border hover:ring-ring transition-all bg-background/50 backdrop-blur-sm">
                {announcementBanner.text}{' '}
                <a href={announcementBanner.linkHref} className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {announcementBanner.linkText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          )}
          
          <div className="text-center mb-16 relative w-full flex flex-col items-center">
            {title === "Projetos Acadêmicos" ? (
              <div className="h-[100px] w-full max-w-[800px] sm:h-[120px] flex justify-center items-center relative -top-6">
                <VaporizeTextCycle
                  texts={["Projetos de Extensão", "Projetos Acadêmicos", "Inovações do UNIFESO"]}
                  font={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "56px",
                      fontWeight: 700
                  }}
                  color="rgb(16, 185, 129)"
                  spread={3}
                  density={5}
                  animation={{
                      vaporizeDuration: 2,
                      fadeInDuration: 1,
                      waitDuration: 2
                  }}
                  direction="left-to-right"
                  alignment="center"
                  tag={Tag.H1}
                />
              </div>
            ) : (
              <h1 className={`${getTitleSizeClasses()} font-semibold tracking-tight text-balance text-foreground drop-shadow-sm`}>
                {title}
              </h1>
            )}
            <p 
              className="mt-2 sm:mt-4 text-base sm:text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8 max-w-2xl mx-auto dark:text-emerald-300"
              style={{ textShadow: "0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)" }}
            >
              {description}
            </p>
            
            {/* Call to action buttons */}
            {callToActions && callToActions.length > 0 && (
              <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6">
                {callToActions.map((cta, index) => renderCallToAction(cta, index))}
              </div>
            )}
          </div>
          
          <div className="mt-8">
             {children}
          </div>
        </div>
      </div>
    </div>
  )
}
