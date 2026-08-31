import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-1">
      {/* Navbar here should go here*/}

      <main className="flex flex-col flex-1">
        {/* 1st row */}
        <div className="flex flex-1">
          {/* Intro */}
          <div className="flex flex-col w-3/5 justify-center px-32 py-16">
            <p>public by law - undiscoverable in practice </p>
            <div className="my-8">
              <p className="mb-4 text-4xl font-bold">Government software work,</p>
              <p className="text-4xl font-bold italic">matched to your stack.</p>
            </div>
            <p className="text-zinc-500">BangkokTOR reads every software TOR published across Bangkok procurement portals and tells you which one your team can actually win.</p>

            <div className="my-8">
              <Button className="mr-8">Continue with Google</Button>
              <Button variant="secondary">Browse as guest</Button>
            </div>

            <hr className="text-zinc-400"></hr>

            <div className="flex mt-8">
              <div className="col mr-8">
                <b className="text-2xl">1,234</b>
                <p className="text-zinc-500">software TORs ingested</p>
              </div>
              <div className="col mr-8">
                <b className="text-2xl">3</b>
                <p className="text-zinc-500">portals watched daily</p>
              </div>
              <div className="col mr-8">
                <b className="text-2xl">10%</b>
                <p className="text-zinc-500">show patterns worth scrutinising</p>
              </div>
            </div>
          </div>

          {/* New TORs */}
          <div className="flex flex-col w-2/5 justify-center px-24 py-16 bg-paper-100">
            <p className="mb-4 text-zinc-500">Latest TORs</p>

            {/* CHANGE THIS */}
            <div className="px-12 py-6 bg-paper-50 shadow-md">
              <p className="text-zinc-400">Kasetsart University</p>
              <p className="my-2 text-xl">Software project</p>
              <p className="text-zinc-400">฿2,000,000</p>
            </div>
          </div>
        </div>

        {/* 2nd row */}
        <div className="flex px-24 bg-white">
          <div className="flex flex-col w-1/3 px-12 py-18">
            <p className="text-zinc-400">01 / INGEST</p>
            <p className="text-xl">Every portal, once a day</p>
            <p className="text-zinc-500">Scheduled scrapers watch egp2.bangkok.go.th, procurement.nsm.or.th and gprocurement.go.th, pull the source PDF, and keep the link back to the original listing.</p>
          </div>
          <div className="border-r border-zinc-300"></div>

          <div className="flex flex-col w-1/3 px-12 py-18">
            <p className="text-zinc-400">02 / EXTRACT</p>
            <p className="text-xl">Thai PDFs, structured</p>
            <p className="text-zinc-500">Vertex AI pulls title, agency, budget, deadline, qualification criteria and required skills - OCR for scanned documents.</p>
          </div>
          <div className="border-r border-zinc-300"></div>

          <div className="flex flex-col w-1/3 px-12 py-18">
            <p className="text-zinc-400">03 / SCRUTINISE</p>
            <p className="text-xl">Advisory, not accusation</p>
            <p className="text-zinc-500">Where qualification criteria look written for one predetermined vendor, we say so plainly as a pattern worth scrutinising, with the clause quoted, and the judgement left to you.</p>
          </div>
        </div>
      </main>
    </div>

    // Gonna keep this here for reference
    /*
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            BangkokTOR
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            aaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-[14px] w-4"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
    */
  );
}
