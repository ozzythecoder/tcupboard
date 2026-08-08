import { api } from "#/config/api";
import { RichTextContent } from "#/features/editor";
import { TipTapContent } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ONE_DAY } from "#/utils/constants";

const introQueryOpts = queryOptions({
    queryKey: ['site_intro'] as const,
    queryFn: async () => {
        const response = await api.get<{ content: TipTapContent }>('globals/site-intro');
        console.log(response)
        return await response.json();
    },
    staleTime: ONE_DAY,
})

export function Intro() {
    const { data: intro, isFetching, error } = useQuery(introQueryOpts);

    if (isFetching) return <div>Loading...</div>;
    if (error || !intro) throw error;

    return (
        <div className="card p-4 _uncontrolled preset-glass-surface-200-800">
            <RichTextContent content={intro.content} />
        </div>
    );
}
