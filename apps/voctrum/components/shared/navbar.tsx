// components/shared/navbar.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/public/Logo.svg"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Modules", href: "/modules" },
  { name: "Pricing", href: "/pricing" },
  // { name: "Services", href: "/services" },
  // { name: "Industries", href: "/industries" },
  // { name: "About", href: "/about" },
  // { name: "Careers", href: "/carrers" },
  // { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignIn = () => {
    router.push("https://erp.voctrum.com/login")
  }

  const handleGetStarted = () => {
    // router.push("/products/register")
    router.push("/get-started")
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-[2147483647] px-4 pt-8">
      <div className="mx-auto flex h-12 w-full max-w-[1040px] items-center justify-between rounded-full bg-white px-5 shadow-[0_16px_40px_rgba(5,14,76,0.10)] ring-1 ring-white/90">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Voctrum home">
          <Image src={Logo} alt="Voctrum" width={112} height={36} priority className="h-auto w-[112px]" />
        </Link>

          <div className="hidden items-center gap-4 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium leading-none text-[#07106c] transition-colors hover:text-[#2497f4]"
              >
                {item.name}
              </Link>
            ))}
          </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignIn}
            className="h-9 rounded-full px-3 text-sm font-semibold text-[#07106c] hover:bg-blue-50 hover:text-[#2497f4]"
          >
              Sign In
            </Button>
          <Button
            size="sm"
            onClick={handleGetStarted}
            className="h-9 rounded-full bg-[linear-gradient(90deg,#2aa8f5,#09268f)] px-5 text-sm font-semibold text-white shadow-[inset_-8px_-8px_0_rgba(20,40,150,0.18)] hover:opacity-95"
          >
              Get Started
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[#07106c]">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

          <SheetContent side="right" className="z-[2147483647] w-75 sm:w-100">
            <div className="flex h-full flex-col p-5">
              <Link href="/" onClick={() => setIsOpen(false)} className="mb-8 flex items-center" aria-label="Voctrum home">
                <Image src={Logo} alt="Voctrum" width={120} height={39} className="h-auto w-[120px]" />
              </Link>

                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="py-2 text-lg font-medium text-[#07106c] transition-colors hover:text-[#2497f4]"
                    >
                      {item.name}
                    </Link>
                  ))}

                  <Button variant="outline" className="w-full justify-start rounded-full" onClick={handleSignIn}>
                    Sign In
                  </Button>
                  <Button className="w-full justify-start rounded-full bg-[#2397f4] hover:bg-[#1789e6]" onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>



      </div>
    </nav>
  )
}
