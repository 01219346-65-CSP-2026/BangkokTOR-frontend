"use client";

import { Button } from "@/components/ui/Button";

import { TorCard } from "@/components/tor/TorCard"
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";
import { aggregateByBudgetRange } from "@/lib/torBudgetRanges";
import { BudgetRangePieChart } from "@/components/tor/BudgetRangePieChart";
import { aggregateByRiskBand, budgetQuartileBreaks, toRiskBudgetPoints } from "@/lib/torRiskBands";
import { RiskBudgetScatter } from "@/components/tor/RiskBudgetScatter";
import { RiskBandPieChart } from "@/components/tor/RiskBandPieChart";
import { aggregateByDeadline } from "@/lib/torDeadlineBuckets";
import { DeadlineBarChart } from "@/components/tor/DeadlineBarChart";

const TODAY_UTC = (() => {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();


export default function DashboardPage() {
    const tors = useMemo(() => withMatches(MOCK_TORS, TODAY_UTC), []);
    const matches = tors;
    const budgetRanges = useMemo(() => aggregateByBudgetRange(MOCK_TORS), []);
    const riskBudgetPoints = useMemo(() => toRiskBudgetPoints(MOCK_TORS), []);
    const budgetQuartiles = useMemo(() => budgetQuartileBreaks(MOCK_TORS), []);
    const riskBandCounts = useMemo(() => aggregateByRiskBand(MOCK_TORS), []);
    const deadlineCounts = useMemo(() => aggregateByDeadline(tors), [tors]);

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

                    <div className="w-1/2 h-100 px-8 py-4 bg-white rounded-xl shadow-sm flex flex-col">
                        <div>
                            <p className="text-moss-700">Risk vs. budget</p>
                            <p className="text-sm text-zinc-500">
                                Each dot is a TOR; dashed lines mark budget quartiles.
                            </p>
                        </div>
                        <div className="flex-1 min-h-0 mt-1">
                            <RiskBudgetScatter points={riskBudgetPoints} quartiles={budgetQuartiles} />
                        </div>
                    </div>
                </div>

                <div className="flex mt-4 gap-4">
                    <div className="w-1/3 h-100 px-8 py-4 bg-white rounded-xl shadow-sm flex flex-col">
                        <div>
                            <p className="text-moss-700">Budget distribution</p>
                            <p className="text-sm text-zinc-500">TORs by budget range.</p>
                        </div>
                        <div className="flex-1 min-h-0 mt-1">
                            <BudgetRangePieChart data={budgetRanges} />
                        </div>
                    </div>

                    <div className="w-1/3 h-100 px-8 py-4 bg-white rounded-xl shadow-sm flex flex-col">
                        <div>
                            <p className="text-moss-700">TORs by deadline</p>
                            <p className="text-sm text-zinc-500">Days remaining to close.</p>
                        </div>
                        <div className="flex-1 min-h-0 mt-1">
                            <DeadlineBarChart data={deadlineCounts} />
                        </div>
                    </div>

                    <div className="w-1/3 h-100 px-8 py-4 bg-white rounded-xl shadow-sm flex flex-col">
                        <div>
                            <p className="text-moss-700">Risk bands</p>
                            <p className="text-sm text-zinc-500">TORs by notable-signal count.</p>
                        </div>
                        <div className="flex-1 min-h-0 mt-1">
                            <RiskBandPieChart data={riskBandCounts} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}