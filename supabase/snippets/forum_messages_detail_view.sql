-- drop view public.forum_messages_with_last_reply;
-- create or replace view public.forum_messages_with_last_reply as 
select
  threads.*,
  thread_authors.avatar_url as author_avatar,
  coalesce(thread_tags.tags, '[]'::json) as tags,
  replies.latest_reply_date,
  replies.latest_reply_author,
  replies.latest_reply_author_id,
  replies.latest_reply_author_avatar,
  replies_count.reply_count as "replyCount"
from
  public.forum_messages as threads
  left join public.users as thread_authors on threads.auth0_id = thread_authors.auth0_id
  left join (
    select pt.post_id,
      json_agg(
        json_build_object(
          'id', t.id,
          'name', t.name,
          'description', t.description
        )
      ) as tags
    from public.post_tags pt
      join public.tags t on pt.tag_id = t.id
    group by pt.post_id
  ) as thread_tags on thread_tags.post_id = threads.id
  left join (
    select distinct
      on (m.parent_id) m.parent_id,
      m.auth0_id as latest_reply_author_id,
      u.username as latest_reply_author,
      u.avatar_url as latest_reply_author_avatar,
      m.created_at as latest_reply_date
    from
      public.forum_messages m
      left join public.users u on u.auth0_id = m.auth0_id
    where
      m.parent_id is not null
    order by
      m.parent_id,
      m.created_at desc
  ) as replies on replies.parent_id = threads.id
  left join (
    select
      parent_id,
      count(*) as reply_count
    from
      public.forum_messages
    where
      parent_id is not null
    group by
      parent_id
  ) as replies_count on replies_count.parent_id = threads.id
where
  threads.parent_id is null
order by
  coalesce(replies.latest_reply_date, threads.created_at) desc;