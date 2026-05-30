create or replace function public.replies_by_thread(thread_id_in text)
returns setof public.forum_messages
as $$
begin
    return query select * from public.forum_messages where parent_id = thread_id_in::bigint;
end;
$$
language plpgsql;
