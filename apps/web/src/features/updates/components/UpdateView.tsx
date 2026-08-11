import type { TcupUpdate } from "@repo/shared";
import { Gutter } from "#/components/ui/Gutter";
import { RichTextContent } from "#/features/editor";
import { utils } from "#/utils/utils";

export function UpdateView({ data }: { data: TcupUpdate }) {
    return (
        <div className="flex flex-col gap-4 items-start mb-28">
            {data.image && (
                <img
                    alt={data.title}
                    className="mx-auto drop-shadow-2xl not-md:w-100"
                    height={500}
                    src={data.image}
                    width={800}
                />
            )}
            <h1 className="h1 mx-auto text-shadow-hard-surface-contrast-950-50">{data.title}</h1>
            <Gutter>
                <time className="italic text-surface-700-300 font-base text-xl">
                    {utils.formatDate(data.publish_date, {
                        dateStyle: "long",
                    })}
                </time>
                <div className="_uncontrolled">
                    <RichTextContent content={data.content} />
                </div>
            </Gutter>
        </div>
    );
}
