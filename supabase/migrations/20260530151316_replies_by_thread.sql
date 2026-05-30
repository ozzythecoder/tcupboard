set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.replies_by_thread(thread_id_in text)
 RETURNS SETOF public.forum_messages
 LANGUAGE plpgsql
AS $function$
begin
    return query select * from public.forum_messages where parent_id = thread_id_in::bigint;
end;
$function$
;


