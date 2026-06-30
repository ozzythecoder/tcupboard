import { createToaster, Toast, type ToastGroupProps } from "@skeletonlabs/skeleton-react";

export const toaster = createToaster({
    max: 4,
});

export const ToastProvider = ({ toast }: { toast: ToastGroupProps["toaster"] }) => {
    return (
        <Toast.Group toaster={toast}>
            {(toast) => (
                <Toast className="preset-filled-error-300-700" toast={toast}>
                    <Toast.Message>
                        <Toast.Title className="bold">{toast.title}</Toast.Title>
                        <Toast.Description>{toast.description}</Toast.Description>
                    </Toast.Message>
                    <Toast.CloseTrigger />
                </Toast>
            )}
        </Toast.Group>
    );
};
