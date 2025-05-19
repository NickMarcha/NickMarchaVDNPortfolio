//import { Link } from '@tanstack/react-router'
import {atom, useAtom, useAtomValue} from "jotai";
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {DebugModeEnabledAtom} from "@/DebugStore.ts";

export const AdminModeAtom = atom(false);

export default function Header() {

    const [adminMode, setAdminMode] = useAtom(AdminModeAtom);
    const debugMode = useAtomValue(DebugModeEnabledAtom);
    return (
        <header className="flex gap-2 bg-yellow-600 text-white justify-between items-center">
            <nav className="flex flex-row items-center">

                <img alt="Modal Image"
                     src={"/favicon.ico"}/>

                <p className="text-2xl font-bold ml-2">Nick Marcha Portfolio</p>
            </nav>

            {debugMode && <div className="flex flex-row items-center mr-2">
                <div className="flex items-center space-x-2 ">
                    <Switch id="admin-mode" onCheckedChange=
                        {
                            (checked) => {
                                setAdminMode(checked);
                            }
                        }
                            checked={adminMode}
                    />
                    <Label htmlFor="admin-mode">Admin Mode</Label>
                </div>
            </div>}
        </header>
    )
}
