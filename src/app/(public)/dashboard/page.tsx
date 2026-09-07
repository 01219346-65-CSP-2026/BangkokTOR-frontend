"use client";

import { Button } from "@/components/ui/Button";

import { TorCard } from "@/components/tor/TorCard"
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";

const TODAY_UTC = (() => {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();


export default function DashboardPage() {
    const tors = useMemo(() => withMatches(MOCK_TORS, TODAY_UTC), []);
    const matches = tors;

    return (
        <div className="flex justify-center">
            <main className="w-375 pt-6 pb-18">
                <h1 className="font-display mt-2 text-2xl tracking-tight text-moss-700">Dashboard</h1>
                <div className="flex w-full mt-4 gap-4">
                    <div className="w-1/2 px-6 py-3 bg-paper-100 border rounded-xl border-zinc-300">
                        <div className="flex w-full justify-between items-center">
                            <p className="text-sm">Your latest matches</p>
                            <a href="/skills" className="text-sm hover:underline">Edit skill profile →</a>
                        </div>
                        <hr className="mt-2 text-zinc-400"></hr>
                        <ul className="mt-3 h-100 flex flex-col gap-2.5 overflow-y-auto">
                            {matches.map((tor) => (
                            <li key={tor.id}>
                                <TorCard tor={tor} />
                            </li>
                            ))}
                        </ul>
                    </div>

                    <div className="w-1/2 px-8 py-4 bg-white rounded-xl shadow-sm">
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <p className="text-moss-700">Graph title</p>
                                <p className="text-sm text-zinc-500">Graph description.</p>
                            </div>
                            <div className="flex px-1 py-1 bg-sage-100 rounded-xl">
                                <button className="px-4 py-2 text-xs rounded-lg bg-moss-700 text-white">
                                    Tab 1
                                </button>
                                <button className="px-4 py-2 text-xs rounded-lg">
                                    Tab 2
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex mt-4 gap-4">
                    <div className="w-1/3 h-100 px-8 py-4 bg-white rounded-xl shadow-sm">
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <p className="text-moss-700">Graph title</p>
                                <p className="text-sm text-zinc-500">Graph description.</p>
                            </div>
                            <div className="flex px-1 py-1 bg-sage-100 rounded-xl">
                                <button className="px-4 py-2 text-xs rounded-lg bg-moss-700 text-white">
                                    Tab 1
                                </button>
                                <button className="px-4 py-2 text-xs rounded-lg">
                                    Tab 2
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/3 h-100 px-8 py-4 bg-white rounded-xl shadow-sm">
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <p className="text-moss-700">Graph title</p>
                                <p className="text-sm text-zinc-500">Graph description.</p>
                            </div>
                            <div className="flex px-1 py-1 bg-sage-100 rounded-xl">
                                <button className="px-4 py-2 text-xs rounded-lg bg-moss-700 text-white">
                                    Tab 1
                                </button>
                                <button className="px-4 py-2 text-xs rounded-lg">
                                    Tab 2
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/3 h-100 px-8 py-4 bg-white rounded-xl shadow-sm">
                        <div className="flex w-full justify-between items-center">
                            <div>
                                <p className="text-moss-700">Graph title</p>
                                <p className="text-sm text-zinc-500">Graph description.</p>
                            </div>
                            <div className="flex px-1 py-1 bg-sage-100 rounded-xl">
                                <button className="px-4 py-2 text-xs rounded-lg bg-moss-700 text-white">
                                    Tab 1
                                </button>
                                <button className="px-4 py-2 text-xs rounded-lg">
                                    Tab 2
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}