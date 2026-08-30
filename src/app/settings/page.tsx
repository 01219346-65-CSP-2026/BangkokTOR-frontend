import { Button } from "@/components/ui/Button";


export default function SettingsPage() {
    return (
        <div className="flex flex-1">
            <main className="flex flex-1 justify-center px-48 py-16">
                <div className="flex flex-col h-full w-4xl">
                    <p className="mb-4 text-3xl font-bold">Settings</p>
                    <div className="flex flex-col grow h-full px-12 py-8 bg-white border rounded-md shadow-sm border-zinc-300">
                        {/* Your skill profile */}
                        <div>
                            <div className="flex mb-4">
                                <span className="mr-3 text-lg font-bold text-zinc-800">Your skill profile</span>
                                <span className="text-lg text-zinc-400">— 2 skills</span>
                            </div>

                            <div>
                                {/* Skill item */}
                                <div className="flex justify-between px-4 py-2 mb-2 border rounded-md border-zinc-300 transition delay-150 duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-sm">
                                    <div>
                                        <p className="text-sm text-zinc-400">Skill</p>
                                        <p className="ml-4">Skill name or description here</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-2 h-full border-l border-zinc-300"></div>
                                        <button className="flex justify-center items-center h-12 w-12 rounded-lg hover:bg-zinc-100">
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between px-4 py-2 mb-2 border rounded-md border-zinc-300 transition delay-150 duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-sm">
                                    <div>
                                        <p className="text-sm text-zinc-400">Skill</p>
                                        <p className="ml-4">Skill name or description here</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="mr-2 h-full border-l border-zinc-300"></div>
                                        <button className="flex justify-center items-center h-12 w-12 rounded-lg hover:bg-zinc-100">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="flex justify-between mt-4 mb-8">
                                <input type="text" id="skill" placeholder="Enter skill" className="w-full px-8 py-2 bg-paper-50 inset-shadow-sm inset-shadow-paper-100 border rounded-lg border-zinc-300"></input>
                                <Button className="w-48 ml-4 rounded-lg">Add new skill</Button>
                            </div>
                        </div>

                        <hr className="text-zinc-300"></hr>

                        {/* Notifications */}
                        <div className="mt-8">
                            <div className="flex">
                                <span className="mr-3 text-lg font-bold text-zinc-800">Notifications</span>
                            </div>

                            <div className="flex justify-between items-center px-4 py-2">
                                <div>
                                    <p>Recieve TOR notifications</p>
                                    <p className="text-sm text-zinc-400">Recieve email notifications when new TORs matching your skill profile are found</p>
                                </div>
                                <div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input type="checkbox" value="" className="peer sr-only" />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}