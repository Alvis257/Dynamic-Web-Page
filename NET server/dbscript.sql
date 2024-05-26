-- Table: public.Users

-- DROP TABLE IF EXISTS public."Users";

CREATE TABLE IF NOT EXISTS public."Users"
(
    "userId" integer NOT NULL DEFAULT nextval('dgs_userid_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    surname text COLLATE pg_catalog."default" NOT NULL,
    "createdDate" timestamp without time zone NOT NULL,
    "lastUpdatedDate" timestamp without time zone NOT NULL,
    "userName" text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    role text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    "resetCode" text COLLATE pg_catalog."default" NOT NULL,
    admin boolean NOT NULL,
    read boolean NOT NULL,
    write boolean NOT NULL,
    delete boolean NOT NULL,
    share boolean NOT NULL,
    CONSTRAINT dgs_pkey PRIMARY KEY ("userId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;




    -- Database: DGS

-- DROP DATABASE IF EXISTS "DGS";

CREATE DATABASE "DGS"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United Kingdom.1252'
    LC_CTYPE = 'English_United Kingdom.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;