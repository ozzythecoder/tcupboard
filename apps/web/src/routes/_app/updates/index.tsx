import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { Loading } from "#/components/Loading";
import { RichTextContent } from "#/features/editor";
import { updateQueries } from "#/features/updates/updates.api";
import { utils } from "#/utils/utils";

export const Route = createFileRoute("/_app/updates/")({
    component: RouteComponent,
    loader: async ({ context }) => {
        const updateOptions = updateQueries.all();
        context.queryClient.ensureQueryData(updateOptions);
        return { updateOptions };
    },
});

function RouteComponent() {
    const { updateOptions } = Route.useLoaderData();
    const { data } = useQuery(updateOptions);
    if (!data) return <Loading />;

    console.log(data);

    return data.map((d, i) => (
        <Fragment key={d.id}>
            {i > 0 && <hr className="border-primary-700-300" />}
            <div className="mt-8 p-8 _uncontrolled grid md:grid-cols-[1fr_3fr] gap-8">
                <div className="overflow-hidden drop-shadow-hard-surface-100-900 mt-3">
                    <Link
                        className="hover:brightness-110"
                        params={{ id: d.id.toString() }}
                        to="/updates/$id"
                    >
                        <img
                            alt={d.title}
                            className="object-cover object-center mx-auto min-w-50 aspect-square"
                            height={300}
                            src={d.image}
                            width={300}
                        />
                    </Link>
                </div>
                <div>
                    <Link
                        className="text-surface-950-50 hover:text-surface-800-200"
                        params={{ id: d.id.toString() }}
                        to="/updates/$id"
                    >
                        <h1 className="m-0">{d.title}</h1>
                    </Link>
                    <time className="italic text-surface-700-300">
                        {utils.formatDate(d.publish_date, {
                            dateStyle: "long",
                        })}
                    </time>
                    <RichTextContent content={d.content} />
                </div>
            </div>
        </Fragment>
    ));
}
