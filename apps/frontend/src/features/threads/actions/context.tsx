import { createContext, use } from "react";

export interface IThreadActionContext {
    canDeletePostsBy: (author_id: string | number) => boolean;
    deleteThread: (thread_id: number, redirect: boolean) => Promise<unknown>;
}

export const ThreadActionContext = createContext<IThreadActionContext | undefined>(undefined);

export const useThreadActionsContext = () => {
    const ctx =  use(ThreadActionContext);  
    if (!ctx) {
        throw new Error('ThreadActionContext must be used within its provider')
    }
    return ctx;
} 
