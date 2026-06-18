import { Avatar } from "#/components/ui/Avatar";
import type { User } from "#/types/resources";

export function ProfileView({ user }: { user: User }) {
    
    return (
        <div>
            <Avatar user={user.username} avatarUrl={user.avatar_url} />
            {user.username}
            <pre>{JSON.stringify(user)}</pre>
        </div>
    )
}