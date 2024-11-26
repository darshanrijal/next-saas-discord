import { SignOutButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Button } from "./ui/button";

export const Navbar = () => {
  const user = null;
  return (
    <nav className="sticky inset-x-0 top-0 z-[100] h-16 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="z-40 flex font-semibold">
            Ping<span className="text-brand-700">Panda</span>
          </Link>

          <div className="flex h-full items-center space-x-4">
            {user ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton>

                <Button asChild size="sm" className="flex items-center gap-1">
                  <Link href="/dashboard">
                    Dashboard
                    <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Link href="/pricing">Pricing</Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <div className="h-8 w-px bg-gray-200" />

                <Button asChild size="sm" className="flex items-center gap-1.5">
                  <Link href="/sign-up">
                    Sign up
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
