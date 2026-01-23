import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about SwapConnect, our mission, and our values.",
  openGraph: {
    title: "About Us | SwapConnect",
    description: "Learn more about SwapConnect, our mission, and our values.",
    type: "website",
  },
};

const About = () => {
  return (
    <div className="py-5 text-justify">
      {/* Hero Section */}
      <section className="flex justify-center mb-8">
        <Image
          src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720109248/SwapConnect/about/TeamIMG_dgavsi.png"
          alt="SwapConnect Team"
          width={900}
          height={300}
          className="rounded-lg object-cover w-full max-w-4xl h-auto"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 900px, 900px"
        />
      </section>

      {/* About Us Section */}
      <section className="max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-4 text-brand-primary">About Us</h1>
        <p className="mb-8 text-foreground/80 leading-relaxed">
          Welcome to{" "}
          <strong>
            <span className="text-brand-secondary">Swap</span>
            <span className="text-brand-primary">Connect</span>,
          </strong>{" "}
          where innovation meets sustainability in the world of tech. We&apos;re
          more than just a Device Swap/Upgrade Website; we&apos;re a
          community-driven platform dedicated to reshaping the way you
          experience technology.
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="max-w-4xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-4 text-brand-primary">
          Our Mission
        </h2>
        <p className="mb-8 text-foreground/80 leading-relaxed">
          At{" "}
          <strong>
            <span className="text-brand-secondary">Swap</span>
            <span className="text-brand-primary">Connect</span>
          </strong>
          , our mission is to empower individuals to upgrade their devices
          affordably, sustainably, and with confidence. We believe in creating a
          space where the tech community can thrive, fostering a circular
          economy that reduces electronic waste and contributes to a greener
          planet.
        </p>
      </section>

      {/* Why Choose SwapConnect Section */}
      <section className="max-w-4xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-4 text-brand-primary">
          Why Choose SwapConnect
        </h2>
        <ul className="list-disc pl-6 space-y-4 mb-8 text-foreground/80 leading-relaxed">
          <li>
            <strong>Sustainability at Heart:</strong> We&apos;re committed to
            reducing e-waste and minimizing the environmental impact of
            technology. Every device swapped or upgraded through our platform
            contributes to a more sustainable and eco-friendly future.
          </li>
          <li>
            <strong>Innovation and Transparency:</strong> Our innovative
            AI-powered pricing ensures fair valuations for your devices,
            promoting transparency and trust throughout the swapping process. We
            believe in empowering users with accurate information to make
            informed decisions.
          </li>
          <li>
            <strong>Community-Centric Approach:</strong> SwapConnect is more
            than just a marketplace; it&apos;s a community where tech
            enthusiasts, eco-conscious consumers, and budget-conscious users
            come together. Engage in expert forums, share insights, and be part
            of a community that values knowledge and collaboration.
          </li>
          <li>
            <strong>Secure and Trustworthy Transactions:</strong> Your security
            is our priority. We&apos;ve implemented a multi-tiered verification
            system, secure payment processing, and an escrow service to ensure
            that every transaction on our platform is trustworthy and secure.
          </li>
        </ul>
      </section>

      {/* Join the Movement Section */}
      <section className="max-w-4xl mx-auto mt-10">
        <p className="mb-4 text-foreground/80 leading-relaxed">
          Join the SwapConnect Movement: Whether you&apos;re upgrading to the
          latest smartphone, selling your old laptop, or simply looking to be
          part of a tech-savvy community, SwapConnect is your destination. Join
          us in revolutionizing the way we think about technology – making it
          accessible, sustainable, and community-driven.
        </p>
        <p className="mb-8 text-foreground/80 leading-relaxed">
          Thank you for being part of our journey at{" "}
          <strong>
            <span className="text-brand-secondary">Swap</span>
            <span className="text-brand-primary">Connect</span>
          </strong>
          . Together, let&apos;s redefine the tech landscape.
        </p>
      </section>

      {/* Join SwapConnect */}
      <section className="max-w-4xl mx-auto mt-10 text-center">
        <a
          href="https://shorturl.at/ysvrI"
          className="uppercase font-bold mb-2 inline-block hover:opacity-80 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          join <span className="text-brand-secondary">Swap</span>
          <span className="text-brand-primary">Connect</span> and spread the
          word!
        </a>
        <p className="italic mb-4 text-text-muted">coming soon...</p>
        <div className="flex justify-center gap-4">
          <Image
            src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720113877/SwapConnect/about/app-store-download_zi5x2u.svg"
            alt="Download on Play Store"
            width={180}
            height={90}
            className="store-icon"
          />
          <Image
            src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1720113877/SwapConnect/about/app-store-download_zi5x2u.svg"
            alt="Download on App Store"
            width={180}
            height={90}
            className="store-icon"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
