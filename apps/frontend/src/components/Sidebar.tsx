import { Navigation } from "./Nav";

export function Sidebar() {
    
    return (
        <aside id="sidebar" className="flex-1 border-r border-r-surface-300-700 drop-shadow-md">
            <Navigation />
            {/* user data */}
        </aside>
    )
}