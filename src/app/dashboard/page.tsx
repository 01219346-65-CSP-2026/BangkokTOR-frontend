import { Button } from "@/components/ui/Button";


export default function DashboardPage() {
    return (
        <div className="flex flex-1">
            {/* ADD NAVBAR */}

            <main className="flex flex-col grow px-48 py-16">
                <div className="flex justify-between mb-8">
                    <p className="text-4xl font-bold">Latest matches for you</p>
                    <a href="/settings" className="px-6 py-3 bg-white hover:bg-zinc-50 bg-white border border-zinc-300 shadow-xs">Edit skill profile</a>
                </div>
                {/* new matches list
                CHANGE ITEMS */}
                <div className="flex flex-col flex-1 justify-between bg-white border border-zinc-300">
                    <div>
                        {/* TOR item, should be changed */}
                        <div className="flex justify-between py-6">
                            <div className="flex pl-10">
                                <div className="flex h-full items-center">
                                    <div className="flex w-24 h-24 rounded-full justify-center items-center border-10 border-green-800">
                                        92
                                    </div>
                                </div>
                                <div className="flex flex-col px-10 py-2">
                                    <p className="text-zinc-300">Agency</p>
                                    <p className="text-2xl">TOR name</p>
                                    <p className="text-zinc-400">why it matched</p>
                                </div>
                            </div>

                            <div className="w-64 px-8 border-l border-zinc-300">
                                <p className="text-zinc-400 leading-none">budget</p>
                                <p className="mb-4 text-xl">฿1,000,000</p>
                                <p className="text-zinc-400 leading-none">closes in</p>
                                <p className="mb-2 text-lg">7 days</p>
                                <a className="flex justify-center w-full px-8 py-3 bg-black text-white shadow-md hover:bg-zinc-800">Open TOR</a>
                            </div>
                        </div>
                        <hr className="text-zinc-300"></hr>
                    </div>
                    <div>
                        <hr className="text-zinc-300"></hr>
                        <div className="flex justify-between px-12 py-4 bg-paper-50/50">
                            <p></p>
                            <p>See all matches →</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 mt-12">
                    {/* white container */}
                    <div className="w-3/5 mr-18 px-12 py-8 bg-white border border-zinc-300">
                        <p className="mb-4 text-xl font-bold">Closing soon</p>
                        <hr className="text-zinc-300"></hr>
                        <div className="flex justify-between py-4">
                            <div className="flex">
                                <p className="w-18 font-bold text-red-900">5d</p>
                                <p className="w-18 text-zinc-400">฿6.70M</p>
                                <p>TOR name</p>
                            </div>
                            <div>
                                <a>See details →</a>
                            </div>
                        </div>

                        <hr className="text-zinc-300"></hr>
                        <div className="flex justify-between py-4">
                            <div className="flex">
                                <p className="w-18 font-bold text-red-900">5d</p>
                                <p className="w-18 text-zinc-400">฿6.70M</p>
                                <p>TOR name</p>
                            </div>
                            <div>
                                <a>See details →</a>
                            </div>
                        </div>
                    </div>

                    {/* black container */}
                    <div className="flex flex-col justify-between w-2/5 px-12 py-8 bg-black border border-zinc-300">
                        <div>
                            <p className="mb-4 text-xl font-bold text-white">Your profile coverage</p>
                            <span className="text-zinc-400 mr-2">Total TOR count</span>
                            <span className="font-bold text-white">1,000</span>
                            <div className="flex justify-between mt-2">
                                <p className="text-white">TORs reachable with your stack</p>
                                <span className="text-white">100 / 1000</span>
                            </div>
                            <div className="flex mt-1">
                                <div className="h-2 w-4/5 bg-emerald-400"></div>
                                <div className="flex grow h-2 bg-zinc-600"></div>
                            </div>
                        </div>

                        <a href="/settings" className="flex h-12 justify-center items-center text-black bg-emerald-400 hover:bg-emerald-300">Add skills</a>
                    </div>
                </div>
            </main>
        </div>
    )
}