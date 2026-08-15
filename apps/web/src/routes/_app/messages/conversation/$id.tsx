import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { Loading } from "#/components/Loading";
import { BackLink } from "#/components/ui/BackLink";
import { getProtectedApi } from "#/config/api";
import { BadRequestError, NotFoundError } from "#/config/error";
import { DirectMessage } from "#/features/direct-messages/components/DirectMessageView";
import { conversationQueries } from "#/features/direct-messages/direct-messages.api";

export const Route = createFileRoute("/_app/messages/conversation/$id")({
    beforeLoad: async ({ context }) => {
        context.auth.guard();
        return {
            token: await context.auth.getToken(),
        };
    },
    component: RouteComponent,
    loader: async ({ context, params }) => {
        const { id } = params;
        if (Number.isNaN(+id)) throw new BadRequestError("Invalid id");
        const authApi = getProtectedApi(context.token);
        const opts = conversationQueries.one(authApi, context.queryClient, +id);
        context.queryClient.ensureQueryData(opts);
        return {
            opts,
            userId: await context.auth.getId(),
        };
    },
});

function RouteComponent() {
    const { opts, userId } = Route.useLoaderData();
    const { data, error, isFetching } = useQuery(opts);

    if (isFetching) return <Loading />;
    if (error) throw error;
    if (!data) throw new NotFoundError();

    const participants = Array.from(
        new Set(data.filter((c) => c.authorId !== +userId).map((c) => c.authorUsername)),
    );

    return (
        <Fragment>
            <div className="flex flex-row w-full">
                <BackLink label="Back" to="/messages" />
                <h3 className="h4">Conversation with {participants}</h3>
            </div>
            <ul className="flex flex-col gap-2">
                {data.map((msg) => (
                    <li key={msg.id}>
                        <DirectMessage message={msg} />
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}
