import { Avatar as Av } from "@skeletonlabs/skeleton-react";

export function Avatar({ user, className, avatarUrl }: { user: string; className?: string; avatarUrl?: string }) {
    return (
        <Av className={className}> 
            <Av.Image src={avatarUrl} />
            <Av.Fallback>{user.replace(/\W/, "").charAt(0).toUpperCase()}</Av.Fallback>
        </Av>
    );
}
