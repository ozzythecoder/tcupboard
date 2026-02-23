--
-- PostgreSQL database dump
--

\restrict EtQIS8ePDPS35oHLYYhMgi9gMbDVID5FRTYlCWbfdlEYejmOSZ8eQYFV7UgQLIR

-- Dumped from database version 16.11
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: development; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA development;


--
-- Name: production; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA production;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: update_modified_column(); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$;


--
-- Name: update_modified_column(); Type: FUNCTION; Schema: production; Owner: -
--

CREATE FUNCTION production.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$;


--
-- Name: clone_schema(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.clone_schema(source_schema text, dest_schema text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    objeto record;
BEGIN
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS ' || dest_schema;
    
    FOR objeto IN
        SELECT table_name::text
        FROM information_schema.tables 
        WHERE table_schema = source_schema
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'CREATE TABLE ' || dest_schema || '.' || objeto.table_name || ' (LIKE ' || source_schema || '.' || objeto.table_name || ' INCLUDING ALL)';
        EXECUTE 'INSERT INTO ' || dest_schema || '.' || objeto.table_name || ' OVERRIDING SYSTEM VALUE SELECT * FROM ' || source_schema || '.' || objeto.table_name;
    END LOOP;
END;
$$;


--
-- Name: get_special_venues(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_special_venues() RETURNS TABLE(venue character varying, cover_image text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RAISE NOTICE 'Function being executed';
    RETURN QUERY
    SELECT v.venue,
           CASE 
               WHEN v.venue = 'Xcel Energy Center' THEN 'https://res.cloudinary.com/dsll3ms2c/image/upload/v1734880040/xcelenergy_ubscbb.jpg'::text
               WHEN v.venue = 'The Fitzgerald Theater' THEN 'https://res.cloudinary.com/dsll3ms2c/image/upload/v1734880040/fitzgerald_prifme.jpg'::text
               WHEN v.venue = 'State Theatre' THEN 'https://res.cloudinary.com/dsll3ms2c/image/upload/v1734880040/state_znvtby.jpg'::text
               ELSE v.cover_image
           END as cover_image
    FROM public.venues v
    WHERE v.venue IN ('Xcel Energy Center', 'The Fitzgerald Theater', 'State Theatre');
END;
$$;


--
-- Name: mark_venue_shows_deleted(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.mark_venue_shows_deleted(venue_id_param integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE shows 
    SET is_deleted = TRUE 
    WHERE venue_id = venue_id_param 
    AND is_deleted = FALSE;
END;
$$;


--
-- Name: set_default_time_for_pilllar(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_default_time_for_pilllar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Check if the venue is 'Pilllar' and the time is NULL
  IF NEW.venue = 'Pilllar' AND NEW.time IS NULL THEN
    -- Set the time to '18:30:00' (6:30 PM)
    NEW.time := '18:30:00';
  END IF;
  -- Return the modified row
  RETURN NEW;
END;
$$;


--
-- Name: update_start_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_start_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Combine date and time into the 'start' column
  NEW.start := TO_TIMESTAMP(NEW.date || ' ' || NEW.time, 'YYYY-MM-DD HH24:MI:SS');
  RETURN NEW;
END;
$$;


--
-- Name: update_user(text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user(p_auth0_id text, p_username text, p_email text, p_avatar_url text, p_title text) RETURNS TABLE(auth0_id text, username text, email text, avatar_url text, title text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    UPDATE users 
    SET 
        username = COALESCE(p_username, username),
        email = COALESCE(p_email, email),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        title = COALESCE(p_title, title)
    WHERE auth0_id = p_auth0_id
    RETURNING auth0_id, username, email, avatar_url, title;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: band_admins; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_admins (
    id integer NOT NULL,
    band_id integer,
    auth0_id character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_admins_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_admins_id_seq OWNED BY development.band_admins.id;


--
-- Name: band_featured_content; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_featured_content (
    id integer NOT NULL,
    band_id integer,
    content_type character varying(50) NOT NULL,
    content_id integer,
    display_order integer
);


--
-- Name: band_featured_content_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_featured_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_featured_content_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_featured_content_id_seq OWNED BY development.band_featured_content.id;


--
-- Name: band_genres; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_genres (
    id integer NOT NULL,
    band_id integer,
    genre character varying(100) NOT NULL
);


--
-- Name: band_genres_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_genres_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_genres_id_seq OWNED BY development.band_genres.id;


--
-- Name: band_group_sizes; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_group_sizes (
    id integer NOT NULL,
    band_id integer,
    size_category character varying(50) NOT NULL
);


--
-- Name: band_group_sizes_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_group_sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_group_sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_group_sizes_id_seq OWNED BY development.band_group_sizes.id;


--
-- Name: band_images; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_images (
    id integer NOT NULL,
    band_id integer,
    image_url character varying(255) NOT NULL,
    caption character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_images_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_images_id_seq
    START WITH 21
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_images_id_seq1; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_images_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_images_id_seq1; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_images_id_seq1 OWNED BY development.band_images.id;


--
-- Name: band_influences; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_influences (
    id integer NOT NULL,
    band_id integer,
    influence character varying(255) NOT NULL
);


--
-- Name: band_influences_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_influences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_influences_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_influences_id_seq OWNED BY development.band_influences.id;


--
-- Name: band_media_embeds; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_media_embeds (
    id integer NOT NULL,
    band_id integer,
    media_type character varying(50) NOT NULL,
    embed_code text NOT NULL,
    description character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_media_embeds_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_media_embeds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_media_embeds_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_media_embeds_id_seq OWNED BY development.band_media_embeds.id;


--
-- Name: band_member_instruments; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_member_instruments (
    id integer NOT NULL,
    member_id integer,
    instrument character varying(100) NOT NULL
);


--
-- Name: band_member_instruments_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_member_instruments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_member_instruments_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_member_instruments_id_seq OWNED BY development.band_member_instruments.id;


--
-- Name: band_members; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_members (
    id integer NOT NULL,
    band_id integer,
    name character varying(100) NOT NULL,
    role character varying(100),
    bio text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_members_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_members_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_members_id_seq OWNED BY development.band_members.id;


--
-- Name: band_merch_types; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_merch_types (
    id integer NOT NULL,
    band_id integer,
    merch_type character varying(100) NOT NULL
);


--
-- Name: band_merch_types_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_merch_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_merch_types_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_merch_types_id_seq OWNED BY development.band_merch_types.id;


--
-- Name: band_open_positions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_open_positions (
    id integer NOT NULL,
    band_id integer,
    "position" character varying(100) NOT NULL
);


--
-- Name: band_open_positions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_open_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_open_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_open_positions_id_seq OWNED BY development.band_open_positions.id;


--
-- Name: band_performance_preferences; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_performance_preferences (
    id integer NOT NULL,
    band_id integer,
    venue_type character varying(100) NOT NULL
);


--
-- Name: band_performance_preferences_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_performance_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_performance_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_performance_preferences_id_seq OWNED BY development.band_performance_preferences.id;


--
-- Name: band_profile_badges; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_profile_badges (
    id integer NOT NULL,
    band_id integer,
    badge_type character varying(50) NOT NULL
);


--
-- Name: band_profile_badges_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_profile_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_profile_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_profile_badges_id_seq OWNED BY development.band_profile_badges.id;


--
-- Name: band_releases; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.band_releases (
    id integer NOT NULL,
    band_id integer,
    title character varying(255) NOT NULL,
    release_date date,
    type character varying(50),
    link character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_releases_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.band_releases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_releases_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.band_releases_id_seq OWNED BY development.band_releases.id;


--
-- Name: bands_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.bands_id_seq
    START WITH 34
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bands_new; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.bands_new (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(100),
    location character varying(255) NOT NULL,
    year_formed integer,
    origin_story text,
    bio text,
    profile_image character varying(255),
    looking_for_members boolean DEFAULT false,
    play_shows character varying(50),
    performance_notes text,
    has_merch boolean DEFAULT false,
    merch_url character varying(255),
    bandemail character varying(255),
    custom_slug character varying(100),
    profile_theme character varying(50) DEFAULT 'default'::character varying,
    header_layout character varying(50) DEFAULT 'classic'::character varying,
    background_pattern character varying(50) DEFAULT 'none'::character varying,
    background_image character varying(255),
    music_links jsonb DEFAULT '{}'::jsonb,
    social_links jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_draft boolean DEFAULT true,
    completion_status jsonb DEFAULT '{}'::jsonb
);


--
-- Name: bands_new_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.bands_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bands_new_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.bands_new_id_seq OWNED BY development.bands_new.id;


--
-- Name: favorites; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.favorites (
    id integer,
    user_id integer,
    band_id integer,
    created_at timestamp without time zone
);


--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.favorites_id_seq
    START WITH 11
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flyering_locations; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.flyering_locations (
    id integer NOT NULL,
    location character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    hours_monday character varying(50),
    hours_tuesday character varying(50),
    hours_wednesday character varying(50),
    hours_thursday character varying(50),
    hours_friday character varying(50),
    hours_saturday character varying(50),
    hours_sunday character varying(50)
);


--
-- Name: flyering_locations_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.flyering_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flyering_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.flyering_locations_id_seq OWNED BY development.flyering_locations.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.knex_migrations_id_seq OWNED BY development.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.knex_migrations_lock_index_seq OWNED BY development.knex_migrations_lock.index;


--
-- Name: musicians_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.musicians_id_seq
    START WITH 120
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.notifications (
    id integer NOT NULL,
    user_id text NOT NULL,
    post_id integer,
    actor_id text NOT NULL,
    type character varying(50) NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.notifications_id_seq OWNED BY development.notifications.id;


--
-- Name: people; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.people (
    id integer,
    name text,
    email text,
    bio text,
    profile_photo text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: peoplebands; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.peoplebands (
    id integer,
    person_id integer,
    band_id integer,
    created_at timestamp without time zone
);


--
-- Name: pledges; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.pledges (
    id integer,
    name character varying(255),
    bands character varying(255),
    signature_url text,
    photo_url text,
    final_image_url text,
    created_at timestamp without time zone,
    contact_name text,
    contact_email text,
    contact_phone text
);


--
-- Name: scraper_logs; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.scraper_logs (
    id integer NOT NULL,
    scraper_name character varying(255) NOT NULL,
    run_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    added_count integer DEFAULT 0,
    duplicate_count integer DEFAULT 0,
    skipped_count integer DEFAULT 0,
    added_shows json DEFAULT '[]'::json,
    errors json DEFAULT '[]'::json,
    raw_output json DEFAULT '{}'::json,
    updated_count integer,
    updated_shows json
);


--
-- Name: scraper_logs_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.scraper_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scraper_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.scraper_logs_id_seq OWNED BY development.scraper_logs.id;


--
-- Name: scraper_show_additions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.scraper_show_additions (
    id integer NOT NULL,
    scraper_log_id integer,
    show_id integer,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    show_name character varying(255),
    venue_name character varying(255),
    show_date timestamp with time zone
);


--
-- Name: scraper_show_additions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.scraper_show_additions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scraper_show_additions_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.scraper_show_additions_id_seq OWNED BY development.scraper_show_additions.id;


--
-- Name: session_musicians; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.session_musicians (
    id integer,
    name character varying(100),
    first_instrument character varying(100),
    second_instrument character varying(100),
    third_instrument character varying(100),
    primary_styles text,
    location character varying(100),
    contact_info character varying(255),
    website_samples text
);


--
-- Name: show_bands; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.show_bands (
    show_id integer,
    band_id integer
);


--
-- Name: show_calendar_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.show_calendar_id_seq
    START WITH 4978
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shows; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.shows (
    event_link character varying(1000),
    flyer_image text,
    id integer DEFAULT nextval('development.show_calendar_id_seq'::regclass) NOT NULL,
    start timestamp without time zone,
    venue_id integer,
    bands character varying(1000),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    age_restriction character varying(50),
    manual_override boolean DEFAULT false
);


--
-- Name: tcupbands; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.tcupbands (
    id integer NOT NULL,
    name text,
    social_links jsonb,
    genre jsonb,
    bandemail text,
    play_shows text,
    group_size jsonb,
    created_at timestamp with time zone,
    music_links jsonb,
    profile_image text,
    other_images jsonb,
    location text,
    bio text,
    slug text,
    claimed_by text,
    claimed_at timestamp with time zone
);


--
-- Name: tcupbands_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.tcupbands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tcupbands_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.tcupbands_id_seq OWNED BY development.tcupbands.id;


--
-- Name: updates; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.updates (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    auth0_id character varying(128) NOT NULL,
    is_published boolean DEFAULT true,
    content_json text,
    image_url character varying(255)
);


--
-- Name: updates_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: updates_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.updates_id_seq OWNED BY development.updates.id;


--
-- Name: user_shows; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.user_shows (
    id integer,
    user_id integer,
    show_id integer,
    created_at timestamp without time zone
);


--
-- Name: user_tcupbands; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.user_tcupbands (
    id integer,
    user_id integer,
    tcupband_id integer,
    relationship_type character varying(50),
    created_at timestamp without time zone
);


--
-- Name: users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.users (
    id integer NOT NULL,
    auth0_id character varying(255) NOT NULL,
    username character varying(255),
    avatar_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email text,
    tagline character varying,
    role character varying(20) DEFAULT 'user'::character varying,
    bio character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: venues; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.venues (
    id integer NOT NULL,
    venue character varying(100),
    location character varying(150),
    capacity text,
    cover_image text,
    contact text,
    notes text,
    parking text,
    accessibility text,
    owner text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.venues ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME development.venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vrc_drafts; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.vrc_drafts (
    id integer,
    user_id text,
    venue_id integer,
    form_data jsonb,
    last_modified timestamp with time zone,
    completed boolean
);


--
-- Name: vrc_results; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.vrc_results (
    id integer NOT NULL,
    venue_id integer,
    submitted_by text,
    submission_date timestamp with time zone DEFAULT now(),
    num_bands integer,
    band_size integer,
    attendance integer,
    ticket_price numeric(6,2),
    ticket_counts_communicated boolean,
    num_comp_tickets integer,
    is_event_series boolean,
    event_series_name text,
    payment_amount text,
    payment_rating numeric,
    payment_structure text,
    payment_structure_known_beforehand boolean,
    paid_day_of_show boolean,
    financial_breakdown_provided boolean,
    payment_notes text,
    mgmt_communication_rating numeric,
    booking_method text,
    booker_name text,
    venue_promoted_show boolean,
    felt_respected boolean,
    has_radius_clause boolean,
    radius_clause_details text,
    merch_cut_taken boolean,
    merch_cut_percentage numeric(4,1),
    mgmt_notes text,
    safety_rating numeric,
    has_security boolean,
    felt_comfortable boolean,
    experienced_discrimination boolean,
    discrimination_details text,
    wants_followup boolean,
    safety_notes text,
    sound_rating numeric,
    house_gear_condition text,
    gear_storage_available boolean,
    sound_notes text,
    hospitality_rating numeric,
    drink_tickets_provided boolean,
    green_room_available boolean,
    food_provided boolean,
    hospitality_notes text,
    overall_rating numeric,
    would_play_again boolean,
    would_recommend boolean,
    improvement_suggestions text,
    overall_notes text,
    submitter_name text,
    submitter_email text,
    submitter_phone text,
    is_touring_musician boolean,
    would_return_to_mn boolean,
    ok_to_contact boolean,
    is_anonymous boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    last_modified timestamp with time zone DEFAULT now(),
    date_of_performance timestamp with time zone
);


--
-- Name: vrc_results_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.vrc_results ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.vrc_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: band_admins; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_admins (
    id integer NOT NULL,
    band_id integer,
    auth0_id character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_admins_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_admins_id_seq OWNED BY production.band_admins.id;


--
-- Name: band_featured_content; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_featured_content (
    id integer NOT NULL,
    band_id integer,
    content_type character varying(50) NOT NULL,
    content_id integer,
    display_order integer
);


--
-- Name: band_featured_content_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_featured_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_featured_content_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_featured_content_id_seq OWNED BY production.band_featured_content.id;


--
-- Name: band_genres; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_genres (
    id integer NOT NULL,
    band_id integer,
    genre character varying(100) NOT NULL
);


--
-- Name: band_genres_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_genres_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_genres_id_seq OWNED BY production.band_genres.id;


--
-- Name: band_group_sizes; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_group_sizes (
    id integer NOT NULL,
    band_id integer,
    size_category character varying(50) NOT NULL
);


--
-- Name: band_group_sizes_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_group_sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_group_sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_group_sizes_id_seq OWNED BY production.band_group_sizes.id;


--
-- Name: band_images; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_images (
    id integer NOT NULL,
    band_id integer,
    image_url character varying(255) NOT NULL,
    caption character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_images_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_images_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_images_id_seq OWNED BY production.band_images.id;


--
-- Name: band_influences; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_influences (
    id integer NOT NULL,
    band_id integer,
    influence character varying(255) NOT NULL
);


--
-- Name: band_influences_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_influences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_influences_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_influences_id_seq OWNED BY production.band_influences.id;


--
-- Name: band_media_embeds; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_media_embeds (
    id integer NOT NULL,
    band_id integer,
    media_type character varying(50) NOT NULL,
    embed_code text NOT NULL,
    description character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_media_embeds_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_media_embeds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_media_embeds_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_media_embeds_id_seq OWNED BY production.band_media_embeds.id;


--
-- Name: band_member_instruments; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_member_instruments (
    id integer NOT NULL,
    member_id integer,
    instrument character varying(100) NOT NULL
);


--
-- Name: band_member_instruments_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_member_instruments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_member_instruments_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_member_instruments_id_seq OWNED BY production.band_member_instruments.id;


--
-- Name: band_members; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_members (
    id integer NOT NULL,
    band_id integer,
    name character varying(100) NOT NULL,
    role character varying(100),
    bio text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_members_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_members_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_members_id_seq OWNED BY production.band_members.id;


--
-- Name: band_merch_types; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_merch_types (
    id integer NOT NULL,
    band_id integer,
    merch_type character varying(100) NOT NULL
);


--
-- Name: band_merch_types_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_merch_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_merch_types_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_merch_types_id_seq OWNED BY production.band_merch_types.id;


--
-- Name: band_open_positions; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_open_positions (
    id integer NOT NULL,
    band_id integer,
    "position" character varying(100) NOT NULL
);


--
-- Name: band_open_positions_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_open_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_open_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_open_positions_id_seq OWNED BY production.band_open_positions.id;


--
-- Name: band_performance_preferences; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_performance_preferences (
    id integer NOT NULL,
    band_id integer,
    venue_type character varying(100) NOT NULL
);


--
-- Name: band_performance_preferences_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_performance_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_performance_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_performance_preferences_id_seq OWNED BY production.band_performance_preferences.id;


--
-- Name: band_profile_badges; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_profile_badges (
    id integer NOT NULL,
    band_id integer,
    badge_type character varying(50) NOT NULL
);


--
-- Name: band_profile_badges_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_profile_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_profile_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_profile_badges_id_seq OWNED BY production.band_profile_badges.id;


--
-- Name: band_releases; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.band_releases (
    id integer NOT NULL,
    band_id integer,
    title character varying(255) NOT NULL,
    release_date date,
    type character varying(50),
    link character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: band_releases_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.band_releases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: band_releases_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.band_releases_id_seq OWNED BY production.band_releases.id;


--
-- Name: bands_new; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.bands_new (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(100),
    location character varying(255) NOT NULL,
    year_formed integer,
    origin_story text,
    bio text,
    profile_image character varying(255),
    looking_for_members boolean DEFAULT false,
    play_shows character varying(50),
    performance_notes text,
    has_merch boolean DEFAULT false,
    merch_url character varying(255),
    bandemail character varying(255),
    custom_slug character varying(100),
    profile_theme character varying(50) DEFAULT 'default'::character varying,
    header_layout character varying(50) DEFAULT 'classic'::character varying,
    background_pattern character varying(50) DEFAULT 'none'::character varying,
    background_image character varying(255),
    music_links jsonb DEFAULT '{}'::jsonb,
    social_links jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_draft boolean DEFAULT true,
    completion_status jsonb DEFAULT '{}'::jsonb
);


--
-- Name: bands_new_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.bands_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bands_new_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.bands_new_id_seq OWNED BY production.bands_new.id;


--
-- Name: favorites; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.favorites (
    id integer,
    user_id integer,
    band_id integer,
    created_at timestamp without time zone
);


--
-- Name: flyering_locations; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.flyering_locations (
    id integer NOT NULL,
    location character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    hours_monday character varying(50),
    hours_tuesday character varying(50),
    hours_wednesday character varying(50),
    hours_thursday character varying(50),
    hours_friday character varying(50),
    hours_saturday character varying(50),
    hours_sunday character varying(50)
);


--
-- Name: flyering_locations_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.flyering_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flyering_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.flyering_locations_id_seq OWNED BY production.flyering_locations.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.knex_migrations_id_seq OWNED BY production.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.knex_migrations_lock_index_seq OWNED BY production.knex_migrations_lock.index;


--
-- Name: notifications; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.notifications (
)
INHERITS (development.notifications);


--
-- Name: people; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.people (
    id integer,
    name text,
    email text,
    bio text,
    profile_photo text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: peoplebands; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.peoplebands (
    id integer,
    person_id integer,
    band_id integer,
    created_at timestamp without time zone
);


--
-- Name: pledges; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.pledges (
    id integer,
    name character varying(255),
    bands character varying(255),
    signature_url text,
    photo_url text,
    final_image_url text,
    created_at timestamp without time zone,
    contact_name text,
    contact_email text,
    contact_phone text
);


--
-- Name: session_musicians; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.session_musicians (
    id integer NOT NULL,
    name text,
    first_instrument text,
    second_instrument text,
    third_instrument text,
    primary_styles text,
    location text,
    contact_info text,
    website_samples text
);


--
-- Name: show_bands; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.show_bands (
    show_id integer,
    band_id integer
);


--
-- Name: shows_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.shows_id_seq
    START WITH 5042
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shows; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.shows (
    event_link character varying(1000),
    flyer_image text,
    id integer DEFAULT nextval('production.shows_id_seq'::regclass) NOT NULL,
    start timestamp without time zone,
    venue_id integer,
    bands character varying(1000),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    age_restriction character varying(50),
    manual_override boolean DEFAULT false
);


--
-- Name: tcupbands; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.tcupbands (
    id integer DEFAULT nextval('development.tcupbands_id_seq'::regclass) NOT NULL,
    name text,
    social_links jsonb,
    genre jsonb,
    bandemail text,
    play_shows text,
    group_size jsonb,
    created_at timestamp with time zone,
    music_links jsonb,
    profile_image text,
    other_images jsonb,
    location text,
    bio text,
    slug text,
    claimed_by text,
    claimed_at timestamp with time zone
);


--
-- Name: updates; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.updates (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    auth0_id character varying(128) NOT NULL,
    is_published boolean DEFAULT true,
    content_json text,
    image_url character varying(255)
);


--
-- Name: updates_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

CREATE SEQUENCE production.updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: updates_id_seq; Type: SEQUENCE OWNED BY; Schema: production; Owner: -
--

ALTER SEQUENCE production.updates_id_seq OWNED BY production.updates.id;


--
-- Name: user_shows; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.user_shows (
    id integer,
    user_id integer,
    show_id integer,
    created_at timestamp without time zone
);


--
-- Name: user_tcupbands; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.user_tcupbands (
    id integer,
    user_id integer,
    tcupband_id integer,
    relationship_type character varying(50),
    created_at timestamp without time zone
);


--
-- Name: users; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.users (
    id integer NOT NULL,
    auth0_id character varying(255) NOT NULL,
    username character varying(255),
    avatar_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email text,
    role character varying(20) DEFAULT 'user'::character varying,
    tagline character varying,
    bio character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

ALTER TABLE production.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME production.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1
);


--
-- Name: venues; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.venues (
    id integer NOT NULL,
    venue character varying(100),
    location character varying(150),
    capacity text,
    cover_image text,
    contact text,
    notes text,
    parking text,
    accessibility text,
    owner text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

ALTER TABLE production.venues ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME production.venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1
);


--
-- Name: vrc_drafts; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.vrc_drafts (
    id integer,
    user_id text,
    venue_id integer,
    form_data jsonb,
    last_modified timestamp with time zone,
    completed boolean
);


--
-- Name: vrc_results; Type: TABLE; Schema: production; Owner: -
--

CREATE TABLE production.vrc_results (
    id integer NOT NULL,
    venue_id integer,
    submitted_by text,
    submission_date timestamp with time zone DEFAULT now(),
    num_bands integer,
    band_size integer,
    attendance integer,
    ticket_price numeric(6,2),
    ticket_counts_communicated boolean,
    num_comp_tickets integer,
    is_event_series boolean,
    event_series_name text,
    payment_amount text,
    payment_rating numeric,
    payment_structure text,
    payment_structure_known_beforehand boolean,
    paid_day_of_show boolean,
    financial_breakdown_provided boolean,
    payment_notes text,
    mgmt_communication_rating numeric,
    booking_method text,
    booker_name text,
    venue_promoted_show boolean,
    felt_respected boolean,
    has_radius_clause boolean,
    radius_clause_details text,
    merch_cut_taken boolean,
    merch_cut_percentage numeric(4,1),
    mgmt_notes text,
    safety_rating numeric,
    has_security boolean,
    felt_comfortable boolean,
    experienced_discrimination boolean,
    discrimination_details text,
    wants_followup boolean,
    safety_notes text,
    sound_rating numeric,
    house_gear_condition text,
    gear_storage_available boolean,
    sound_notes text,
    hospitality_rating numeric,
    drink_tickets_provided boolean,
    green_room_available boolean,
    food_provided boolean,
    hospitality_notes text,
    overall_rating numeric,
    would_play_again boolean,
    would_recommend boolean,
    improvement_suggestions text,
    overall_notes text,
    submitter_name text,
    submitter_email text,
    submitter_phone text,
    is_touring_musician boolean,
    would_return_to_mn boolean,
    ok_to_contact boolean,
    is_anonymous boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    last_modified timestamp with time zone DEFAULT now(),
    date_of_performance timestamp with time zone
);


--
-- Name: vrc_results_id_seq; Type: SEQUENCE; Schema: production; Owner: -
--

ALTER TABLE production.vrc_results ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME production.vrc_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    band_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: session_musicians; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_musicians (
    id integer NOT NULL,
    name character varying(100),
    first_instrument character varying(100),
    second_instrument character varying(100),
    third_instrument character varying(100),
    primary_styles text,
    location character varying(100),
    contact_info character varying(255),
    website_samples text
);


--
-- Name: musicians_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.musicians_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: musicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.musicians_id_seq OWNED BY public.session_musicians.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id text NOT NULL,
    post_id integer,
    actor_id text NOT NULL,
    type character varying(50) NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.people (
    id integer NOT NULL,
    name text NOT NULL,
    email text,
    bio text,
    profile_photo text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.people_id_seq OWNED BY public.people.id;


--
-- Name: peoplebands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peoplebands (
    id integer NOT NULL,
    person_id integer,
    band_id integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: peoplebands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.peoplebands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: peoplebands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.peoplebands_id_seq OWNED BY public.peoplebands.id;


--
-- Name: pledges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pledges (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    bands character varying(255),
    signature_url text,
    photo_url text,
    final_image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: pledges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pledges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pledges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pledges_id_seq OWNED BY public.pledges.id;


--
-- Name: scraper_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scraper_logs (
    id integer NOT NULL,
    scraper_name character varying(255) NOT NULL,
    run_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    added_count integer DEFAULT 0,
    duplicate_count integer DEFAULT 0,
    skipped_count integer DEFAULT 0,
    added_shows json DEFAULT '[]'::json,
    errors json DEFAULT '[]'::json,
    raw_output json DEFAULT '{}'::json
);


--
-- Name: scraper_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scraper_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scraper_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scraper_logs_id_seq OWNED BY public.scraper_logs.id;


--
-- Name: scraper_show_additions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scraper_show_additions (
    id integer NOT NULL,
    scraper_log_id integer,
    show_id integer,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    show_name character varying(255),
    venue_name character varying(255),
    show_date timestamp with time zone
);


--
-- Name: scraper_show_additions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scraper_show_additions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scraper_show_additions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scraper_show_additions_id_seq OWNED BY public.scraper_show_additions.id;


--
-- Name: show_bands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.show_bands (
    show_id integer NOT NULL,
    band_id integer NOT NULL
);


--
-- Name: shows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shows (
    event_link character varying(1000),
    flyer_image text,
    id integer NOT NULL,
    start timestamp without time zone,
    venue_id integer,
    bands character varying(1000),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


--
-- Name: shows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shows_id_seq OWNED BY public.shows.id;


--
-- Name: tcupbands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tcupbands (
    id integer NOT NULL,
    name text NOT NULL,
    social_links jsonb,
    genre text[],
    bandemail text,
    play_shows character varying(20),
    group_size text[] DEFAULT ARRAY[]::text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    music_links jsonb,
    profile_image text,
    other_images text[],
    location text,
    bio text,
    slug character varying(255) NOT NULL,
    claimed_by text,
    claimed_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


--
-- Name: tcupbands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tcupbands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tcupbands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tcupbands_id_seq OWNED BY public.tcupbands.id;


--
-- Name: user_shows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_shows (
    id integer NOT NULL,
    user_id integer,
    show_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_shows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_shows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_shows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_shows_id_seq OWNED BY public.user_shows.id;


--
-- Name: user_tcupbands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_tcupbands (
    id integer NOT NULL,
    user_id integer,
    tcupband_id integer,
    relationship_type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_tcupbands_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_tcupbands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_tcupbands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_tcupbands_id_seq OWNED BY public.user_tcupbands.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    auth0_id character varying(255) NOT NULL,
    username character varying(255),
    avatar_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    venue character varying(100),
    location character varying(150),
    capacity text,
    cover_image text,
    contact text,
    notes text,
    parking text,
    accessibility text,
    owner text,
    rating text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: venues_new_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.venues ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.venues_new_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: vrc_drafts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vrc_drafts (
    id integer NOT NULL,
    user_id text NOT NULL,
    venue_id integer,
    form_data jsonb NOT NULL,
    last_modified timestamp with time zone DEFAULT now(),
    completed boolean DEFAULT false
);


--
-- Name: vrc_drafts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vrc_drafts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vrc_drafts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vrc_drafts_id_seq OWNED BY public.vrc_drafts.id;


--
-- Name: vrc_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vrc_results (
    id integer NOT NULL,
    venue_id integer,
    submitted_by text,
    submission_date timestamp with time zone DEFAULT now(),
    num_bands integer,
    band_size integer,
    attendance integer,
    ticket_price numeric(6,2),
    ticket_counts_communicated boolean,
    num_comp_tickets integer,
    is_event_series boolean,
    event_series_name text,
    payment_amount text,
    payment_rating numeric,
    payment_structure text,
    payment_structure_known_beforehand boolean,
    paid_day_of_show boolean,
    financial_breakdown_provided boolean,
    payment_notes text,
    mgmt_communication_rating numeric,
    booking_method text,
    booker_name text,
    venue_promoted_show boolean,
    felt_respected boolean,
    has_radius_clause boolean,
    radius_clause_details text,
    merch_cut_taken boolean,
    merch_cut_percentage numeric(4,1),
    mgmt_notes text,
    safety_rating numeric,
    has_security boolean,
    felt_comfortable boolean,
    experienced_discrimination boolean,
    discrimination_details text,
    wants_followup boolean,
    safety_notes text,
    sound_rating numeric,
    house_gear_condition text,
    gear_storage_available boolean,
    sound_notes text,
    hospitality_rating numeric,
    drink_tickets_provided boolean,
    green_room_available boolean,
    food_provided boolean,
    hospitality_notes text,
    overall_rating numeric,
    would_play_again boolean,
    would_recommend boolean,
    improvement_suggestions text,
    overall_notes text,
    submitter_name text,
    submitter_email text,
    submitter_phone text,
    is_touring_musician boolean,
    would_return_to_mn boolean,
    ok_to_contact boolean,
    is_anonymous boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    last_modified timestamp with time zone DEFAULT now(),
    date_of_performance timestamp with time zone,
    CONSTRAINT vrc_results_hospitality_rating_check CHECK (((hospitality_rating >= (1)::numeric) AND (hospitality_rating <= (5)::numeric))),
    CONSTRAINT vrc_results_mgmt_communication_rating_check CHECK (((mgmt_communication_rating >= (1)::numeric) AND (mgmt_communication_rating <= (5)::numeric))),
    CONSTRAINT vrc_results_overall_rating_check CHECK (((overall_rating >= (1)::numeric) AND (overall_rating <= (5)::numeric))),
    CONSTRAINT vrc_results_payment_rating_check CHECK (((payment_rating >= (1)::numeric) AND (payment_rating <= (5)::numeric))),
    CONSTRAINT vrc_results_safety_rating_check CHECK (((safety_rating >= (1)::numeric) AND (safety_rating <= (5)::numeric))),
    CONSTRAINT vrc_results_sound_rating_check CHECK (((sound_rating >= (1)::numeric) AND (sound_rating <= (5)::numeric)))
);


--
-- Name: vrc_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vrc_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vrc_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vrc_results_id_seq OWNED BY public.vrc_results.id;


--
-- Name: band_admins id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_admins ALTER COLUMN id SET DEFAULT nextval('development.band_admins_id_seq'::regclass);


--
-- Name: band_featured_content id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_featured_content ALTER COLUMN id SET DEFAULT nextval('development.band_featured_content_id_seq'::regclass);


--
-- Name: band_genres id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_genres ALTER COLUMN id SET DEFAULT nextval('development.band_genres_id_seq'::regclass);


--
-- Name: band_group_sizes id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_group_sizes ALTER COLUMN id SET DEFAULT nextval('development.band_group_sizes_id_seq'::regclass);


--
-- Name: band_images id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_images ALTER COLUMN id SET DEFAULT nextval('development.band_images_id_seq1'::regclass);


--
-- Name: band_influences id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_influences ALTER COLUMN id SET DEFAULT nextval('development.band_influences_id_seq'::regclass);


--
-- Name: band_media_embeds id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_media_embeds ALTER COLUMN id SET DEFAULT nextval('development.band_media_embeds_id_seq'::regclass);


--
-- Name: band_member_instruments id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_member_instruments ALTER COLUMN id SET DEFAULT nextval('development.band_member_instruments_id_seq'::regclass);


--
-- Name: band_members id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_members ALTER COLUMN id SET DEFAULT nextval('development.band_members_id_seq'::regclass);


--
-- Name: band_merch_types id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_merch_types ALTER COLUMN id SET DEFAULT nextval('development.band_merch_types_id_seq'::regclass);


--
-- Name: band_open_positions id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_open_positions ALTER COLUMN id SET DEFAULT nextval('development.band_open_positions_id_seq'::regclass);


--
-- Name: band_performance_preferences id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_performance_preferences ALTER COLUMN id SET DEFAULT nextval('development.band_performance_preferences_id_seq'::regclass);


--
-- Name: band_profile_badges id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_profile_badges ALTER COLUMN id SET DEFAULT nextval('development.band_profile_badges_id_seq'::regclass);


--
-- Name: band_releases id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_releases ALTER COLUMN id SET DEFAULT nextval('development.band_releases_id_seq'::regclass);


--
-- Name: bands_new id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.bands_new ALTER COLUMN id SET DEFAULT nextval('development.bands_new_id_seq'::regclass);


--
-- Name: flyering_locations id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.flyering_locations ALTER COLUMN id SET DEFAULT nextval('development.flyering_locations_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.knex_migrations ALTER COLUMN id SET DEFAULT nextval('development.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('development.knex_migrations_lock_index_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.notifications ALTER COLUMN id SET DEFAULT nextval('development.notifications_id_seq'::regclass);


--
-- Name: scraper_logs id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.scraper_logs ALTER COLUMN id SET DEFAULT nextval('development.scraper_logs_id_seq'::regclass);


--
-- Name: scraper_show_additions id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.scraper_show_additions ALTER COLUMN id SET DEFAULT nextval('development.scraper_show_additions_id_seq'::regclass);


--
-- Name: tcupbands id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.tcupbands ALTER COLUMN id SET DEFAULT nextval('development.tcupbands_id_seq'::regclass);


--
-- Name: updates id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.updates ALTER COLUMN id SET DEFAULT nextval('development.updates_id_seq'::regclass);


--
-- Name: band_admins id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_admins ALTER COLUMN id SET DEFAULT nextval('production.band_admins_id_seq'::regclass);


--
-- Name: band_featured_content id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_featured_content ALTER COLUMN id SET DEFAULT nextval('production.band_featured_content_id_seq'::regclass);


--
-- Name: band_genres id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_genres ALTER COLUMN id SET DEFAULT nextval('production.band_genres_id_seq'::regclass);


--
-- Name: band_group_sizes id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_group_sizes ALTER COLUMN id SET DEFAULT nextval('production.band_group_sizes_id_seq'::regclass);


--
-- Name: band_images id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_images ALTER COLUMN id SET DEFAULT nextval('production.band_images_id_seq'::regclass);


--
-- Name: band_influences id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_influences ALTER COLUMN id SET DEFAULT nextval('production.band_influences_id_seq'::regclass);


--
-- Name: band_media_embeds id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_media_embeds ALTER COLUMN id SET DEFAULT nextval('production.band_media_embeds_id_seq'::regclass);


--
-- Name: band_member_instruments id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_member_instruments ALTER COLUMN id SET DEFAULT nextval('production.band_member_instruments_id_seq'::regclass);


--
-- Name: band_members id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_members ALTER COLUMN id SET DEFAULT nextval('production.band_members_id_seq'::regclass);


--
-- Name: band_merch_types id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_merch_types ALTER COLUMN id SET DEFAULT nextval('production.band_merch_types_id_seq'::regclass);


--
-- Name: band_open_positions id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_open_positions ALTER COLUMN id SET DEFAULT nextval('production.band_open_positions_id_seq'::regclass);


--
-- Name: band_performance_preferences id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_performance_preferences ALTER COLUMN id SET DEFAULT nextval('production.band_performance_preferences_id_seq'::regclass);


--
-- Name: band_profile_badges id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_profile_badges ALTER COLUMN id SET DEFAULT nextval('production.band_profile_badges_id_seq'::regclass);


--
-- Name: band_releases id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_releases ALTER COLUMN id SET DEFAULT nextval('production.band_releases_id_seq'::regclass);


--
-- Name: bands_new id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.bands_new ALTER COLUMN id SET DEFAULT nextval('production.bands_new_id_seq'::regclass);


--
-- Name: flyering_locations id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.flyering_locations ALTER COLUMN id SET DEFAULT nextval('production.flyering_locations_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.knex_migrations ALTER COLUMN id SET DEFAULT nextval('production.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('production.knex_migrations_lock_index_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.notifications ALTER COLUMN id SET DEFAULT nextval('development.notifications_id_seq'::regclass);


--
-- Name: notifications is_read; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.notifications ALTER COLUMN is_read SET DEFAULT false;


--
-- Name: notifications created_at; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.notifications ALTER COLUMN created_at SET DEFAULT now();


--
-- Name: updates id; Type: DEFAULT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.updates ALTER COLUMN id SET DEFAULT nextval('production.updates_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: people id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.people ALTER COLUMN id SET DEFAULT nextval('public.people_id_seq'::regclass);


--
-- Name: peoplebands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peoplebands ALTER COLUMN id SET DEFAULT nextval('public.peoplebands_id_seq'::regclass);


--
-- Name: pledges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pledges ALTER COLUMN id SET DEFAULT nextval('public.pledges_id_seq'::regclass);


--
-- Name: scraper_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scraper_logs ALTER COLUMN id SET DEFAULT nextval('public.scraper_logs_id_seq'::regclass);


--
-- Name: scraper_show_additions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scraper_show_additions ALTER COLUMN id SET DEFAULT nextval('public.scraper_show_additions_id_seq'::regclass);


--
-- Name: session_musicians id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_musicians ALTER COLUMN id SET DEFAULT nextval('public.musicians_id_seq'::regclass);


--
-- Name: shows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shows ALTER COLUMN id SET DEFAULT nextval('public.shows_id_seq'::regclass);


--
-- Name: tcupbands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tcupbands ALTER COLUMN id SET DEFAULT nextval('public.tcupbands_id_seq'::regclass);


--
-- Name: user_shows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shows ALTER COLUMN id SET DEFAULT nextval('public.user_shows_id_seq'::regclass);


--
-- Name: user_tcupbands id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tcupbands ALTER COLUMN id SET DEFAULT nextval('public.user_tcupbands_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vrc_drafts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vrc_drafts ALTER COLUMN id SET DEFAULT nextval('public.vrc_drafts_id_seq'::regclass);


--
-- Name: vrc_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vrc_results ALTER COLUMN id SET DEFAULT nextval('public.vrc_results_id_seq'::regclass);


--
-- Name: band_admins band_admins_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_admins
    ADD CONSTRAINT band_admins_pkey PRIMARY KEY (id);


--
-- Name: band_featured_content band_featured_content_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_featured_content
    ADD CONSTRAINT band_featured_content_pkey PRIMARY KEY (id);


--
-- Name: band_genres band_genres_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_genres
    ADD CONSTRAINT band_genres_pkey PRIMARY KEY (id);


--
-- Name: band_group_sizes band_group_sizes_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_group_sizes
    ADD CONSTRAINT band_group_sizes_pkey PRIMARY KEY (id);


--
-- Name: band_images band_images_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_images
    ADD CONSTRAINT band_images_pkey PRIMARY KEY (id);


--
-- Name: band_influences band_influences_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_influences
    ADD CONSTRAINT band_influences_pkey PRIMARY KEY (id);


--
-- Name: band_media_embeds band_media_embeds_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_media_embeds
    ADD CONSTRAINT band_media_embeds_pkey PRIMARY KEY (id);


--
-- Name: band_member_instruments band_member_instruments_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_member_instruments
    ADD CONSTRAINT band_member_instruments_pkey PRIMARY KEY (id);


--
-- Name: band_members band_members_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_members
    ADD CONSTRAINT band_members_pkey PRIMARY KEY (id);


--
-- Name: band_merch_types band_merch_types_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_merch_types
    ADD CONSTRAINT band_merch_types_pkey PRIMARY KEY (id);


--
-- Name: band_open_positions band_open_positions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_open_positions
    ADD CONSTRAINT band_open_positions_pkey PRIMARY KEY (id);


--
-- Name: band_performance_preferences band_performance_preferences_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_performance_preferences
    ADD CONSTRAINT band_performance_preferences_pkey PRIMARY KEY (id);


--
-- Name: band_profile_badges band_profile_badges_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_profile_badges
    ADD CONSTRAINT band_profile_badges_pkey PRIMARY KEY (id);


--
-- Name: band_releases band_releases_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_releases
    ADD CONSTRAINT band_releases_pkey PRIMARY KEY (id);


--
-- Name: bands_new bands_new_custom_slug_unique; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.bands_new
    ADD CONSTRAINT bands_new_custom_slug_unique UNIQUE (custom_slug);


--
-- Name: bands_new bands_new_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.bands_new
    ADD CONSTRAINT bands_new_pkey PRIMARY KEY (id);


--
-- Name: bands_new bands_new_slug_unique; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.bands_new
    ADD CONSTRAINT bands_new_slug_unique UNIQUE (slug);


--
-- Name: flyering_locations flyering_locations_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.flyering_locations
    ADD CONSTRAINT flyering_locations_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: scraper_logs scraper_logs_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.scraper_logs
    ADD CONSTRAINT scraper_logs_pkey PRIMARY KEY (id);


--
-- Name: scraper_show_additions scraper_show_additions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.scraper_show_additions
    ADD CONSTRAINT scraper_show_additions_pkey PRIMARY KEY (id);


--
-- Name: shows shows_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (id);


--
-- Name: shows shows_venue_id_start_key; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.shows
    ADD CONSTRAINT shows_venue_id_start_key UNIQUE (venue_id, start);


--
-- Name: tcupbands tcupbands_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.tcupbands
    ADD CONSTRAINT tcupbands_pkey PRIMARY KEY (id);


--
-- Name: shows unique_show; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.shows
    ADD CONSTRAINT unique_show UNIQUE (venue_id, start);


--
-- Name: updates updates_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.updates
    ADD CONSTRAINT updates_pkey PRIMARY KEY (id);


--
-- Name: users users_auth0_id_key; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.users
    ADD CONSTRAINT users_auth0_id_key UNIQUE (auth0_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: vrc_results vrc_results_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.vrc_results
    ADD CONSTRAINT vrc_results_pkey PRIMARY KEY (id);


--
-- Name: band_admins band_admins_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_admins
    ADD CONSTRAINT band_admins_pkey PRIMARY KEY (id);


--
-- Name: band_featured_content band_featured_content_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_featured_content
    ADD CONSTRAINT band_featured_content_pkey PRIMARY KEY (id);


--
-- Name: band_genres band_genres_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_genres
    ADD CONSTRAINT band_genres_pkey PRIMARY KEY (id);


--
-- Name: band_group_sizes band_group_sizes_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_group_sizes
    ADD CONSTRAINT band_group_sizes_pkey PRIMARY KEY (id);


--
-- Name: band_images band_images_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_images
    ADD CONSTRAINT band_images_pkey PRIMARY KEY (id);


--
-- Name: band_influences band_influences_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_influences
    ADD CONSTRAINT band_influences_pkey PRIMARY KEY (id);


--
-- Name: band_media_embeds band_media_embeds_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_media_embeds
    ADD CONSTRAINT band_media_embeds_pkey PRIMARY KEY (id);


--
-- Name: band_member_instruments band_member_instruments_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_member_instruments
    ADD CONSTRAINT band_member_instruments_pkey PRIMARY KEY (id);


--
-- Name: band_members band_members_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_members
    ADD CONSTRAINT band_members_pkey PRIMARY KEY (id);


--
-- Name: band_merch_types band_merch_types_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_merch_types
    ADD CONSTRAINT band_merch_types_pkey PRIMARY KEY (id);


--
-- Name: band_open_positions band_open_positions_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_open_positions
    ADD CONSTRAINT band_open_positions_pkey PRIMARY KEY (id);


--
-- Name: band_performance_preferences band_performance_preferences_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_performance_preferences
    ADD CONSTRAINT band_performance_preferences_pkey PRIMARY KEY (id);


--
-- Name: band_profile_badges band_profile_badges_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_profile_badges
    ADD CONSTRAINT band_profile_badges_pkey PRIMARY KEY (id);


--
-- Name: band_releases band_releases_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_releases
    ADD CONSTRAINT band_releases_pkey PRIMARY KEY (id);


--
-- Name: bands_new bands_new_custom_slug_unique; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.bands_new
    ADD CONSTRAINT bands_new_custom_slug_unique UNIQUE (custom_slug);


--
-- Name: bands_new bands_new_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.bands_new
    ADD CONSTRAINT bands_new_pkey PRIMARY KEY (id);


--
-- Name: bands_new bands_new_slug_unique; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.bands_new
    ADD CONSTRAINT bands_new_slug_unique UNIQUE (slug);


--
-- Name: flyering_locations flyering_locations_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.flyering_locations
    ADD CONSTRAINT flyering_locations_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: session_musicians session_musicians_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.session_musicians
    ADD CONSTRAINT session_musicians_pkey PRIMARY KEY (id);


--
-- Name: shows shows_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (id);


--
-- Name: shows shows_venue_id_start_key; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.shows
    ADD CONSTRAINT shows_venue_id_start_key UNIQUE (venue_id, start);


--
-- Name: tcupbands tcupbands_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.tcupbands
    ADD CONSTRAINT tcupbands_pkey PRIMARY KEY (id);


--
-- Name: shows unique_show; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.shows
    ADD CONSTRAINT unique_show UNIQUE (venue_id, start);


--
-- Name: updates updates_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.updates
    ADD CONSTRAINT updates_pkey PRIMARY KEY (id);


--
-- Name: users users_auth0_id_key; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.users
    ADD CONSTRAINT users_auth0_id_key UNIQUE (auth0_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: vrc_results vrc_results_pkey; Type: CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.vrc_results
    ADD CONSTRAINT vrc_results_pkey PRIMARY KEY (id);


--
-- Name: shows Show Calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT "Show Calendar_pkey" PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_band_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_band_id_key UNIQUE (user_id, band_id);


--
-- Name: session_musicians musicians_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_musicians
    ADD CONSTRAINT musicians_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: people people_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_email_key UNIQUE (email);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: peoplebands peoplebands_person_id_band_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peoplebands
    ADD CONSTRAINT peoplebands_person_id_band_id_key UNIQUE (person_id, band_id);


--
-- Name: peoplebands peoplebands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peoplebands
    ADD CONSTRAINT peoplebands_pkey PRIMARY KEY (id);


--
-- Name: pledges pledges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pledges
    ADD CONSTRAINT pledges_pkey PRIMARY KEY (id);


--
-- Name: scraper_logs scraper_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scraper_logs
    ADD CONSTRAINT scraper_logs_pkey PRIMARY KEY (id);


--
-- Name: scraper_show_additions scraper_show_additions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scraper_show_additions
    ADD CONSTRAINT scraper_show_additions_pkey PRIMARY KEY (id);


--
-- Name: show_bands show_bands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.show_bands
    ADD CONSTRAINT show_bands_pkey PRIMARY KEY (show_id, band_id);


--
-- Name: tcupbands tcupbands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tcupbands
    ADD CONSTRAINT tcupbands_pkey PRIMARY KEY (id);


--
-- Name: tcupbands tcupbands_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tcupbands
    ADD CONSTRAINT tcupbands_slug_key UNIQUE (slug);


--
-- Name: tcupbands tcupbands_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tcupbands
    ADD CONSTRAINT tcupbands_slug_unique UNIQUE (slug);


--
-- Name: shows unique_show; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT unique_show UNIQUE (venue_id, start);


--
-- Name: user_shows user_shows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shows
    ADD CONSTRAINT user_shows_pkey PRIMARY KEY (id);


--
-- Name: user_shows user_shows_user_id_show_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shows
    ADD CONSTRAINT user_shows_user_id_show_id_key UNIQUE (user_id, show_id);


--
-- Name: user_tcupbands user_tcupbands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tcupbands
    ADD CONSTRAINT user_tcupbands_pkey PRIMARY KEY (id);


--
-- Name: user_tcupbands user_tcupbands_user_id_tcupband_id_relationship_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tcupbands
    ADD CONSTRAINT user_tcupbands_user_id_tcupband_id_relationship_type_key UNIQUE (user_id, tcupband_id, relationship_type);


--
-- Name: users users_auth0_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth0_id_key UNIQUE (auth0_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_new_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_new_pkey PRIMARY KEY (id);


--
-- Name: vrc_drafts vrc_drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vrc_drafts
    ADD CONSTRAINT vrc_drafts_pkey PRIMARY KEY (id);


--
-- Name: vrc_results vrc_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vrc_results
    ADD CONSTRAINT vrc_results_pkey PRIMARY KEY (id);


--
-- Name: idx_band_admins_auth0_id; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_band_admins_auth0_id ON development.band_admins USING btree (auth0_id);


--
-- Name: idx_band_genres_band_id; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_band_genres_band_id ON development.band_genres USING btree (band_id);


--
-- Name: idx_band_members_band_id; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_band_members_band_id ON development.band_members USING btree (band_id);


--
-- Name: idx_band_releases_band_id; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_band_releases_band_id ON development.band_releases USING btree (band_id);


--
-- Name: idx_bands_new_custom_slug; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_bands_new_custom_slug ON development.bands_new USING btree (custom_slug);


--
-- Name: idx_bands_new_slug; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_bands_new_slug ON development.bands_new USING btree (slug);


--
-- Name: idx_development_updates_created_at; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_development_updates_created_at ON development.updates USING btree (created_at DESC);


--
-- Name: idx_notif_is_read; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_notif_is_read ON development.notifications USING btree (is_read);


--
-- Name: idx_notif_user_id; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_notif_user_id ON development.notifications USING btree (user_id);


--
-- Name: idx_users_role; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_users_role ON development.users USING btree (role);


--
-- Name: shows_is_deleted_idx; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX shows_is_deleted_idx ON development.shows USING btree (is_deleted);


--
-- Name: idx_band_admins_auth0_id; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_band_admins_auth0_id ON production.band_admins USING btree (auth0_id);


--
-- Name: idx_band_genres_band_id; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_band_genres_band_id ON production.band_genres USING btree (band_id);


--
-- Name: idx_band_members_band_id; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_band_members_band_id ON production.band_members USING btree (band_id);


--
-- Name: idx_band_releases_band_id; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_band_releases_band_id ON production.band_releases USING btree (band_id);


--
-- Name: idx_bands_new_custom_slug; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_bands_new_custom_slug ON production.bands_new USING btree (custom_slug);


--
-- Name: idx_bands_new_slug; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_bands_new_slug ON production.bands_new USING btree (slug);


--
-- Name: idx_production_updates_created_at; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_production_updates_created_at ON production.updates USING btree (created_at DESC);


--
-- Name: idx_users_role; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX idx_users_role ON production.users USING btree (role);


--
-- Name: shows_is_deleted_idx; Type: INDEX; Schema: production; Owner: -
--

CREATE INDEX shows_is_deleted_idx ON production.shows USING btree (is_deleted);


--
-- Name: idx_shows_is_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shows_is_deleted ON public.shows USING btree (is_deleted);


--
-- Name: idx_tcupbands_claimed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tcupbands_claimed_by ON public.tcupbands USING btree (claimed_by);


--
-- Name: bands_new update_bands_new_modtime; Type: TRIGGER; Schema: development; Owner: -
--

CREATE TRIGGER update_bands_new_modtime BEFORE UPDATE ON development.bands_new FOR EACH ROW EXECUTE FUNCTION development.update_modified_column();


--
-- Name: bands_new update_bands_new_modtime; Type: TRIGGER; Schema: production; Owner: -
--

CREATE TRIGGER update_bands_new_modtime BEFORE UPDATE ON production.bands_new FOR EACH ROW EXECUTE FUNCTION production.update_modified_column();


--
-- Name: shows set_pilllar_default_time; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_pilllar_default_time BEFORE INSERT ON public.shows FOR EACH ROW EXECUTE FUNCTION public.set_default_time_for_pilllar();

ALTER TABLE public.shows DISABLE TRIGGER set_pilllar_default_time;


--
-- Name: shows set_start_column; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_start_column BEFORE INSERT ON public.shows FOR EACH ROW EXECUTE FUNCTION public.update_start_column();

ALTER TABLE public.shows DISABLE TRIGGER set_start_column;


--
-- Name: band_admins band_admins_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_admins
    ADD CONSTRAINT band_admins_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_featured_content band_featured_content_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_featured_content
    ADD CONSTRAINT band_featured_content_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_genres band_genres_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_genres
    ADD CONSTRAINT band_genres_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_group_sizes band_group_sizes_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_group_sizes
    ADD CONSTRAINT band_group_sizes_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_images band_images_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_images
    ADD CONSTRAINT band_images_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_influences band_influences_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_influences
    ADD CONSTRAINT band_influences_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_media_embeds band_media_embeds_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_media_embeds
    ADD CONSTRAINT band_media_embeds_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_member_instruments band_member_instruments_member_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_member_instruments
    ADD CONSTRAINT band_member_instruments_member_id_foreign FOREIGN KEY (member_id) REFERENCES development.band_members(id) ON DELETE CASCADE;


--
-- Name: band_members band_members_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_members
    ADD CONSTRAINT band_members_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_merch_types band_merch_types_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_merch_types
    ADD CONSTRAINT band_merch_types_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_open_positions band_open_positions_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_open_positions
    ADD CONSTRAINT band_open_positions_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_performance_preferences band_performance_preferences_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_performance_preferences
    ADD CONSTRAINT band_performance_preferences_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_profile_badges band_profile_badges_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_profile_badges
    ADD CONSTRAINT band_profile_badges_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_releases band_releases_band_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.band_releases
    ADD CONSTRAINT band_releases_band_id_foreign FOREIGN KEY (band_id) REFERENCES development.bands_new(id) ON DELETE CASCADE;


--
-- Name: scraper_show_additions development_scraper_show_additions_scraper_log_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.scraper_show_additions
    ADD CONSTRAINT development_scraper_show_additions_scraper_log_id_foreign FOREIGN KEY (scraper_log_id) REFERENCES development.scraper_logs(id) ON DELETE CASCADE;


--
-- Name: scraper_show_additions development_scraper_show_additions_show_id_foreign; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.scraper_show_additions
    ADD CONSTRAINT development_scraper_show_additions_show_id_foreign FOREIGN KEY (show_id) REFERENCES development.shows(id) ON DELETE CASCADE;


--
-- Name: band_admins band_admins_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_admins
    ADD CONSTRAINT band_admins_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_featured_content band_featured_content_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_featured_content
    ADD CONSTRAINT band_featured_content_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_genres band_genres_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_genres
    ADD CONSTRAINT band_genres_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_group_sizes band_group_sizes_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_group_sizes
    ADD CONSTRAINT band_group_sizes_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_images band_images_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_images
    ADD CONSTRAINT band_images_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_influences band_influences_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_influences
    ADD CONSTRAINT band_influences_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_media_embeds band_media_embeds_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_media_embeds
    ADD CONSTRAINT band_media_embeds_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_member_instruments band_member_instruments_member_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_member_instruments
    ADD CONSTRAINT band_member_instruments_member_id_foreign FOREIGN KEY (member_id) REFERENCES production.band_members(id) ON DELETE CASCADE;


--
-- Name: band_members band_members_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_members
    ADD CONSTRAINT band_members_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_merch_types band_merch_types_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_merch_types
    ADD CONSTRAINT band_merch_types_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_open_positions band_open_positions_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_open_positions
    ADD CONSTRAINT band_open_positions_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_performance_preferences band_performance_preferences_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_performance_preferences
    ADD CONSTRAINT band_performance_preferences_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_profile_badges band_profile_badges_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_profile_badges
    ADD CONSTRAINT band_profile_badges_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: band_releases band_releases_band_id_foreign; Type: FK CONSTRAINT; Schema: production; Owner: -
--

ALTER TABLE ONLY production.band_releases
    ADD CONSTRAINT band_releases_band_id_foreign FOREIGN KEY (band_id) REFERENCES production.bands_new(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_band_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_band_id_fkey FOREIGN KEY (band_id) REFERENCES public.tcupbands(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: peoplebands peoplebands_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peoplebands
    ADD CONSTRAINT peoplebands_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id) ON DELETE CASCADE;


--
-- Name: scraper_show_additions scraper_show_additions_scraper_log_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scraper_show_additions
    ADD CONSTRAINT scraper_show_additions_scraper_log_id_foreign FOREIGN KEY (scraper_log_id) REFERENCES public.scraper_logs(id) ON DELETE CASCADE;


--
-- Name: scraper_show_additions scraper_show_additions_show_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scraper_show_additions
    ADD CONSTRAINT scraper_show_additions_show_id_foreign FOREIGN KEY (show_id) REFERENCES public.shows(id) ON DELETE CASCADE;


--
-- Name: show_bands show_bands_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.show_bands
    ADD CONSTRAINT show_bands_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.shows(id) ON DELETE CASCADE;


--
-- Name: tcupbands tcupbands_claimed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tcupbands
    ADD CONSTRAINT tcupbands_claimed_by_fkey FOREIGN KEY (claimed_by) REFERENCES public.users(auth0_id);


--
-- Name: user_shows user_shows_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shows
    ADD CONSTRAINT user_shows_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.shows(id);


--
-- Name: user_shows user_shows_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_shows
    ADD CONSTRAINT user_shows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_tcupbands user_tcupbands_tcupband_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tcupbands
    ADD CONSTRAINT user_tcupbands_tcupband_id_fkey FOREIGN KEY (tcupband_id) REFERENCES public.tcupbands(id);


--
-- Name: user_tcupbands user_tcupbands_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_tcupbands
    ADD CONSTRAINT user_tcupbands_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: vrc_results vrc_results_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vrc_results
    ADD CONSTRAINT vrc_results_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict EtQIS8ePDPS35oHLYYhMgi9gMbDVID5FRTYlCWbfdlEYejmOSZ8eQYFV7UgQLIR

