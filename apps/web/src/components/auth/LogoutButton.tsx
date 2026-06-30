import { useAuth0Context } from "#/config/auth-context";
import { SquareArrowRightExit } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
    const { logout } = useAuth0Context();

    const [confirmState, setConfirm] = useState(false);

    const confirm = () => {
        if (!confirmState) {
            setConfirm(true);
            setTimeout(() => {
                setConfirm(false);
            }, 3000);
            return;
        } else {
            logout();
        }
    };

    return (
        <button
            type="button"
            data-confirmed={confirmState}
            className="btn btn-sm preset-outlined-error-500 data-[confirmed=true]:preset-filled-error-300-700 flex flex-row justify-between items-center w-full"
            onClick={confirm}
        >
            {confirmState ? <span>Confirm?</span> : <span>Log out</span>}
            <SquareArrowRightExit className="size-6" />
        </button>
    );
}
