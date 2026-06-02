import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "#/utils/hooks";

type Image = { url: string; width: number; height: number; publicId: string };

function ImageModal({ image, onClose }: { image: Image; onClose: () => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useScrollLock();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        dialog.showModal();
        return () => dialog.close();
    }, []);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        dialog.addEventListener("close", onClose);
        return () => dialog.removeEventListener("close", onClose);
    }, [onClose]);

    return (
        <dialog
            ref={dialogRef}
            onClick={onClose}
            onKeyDown={(e) => {
                if (e.key === "esc") {
                    onClose();
                }
            }}
            className="grid place-items-center mx-auto backdrop:bg-black/50 mt-[5vh] rounded-container ring-black ring-3"
        >
            <img src={image.url} alt="" className="max-h-[90vh] max-w-[90vw]" />
        </dialog>
    );
}

function ImageAttachment({ image }: { image: Image }) {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="h-24 w-24 overflow-hidden rounded-md"
            >
                <img src={image.url} alt="" className="object-cover h-full hover:brightness-110" />
            </button>
            {isOpen && <ImageModal image={image} onClose={() => setOpen(false)} />}
        </>
    );
}

export function ImageGrid({ images }: { images: Image[] | null }) {
    if (!images || images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((i) => (
                <ImageAttachment key={i.url} image={i} />
            ))}
        </div>
    );
}
