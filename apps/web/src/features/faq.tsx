import type { GlobalFaqQuestion } from "@repo/shared";
import { RichTextContent } from "./editor";

export function SiteFaq({ questions }: { questions: GlobalFaqQuestion[] }) {
    return (
        <ul className="flex flex-col gap-6 mt-16">
            {questions.map((q) => (
                <li className="card preset-tonal-surface p-4" key={q.question}>
                    <div className="font-bold h3">{q.question}</div>
                    <hr className="hr my-4" />
                    <div className="_uncontrolled">
                        <RichTextContent content={q.answer} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
