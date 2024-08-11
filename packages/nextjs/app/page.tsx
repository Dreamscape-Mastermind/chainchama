"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleJoinClick = () => {
    if (status === "authenticated") {
      router.push("/group/create");
    } else {
      router.push("/api/auth/signin");
    }
  };
  return (
    <main className="flex-1">
      <section className="w-full py-10 md:py-20 lg:py-30 xl:py-46">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Revolutionize Your ChainChama with Web3
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover the power of a decentralized, secure, and transparent platform for your ChainChama savings.
                  Join our invitation-only community and unlock the benefits of web3 technology.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  onClick={handleJoinClick}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Join the Club
                </Button>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
            </div>
            <Image
              src="/placeholder.svg"
              width="550"
              height="550"
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">What is a ChainChama?</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Unlocking the Power of Collective Savings
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A ChainChama is a traditional African savings and investment club where members contribute a fixed
                amount of money into a common pool on a regular basis. Our web3 platform revolutionizes this concept,
                providing a secure, transparent, and decentralized solution for your ChainChama savings.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How it Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Seamless ChainChama Experience</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our web3 platform simplifies the ChainChama process, providing a secure and transparent way for you and
                your group to manage your collective savings. From contribution tracking to distribution, our features
                empower you to focus on what matters most - building wealth together.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <Image
              src="/placeholder.svg"
              width="550"
              height="310"
              alt="How it Works"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Secure Contributions</h3>
                    <p className="text-muted-foreground">
                      Utilize blockchain technology to ensure your contributions are recorded securely and
                      transparently.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Automated Distributions</h3>
                    <p className="text-muted-foreground">
                      Smart contracts handle the distribution of funds to members, eliminating the need for manual
                      processes.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Transparent Reporting</h3>
                    <p className="text-muted-foreground">
                      Access real-time updates on your ChainChama&#39;s performance and contribution history, ensuring
                      accountability.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Elevate Your ChainChama Experience</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our web3 platform offers a suite of features designed to streamline your ChainChama savings, empowering
                you and your group to achieve your financial goals.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Secure Contributions</h3>
                    <p className="text-muted-foreground">
                      Utilize blockchain technology to ensure your contributions are recorded securely and
                      transparently.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Automated Distributions</h3>
                    <p className="text-muted-foreground">
                      Smart contracts handle the distribution of funds to members, eliminating the need for manual
                      processes.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Transparent Reporting</h3>
                    <p className="text-muted-foreground">
                      Access real-time updates on your ChainChama&#39;s performance and contribution history, ensuring
                      accountability.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <Image
              src="/placeholder.svg"
              width="550"
              height="310"
              alt="Features"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join Our Invitation-Only Club</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Experience the power of a web3-based ChainChama savings platform. Apply now to become a member of our
              exclusive community.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <form className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
              <Button type="submit">Apply Now</Button>
            </form>
            <p className="text-xs text-muted-foreground">
              By applying, you agree to our{" "}
              <Link href="/" className="underline underline-offset-2" prefetch={false}>
                Terms &amp; Conditions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
