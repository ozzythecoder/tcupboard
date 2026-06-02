drop view if exists "public"."forum_messages_with_last_reply";

CREATE INDEX forum_messages_parent_created_at_desc ON public.forum_messages USING btree (parent_id, created_at DESC);

CREATE INDEX post_tags_post_id_idx ON public.post_tags USING btree (post_id);

CREATE INDEX post_tags_tag_id_idx ON public.post_tags USING btree (tag_id);

CREATE INDEX users_auth0_id_idx ON public.users USING btree (auth0_id);

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
    thread_authors.avatar_url AS author_avatar,
    COALESCE(thread_tags.tags, '[]'::json) AS tags,
    replies.latest_reply_date,
    replies.latest_reply_author,
    replies.latest_reply_author_id,
    replies.latest_reply_author_avatar,
    replies_count.reply_count AS "replyCount"
   FROM ((((public.forum_messages threads
     LEFT JOIN public.users thread_authors ON (((threads.auth0_id)::text = (thread_authors.auth0_id)::text)))
     LEFT JOIN ( SELECT pt.post_id,
            json_agg(json_build_object('id', t.id, 'name', t.name, 'description', t.description)) AS tags
           FROM (public.post_tags pt
             JOIN public.tags t ON ((pt.tag_id = t.id)))
          GROUP BY pt.post_id) thread_tags ON ((thread_tags.post_id = threads.id)))
     LEFT JOIN ( SELECT DISTINCT ON (m.parent_id) m.parent_id,
            m.auth0_id AS latest_reply_author_id,
            u.username AS latest_reply_author,
            u.avatar_url AS latest_reply_author_avatar,
            m.created_at AS latest_reply_date
           FROM (public.forum_messages m
             LEFT JOIN public.users u ON (((u.auth0_id)::text = (m.auth0_id)::text)))
          WHERE (m.parent_id IS NOT NULL)
          ORDER BY m.parent_id, m.created_at DESC) replies ON ((replies.parent_id = threads.id)))
     LEFT JOIN ( SELECT forum_messages.parent_id,
            count(*) AS reply_count
           FROM public.forum_messages
          WHERE (forum_messages.parent_id IS NOT NULL)
          GROUP BY forum_messages.parent_id) replies_count ON ((replies_count.parent_id = threads.id)))
  WHERE (threads.parent_id IS NULL)
  ORDER BY COALESCE(replies.latest_reply_date, threads.created_at) DESC;



