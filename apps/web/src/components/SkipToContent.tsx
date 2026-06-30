export function SkipToContent() {
    const handle = () => {
        document.getElementById("content")?.focus();
    };

    return (
        <div>
            <button
                type="button"
                onClick={handle}
                className="btn btn-lg preset-filled-tertiary-100-900 absolute left-[-100vw] focus:left-2 top-2 z-100"
            >
                Skip to content
            </button>
        </div>
    );
}
