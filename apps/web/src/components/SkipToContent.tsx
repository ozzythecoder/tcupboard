export function SkipToContent() {
    const handle = () => {
        document.getElementById("content")?.focus();
    };

    return (
        <div>
            <button
                className="btn btn-lg preset-filled-tertiary-100-900 absolute left-[-100vw] focus:left-2 top-2 z-100"
                onClick={handle}
                type="button"
            >
                Skip to content
            </button>
        </div>
    );
}
