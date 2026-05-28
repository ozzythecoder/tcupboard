create or replace view "public"."forum_messages_with_last_reply" as  SELECT threads.id,
    threads.content,
    threads.auth0_id,
    threads.author,
    threads.category,
    threads.created_at,
    threads.updated_at,
    threads.is_edited,
    threads.parent_id,
    threads.is_thread_starter,
    threads.title,
    threads.reply_count,
    threads.last_reply_at,
    threads.views,
    threads.images,
    threads.is_imported,
    threads.imported_author_name,
    threads.imported_date,
    threads.imported_avatar_url,
    replies.latest_reply_date,
    replies.author AS latest_reply_author
   FROM (public.forum_messages threads
     LEFT JOIN ( SELECT DISTINCT ON (forum_messages.parent_id) forum_messages.parent_id,
            forum_messages.author,
            forum_messages.created_at AS latest_reply_date
           FROM public.forum_messages
          WHERE (forum_messages.parent_id IS NOT NULL)
          ORDER BY forum_messages.parent_id, forum_messages.created_at DESC) replies ON ((replies.parent_id = threads.id)))
  WHERE (threads.parent_id IS NULL)
  ORDER BY threads.id;



