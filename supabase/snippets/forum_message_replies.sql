drop function replies_by_thread;
create or replace function public.replies_by_thread(thread_id_in text)
returns setof public.message_with_author_data
as $$
begin
    return query select * from public.message_with_author_data where parent_id = thread_id_in::bigint order by created_at;
end;
$$
language plpgsql;

create or replace view public.message_with_author_data as
select fm.*, u.auth0_id as user_id, u.avatar_url as user_avatar_url, u.username as username
    from public.forum_messages fm
    left join public.users u on u.auth0_id = fm.auth0_id;

select * from replies_by_thread('118');
