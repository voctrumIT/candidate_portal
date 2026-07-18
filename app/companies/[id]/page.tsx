import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CompanyHero from "./components/CompanyHero";
import CompanyContentManager from "./components/CompanyContentManager";
import { dummyCompanies } from "../data";

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = dummyCompanies.find((c) => c.id === id);

  if (!company) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-[72px]">
      <Navbar />

      <CompanyHero company={company} />
      
      <CompanyContentManager />

      <Footer />
    </main>
  );
}
