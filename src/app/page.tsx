"use client";

import Image from "next/image";
import { TorCard } from "@/components/tor/TorCard";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Logo } from "@/components/brand/Logo";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";


const bigRow = "flex flex-col items-center py-24";
const requiredSkill = "px-3 py-1 mt-2 mr-2 bg-green-700/5 text-sm text-sage-600 border rounded-xl border-sage-600";

const TODAY_UTC = (() => {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

export default function Home() {
    const t = useTranslations("landing");

    const matched = useMemo(() => withMatches(MOCK_TORS, TODAY_UTC), []);
    const torDisplay = matched.slice(0,4);

    return (
        <div className="w-full">
            <main className="flex flex-col grow">
                {/* 1st row */}
                <div className={bigRow}>
                    <div>
                        <Logo size="lg"></Logo>
                    </div>
                    <p className="mt-6 text-8xl font-semibold text-center text-moss-700">Find the tender you<br></br>can
                        <span className="text-sage-600"> actually win.</span>
                    </p>
                    <a href="/tor" className="px-8 py-4 mt-12 rounded-xl bg-moss-700 hover:bg-sage-600 text-white transition shadow-md hover:-translate-y-1 duration-300">Browse TORs →</a>
                    <span className="mt-8 text-sm">Free to read. No account needed until you want matches.</span>

                    <div className="p-12 mt-16 w-256 bg-linear-to-br from-sage-400 to-moss-700 rounded-xl">
                        <div className="flex grow">
                            <div className="px-4 py-1 bg-white/10 text-sm text-sage-100 rounded-xl border border-sage-100">
                                Last ingest run 2 hours ago • 37 new today
                            </div>
                        </div>
                        <div className="mt-6 w-full bg-white rounded-xl">
                            <ul className="mt-3 flex flex-col gap-2.5">
                                {torDisplay.map((tor) => (
                                <li key={tor.id}>
                                    <TorCard tor={tor} />
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <hr className="text-zinc-300"></hr>
                {/*2nd row*/}
                <div className={`${bigRow} bg-white`}>
                    <div className="w-260">
                        <span className="text-sage-600">WHAT THIS IS</span>
                        <div className="flex">
                            <div className="w-2/3 pr-16">
                                <p className="mt-4 text-4xl/12 text-moss-700">
                                    BangkokTOR reads every software terms-of-reference published across Bangkok procurement portals, structures the Thai PDFs, and tells you which tender your team can actually win. 
                                </p>
                            </div>
                            <div className="w-1/3">
                                <hr className="text-zinc-300"></hr>
                                <p className="mt-6 text-4xl font-semibold text-moss-700">1,234</p>
                                <p className="mb-4">software TORs read and structured</p>
                                <hr className="text-zinc-300"></hr>
                                <p className="mt-6 text-4xl font-semibold text-moss-700">74%</p>
                                <p className="mb-4">arrive as scans and are read back with OCR</p>
                                <hr className="text-zinc-300"></hr>
                                <p className="mt-6 text-4xl font-semibold text-moss-700">9.5%</p>
                                <p className="mb-4">carry a pattern worth scrutinising</p>
                                <hr className="text-zinc-300"></hr>
                            </div>
                        </div>
                        <p className="w-2/3 pr-16 mt-6">
                            The documents are already public. They are also scattered across two portals, published as scans, and written to be filed rather than read. Every record keeps the link back to the original listing, so nothing here replaces the source — it just makes the source findable. 
                        </p>
                    </div>
                </div>

                <hr className="text-zinc-300"></hr>
                {/*3rd row*/}
                <div className={bigRow}>
                    <div className="w-280">
                        <div className="flex w-full justify-between items-end">
                            <p className="w-3/5 mr-24 text-4xl font-semibold text-moss-700">
                                An 18-page Thai scan, read into fields.
                            </p>
                            <p className="w-2/5">
                                One real record, start to finish. The source file carries no text layer and no closing date — everything on the right was read out of it.
                            </p>
                        </div>

                        <div className="flex w-full mt-10">
                            {/*left*/}
                            <div className="flex flex-col grow justify-between w-1/2 mr-6 bg-paper-100 border rounded-xl border-zinc-300">
                                <div>
                                    <div className="flex justify-between px-6 py-3">
                                        <span className="text-sm">Source document</span>
                                        <span className="text-sm text-zinc-500">18 pages</span>
                                    </div>
                                    <hr className="text-zinc-300"></hr>
                                </div>
                                <div className="flex px-6 pt-3 pb-5">
                                    <span className="px-2 py-1 mr-2 bg-paper-50 text-xs border rounded-lg border-zinc-300">Not searchable</span>
                                    <span className="px-2 py-1 mr-2 bg-paper-50 text-xs border rounded-lg border-zinc-300">No closing date printed</span>
                                    <span className="px-2 py-1 mr-2 bg-paper-50 text-xs border rounded-lg border-zinc-300">Filed, not published</span>
                                </div>
                            </div>

                            {/*right*/}
                            <div className="w-1/2 bg-white border rounded-xl border-moss-700">
                                <div className="flex justify-between px-6 py-3 bg-green-700/5">
                                    <span className="text-sm text-moss-700">Extracted record</span>
                                    <span className="text-sm text-zinc-500">12 fields</span>
                                </div>
                                <hr className="text-zinc-300"></hr>
                                <div className="px-6 py-4">
                                    <p className="text-lg text-moss-700">จ้างพัฒนาระบบสารสนเทศเพื่อการบริหารจัดการงานซ่อมบำรุง</p>
                                    <p className="text-sm text-zinc-500">Dept. of Public Works · project no. 67-0412 · egp2.bangkok.go.th</p>
                                    <div className="mt-4 grid grid-cols-2 border rounded-xl border-zinc-300">
                                        <div className="h-22 px-4 py-3 border-b border-r border-zinc-300">
                                            <p className="text-xs text-zinc-500">Budget</p>
                                            <p className="text-moss-700">฿6,700,000</p>
                                        </div>
                                        <div className="h-22 px-4 py-3 border-b border-zinc-300">
                                            <p className="text-xs text-zinc-500">Reference price</p>
                                            <p className="text-moss-700">฿5,600,000</p>
                                        </div>
                                        <div className="h-22 px-4 py-3 border-r border-zinc-300">
                                            <p className="text-xs text-zinc-500">Method</p>
                                            <p className="text-moss-700">e-bidding</p>
                                        </div>
                                        <div className="h-22 px-4 py-3">
                                            <p className="text-xs text-zinc-500">Category</p>
                                            <p className="text-moss-700">IT & Software</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-zinc-500">Required skills</p>
                                    <div className="flex flex-wrap mt-1">
                                        <div className={requiredSkill}>Web application development</div>
                                        <div className={requiredSkill}>PostgreSQL</div>
                                        <div className={requiredSkill}>System integration</div>
                                        <div className={requiredSkill}>On-prem deployment</div>
                                    </div>
                                </div>
                                <hr className="mt-4 text-zinc-300"></hr>
                                <div className="flex justify-between px-6 py-3">
                                    <p className="text-sm text-zinc-500">Link to the original listing kept on every record</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-white border rounded-xl border-red-700/50">
                            <div className="flex justify-between px-6 py-3 bg-red-800/10 rounded-t-xl">
                                <p className="text-sm font-semibold text-red-900">2 patterns worth scrutinising on this record </p>
                            </div>
                            <div className="flex">
                                <div className="w-1/2 px-6 py-4 border-r border-zinc-300">
                                    <p className="text-sm text-zinc-400">Clause 4.2 • Qualifications</p>
                                    <p className="mt-1 text-lg font-medium text-moss-700">The qualification narrows to a single prior contract with this same agency.</p>
                                    <div className="mt-4 px-6 py-6 bg-green-900/5 text-moss-700 border-l-4 rounded-r-xl border-red-800">“ผู้เสนอราคาต้องมีผลงานติดตั้งระบบเดียวกันกับหน่วยงานนี้ ในวงเงินไม่น้อยกว่า ๕,๐๐๐,๐๐๐ บาท ภายในสองปีที่ผ่านมา”</div>
                                    <p className="mt-4 text-sm">Requiring prior work with this agency specifically excludes every vendor that has done the same job elsewhere. We quote it and stop there — whether it is justified is your call.</p>
                                </div>
                                <div className="w-1/2 px-6 py-4">
                                    <p className="text-sm text-zinc-400">Price gap</p>
                                    <p className="mt-1 text-lg font-medium text-moss-700">Budget sits 19% above the reference price.</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="w-20 text-sm text-zinc-500">Reference</p>
                                        <div className="h-3 w-80 bg-sage-100 rounded-xl relative">
                                            <div className="h-3 w-67 bg-sage-400 rounded-xl absolute left-0"></div>
                                        </div>
                                        <p className="w-14 text-sm">฿5.60M</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="w-20 text-sm text-zinc-500">Budget</p>
                                        <div className="h-3 w-80 bg-red-900/75 rounded-xl"></div>
                                        <p className="w-14 text-sm">฿6.70M</p>
                                    </div>
                                    <p className="mt-4 text-sm">A gap above 15% is uncommon in the corpus — 6% of records — so it is stated rather than filed away.</p>
                                </div>
                            </div>
                        </div>

                        <p className="w-3/5 mt-32 text-4xl font-semibold text-moss-700">
                            Three passes over every document.
                        </p>
                        <div className="flex mt-12 bg-white border rounded-xl border-zinc-300">
                            <div className="flex flex-col w-1/3 px-10 py-8">
                                <p className="text-zinc-400">01 / INGEST</p>
                                <p className="text-xl font-semibold text-moss-700">Every portal, once a day</p>
                                <p className="mt-2 text-sm/6 text-zinc-500">Scheduled scrapers watch egp2.bangkok.go.th, procurement.nsm.or.th and gprocurement.go.th, pull the source PDF, and keep the link back to the original listing.</p>
                            </div>
                            <div className="border-r border-zinc-300"></div>

                            <div className="flex flex-col w-1/3 px-10 py-8">
                                <p className="text-zinc-400">02 / EXTRACT</p>
                                <p className="text-xl font-semibold text-moss-700">Thai PDFs, structured</p>
                                <p className="mt-2 text-sm/6 text-zinc-500">Vertex AI pulls title, agency, budget, deadline, qualification criteria and required skills - OCR for scanned documents.</p>
                            </div>
                            <div className="border-r border-zinc-300"></div>

                            <div className="flex flex-col w-1/3 px-10 py-8">
                                <p className="text-zinc-400">03 / SCRUTINISE</p>
                                <p className="text-xl font-semibold text-moss-700">Advisory, not accusation</p>
                                <p className="mt-2 text-sm/6 text-zinc-500">Where qualification criteria look written for one predetermined vendor, we say so plainly as a pattern worth scrutinising, with the clause quoted, and the judgement left to you.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className={`flex flex-col items-center py-18 bg-moss-700`}>
                    <div className="flex justify-between items-center w-280">
                        <p className="text-xl font-semibold text-white">BangkokTOR</p>
                        <p className="w-90 text-sm text-zinc-300 opacity-75">Records are reproduced from egp2.bangkok.go.th and gprocurement.go.th. Observations are advisory and quote the clause they read.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
