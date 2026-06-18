import { Avatar as Av } from "@skeletonlabs/skeleton-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type LinkOptions =
    | {
          link?: false | undefined;
          id?: never;
      }
    | {
          link: true;
          id: string;
      };

type Props = {
    user: string;
    className?: string;
    avatarUrl?: string | null;
} & LinkOptions;

export function Avatar({ user: username, className, avatarUrl, link, id }: Props) {
    if (link && !id) {
        throw new Error("[Avatar.tsx] - ID must be included if rendering as a link");
    }

    return (
        <AvatarLinkWrapper link={link} id={id}>
            <Av className={`hover:brightness-110 ${className}`}>
                <Av.Image src={avatarUrl} />
                <Av.Fallback>{username.replace(/\W/, "").charAt(0).toUpperCase()}</Av.Fallback>
            </Av>
        </AvatarLinkWrapper>
    );
}

function AvatarLinkWrapper({
    link,
    id,
    children,
}: {
    link?: boolean;
    id?: string;
    children: ReactNode;
}) {
    return link && id ? (
        <Link to="/profile/$id" params={{ id }}>
            {children}
        </Link>
    ) : (
        children
    );
}
