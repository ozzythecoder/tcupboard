export function ThreadsLoading() {
    // biome-ignore lint/suspicious/noArrayIndexKey: This array is a fixed size regardless and only exists in a loading state.
    const skeletons = Array.from({ length: 5 }).map((_, i) => <PlaceholderThread key={i} />);
    return <div className="grid grid-rows-1 min-w-full gap-6 mt-16">{skeletons}</div>;
}

function PlaceholderThread() {
    return (
        <div className="placeholder card bg-surface-100-900 h-30 animate-pulse grid grid-cols-[auto_1fr] items-center px-8 gap-10">
            <div className="flex flex-col gap-2">
                <div className="rounded-full w-18 aspect-square placeholder bg-primary-500/20"></div>
                <div className="h-4 placeholder bg-primary-500/20"></div>
            </div>
            <div className="flex flex-col gap-4 h-full pt-8">
                <div className="rounded-full placeholder bg-primary-500/20"></div>
                <div className="rounded-full placeholder bg-primary-500/20"></div>
            </div>
        </div>
    );
}

export function OneThreadLoading() {
    return (
        <div className="placeholder card bg-surface-100-900 h-60 animate-pulse grid grid-cols-[auto_1fr] items-center px-8 mt-14 gap-10">
            <div className="flex flex-col gap-2 justify-start h-full pt-6">
                <div className="rounded-full w-18 aspect-square placeholder bg-primary-500/20"></div>
                <div className="h-4 placeholder bg-primary-500/20"></div>
            </div>
            <div className="flex flex-col gap-4 h-full pt-8 mb-8 justify-start">
                <div className="rounded-full placeholder bg-primary-500/20 max-w-1/2"></div>
                <div className="rounded-full placeholder bg-primary-500/0 max-w-1/2"></div>
                <div className="rounded-full placeholder bg-primary-500/20"></div>
                <div className="rounded-full placeholder bg-primary-500/20"></div>
                <div className="rounded-full placeholder bg-primary-500/20"></div>
                <div className="rounded-full placeholder bg-primary-500/0 max-w-1/2"></div>
                <div className="rounded-full placeholder bg-primary-500/20"></div>
            </div>
        </div>
    );
}
