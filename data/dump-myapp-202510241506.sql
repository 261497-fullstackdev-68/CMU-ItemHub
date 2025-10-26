--
-- PostgreSQL database cluster dump
--

-- Started on 2025-10-24 15:06:32

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.0

-- Started on 2025-10-24 15:06:32

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

-- Completed on 2025-10-24 15:06:32

--
-- PostgreSQL database dump complete
--

--
-- Database "myapp" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.0

-- Started on 2025-10-24 15:06:32

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
-- TOC entry 3512 (class 1262 OID 16384)
-- Name: myapp; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE myapp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE myapp OWNER TO postgres;

\connect myapp

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
-- TOC entry 864 (class 1247 OID 16448)
-- Name: LoanStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LoanStatus" AS ENUM (
    'pending',
    'approved',
    'returned',
    'rejected'
);


ALTER TYPE public."LoanStatus" OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 33833)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'SYSTEM_ADMIN',
    'ORG_STAFF',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 867 (class 1247 OID 16456)
-- Name: accountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."accountType" AS ENUM (
    'StdAcc',
    'AlumAcc',
    'MISEmpAcc'
);


ALTER TYPE public."accountType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16483)
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    "categoryName" text NOT NULL,
    description text,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16482)
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 222
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- TOC entry 225 (class 1259 OID 16492)
-- Name: Equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Equipment" (
    id integer NOT NULL,
    "organizationId" integer NOT NULL,
    "categoryId" integer NOT NULL,
    name text NOT NULL,
    description text,
    "isAvailable" boolean NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalQuantity" integer NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "imageUrl" text DEFAULT ''::text NOT NULL,
    "imageName" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."Equipment" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16501)
-- Name: EquipmentLoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EquipmentLoan" (
    id integer NOT NULL,
    "equipmentId" integer NOT NULL,
    "borrowerId" integer NOT NULL,
    amount integer NOT NULL,
    status public."LoanStatus" NOT NULL,
    "borrowedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "returnedAt" timestamp(3) without time zone,
    note text,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EquipmentLoan" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16500)
-- Name: EquipmentLoan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EquipmentLoan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EquipmentLoan_id_seq" OWNER TO postgres;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 226
-- Name: EquipmentLoan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EquipmentLoan_id_seq" OWNED BY public."EquipmentLoan".id;


--
-- TOC entry 224 (class 1259 OID 16491)
-- Name: Equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Equipment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Equipment_id_seq" OWNER TO postgres;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 224
-- Name: Equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Equipment_id_seq" OWNED BY public."Equipment".id;


--
-- TOC entry 221 (class 1259 OID 16474)
-- Name: Organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Organization" (
    id integer NOT NULL,
    name text NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "imageUrl" text DEFAULT ''::text NOT NULL,
    "imageName" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."Organization" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16473)
-- Name: Organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Organization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Organization_id_seq" OWNER TO postgres;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 220
-- Name: Organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Organization_id_seq" OWNED BY public."Organization".id;


--
-- TOC entry 218 (class 1259 OID 16394)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "accountType" public."accountType" NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    "preName" text,
    "studentID" text,
    id integer NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    faculty text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 33840)
-- Name: UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRole" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "organizationId" integer,
    role public."Role" NOT NULL,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserRole" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 33839)
-- Name: UserRole_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserRole_id_seq" OWNER TO postgres;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 228
-- Name: UserRole_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserRole_id_seq" OWNED BY public."UserRole".id;


--
-- TOC entry 219 (class 1259 OID 16463)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 217 (class 1259 OID 16385)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 3317 (class 2604 OID 16486)
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- TOC entry 3319 (class 2604 OID 16495)
-- Name: Equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment" ALTER COLUMN id SET DEFAULT nextval('public."Equipment_id_seq"'::regclass);


--
-- TOC entry 3323 (class 2604 OID 16504)
-- Name: EquipmentLoan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EquipmentLoan" ALTER COLUMN id SET DEFAULT nextval('public."EquipmentLoan_id_seq"'::regclass);


--
-- TOC entry 3313 (class 2604 OID 16477)
-- Name: Organization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization" ALTER COLUMN id SET DEFAULT nextval('public."Organization_id_seq"'::regclass);


--
-- TOC entry 3312 (class 2604 OID 16464)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 3326 (class 2604 OID 33843)
-- Name: UserRole id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole" ALTER COLUMN id SET DEFAULT nextval('public."UserRole_id_seq"'::regclass);


--
-- TOC entry 3500 (class 0 OID 16483)
-- Dependencies: 223
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, "categoryName", description, "createAt", "updateAt") FROM stdin;
2	test1	create category	2025-10-11 07:42:06.676	2025-10-11 07:42:06.676
\.


--
-- TOC entry 3502 (class 0 OID 16492)
-- Dependencies: 225
-- Data for Name: Equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Equipment" (id, "organizationId", "categoryId", name, description, "isAvailable", "createAt", "totalQuantity", "updateAt", "imageUrl", "imageName") FROM stdin;
13	10	2	testHammer		t	2025-10-13 23:10:25.707	10	2025-10-13 23:10:25.815	http://localhost:9011/app-bucket/10_Org2/equipment/13_435551.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251013T231025Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=da23f6340357ed02d02362a369c73b1be22df0666066ce8fee960bd7c5837e43	10_Org2/equipment/13_435551.jpg
14	9	2	Org1 Hammer		t	2025-10-13 23:26:44.575	10	2025-10-13 23:46:39.97	http://localhost:9011/app-bucket/9_Org1/equipment/14_435551.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251013T234639Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a023e591eda872d7f2145957afba5304e829f874b7596b8e42af844f284b6886	9_Org1/equipment/14_435551.jpg
16	12	2	spork		t	2025-10-14 02:30:21.804	10	2025-10-14 02:30:21.837	http://localhost:9011/app-bucket/12_Spork%20Org/equipment/16_spork.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251014%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251014T023021Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=b00130ae343f72c2190fc93eb791bb8b535ff15af24e3bf34cbbae849c48e951	12_Spork Org/equipment/16_spork.jpg
15	10	2	Org2 spoon		t	2025-10-13 23:47:54.084	19	2025-10-14 02:35:12.989	http://localhost:9011/app-bucket/10_Org2/equipment/15_R.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251014%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251014T023512Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=8a411946693c977188a2fbed92768a9924fcdbd7a912388245d71a7146d0f4bc	10_Org2/equipment/15_R.jpg
\.


--
-- TOC entry 3504 (class 0 OID 16501)
-- Dependencies: 227
-- Data for Name: EquipmentLoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EquipmentLoan" (id, "equipmentId", "borrowerId", amount, status, "borrowedAt", "returnedAt", note, "createAt", "updateAt") FROM stdin;
9	14	31	5	pending	2025-10-02 00:00:00	2025-10-09 00:00:00		2025-10-13 23:51:43.187	2025-10-13 23:51:43.187
10	15	31	2	pending	2025-10-03 00:00:00	2025-10-17 00:00:00		2025-10-13 23:51:58.53	2025-10-13 23:51:58.53
5	13	31	1	rejected	2025-10-15 00:00:00	2025-10-17 00:00:00		2025-10-13 23:11:05.083	2025-10-14 00:23:20.171
8	13	31	5	returned	2025-10-03 00:00:00	2025-10-03 00:00:00		2025-10-13 23:25:48.201	2025-10-14 00:23:27.132
11	14	31	1	pending	2025-10-03 00:00:00	2025-10-23 00:00:00		2025-10-14 00:25:37.276	2025-10-14 00:25:37.276
12	15	31	2	pending	2025-10-03 00:00:00	2025-10-09 00:00:00		2025-10-14 00:25:50.444	2025-10-14 00:25:50.444
7	13	31	1	rejected	2025-10-10 00:00:00	2025-10-23 00:00:00		2025-10-13 23:25:40.66	2025-10-14 02:29:58.979
13	14	31	1	approved	2025-10-19 00:00:00	2025-10-21 00:00:00		2025-10-17 03:27:27.349	2025-10-17 03:29:42.486
6	13	31	1	returned	2025-10-15 00:00:00	2025-10-08 00:00:00		2025-10-13 23:22:34.665	2025-10-17 03:30:00.607
\.


--
-- TOC entry 3498 (class 0 OID 16474)
-- Dependencies: 221
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organization" (id, name, "createAt", "updateAt", "imageUrl", "imageName") FROM stdin;
9	Org1	2025-10-13 22:31:50.321	2025-10-13 22:31:50.412	http://localhost:9011/app-bucket/9_Org1/profile/1760394710336-347737.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251013T223150Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=71becf02746a335863e38ca14ad6111c8aa45b0f97b19f0bb415bb9659b67537	9_Org1/profile/1760394710336-347737.jpg
10	Org2	2025-10-13 22:32:02.949	2025-10-13 22:32:03.02	http://localhost:9011/app-bucket/10_Org2/profile/1760394722952-435551.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251013T223203Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=184652e7449f296ab79bf2aa2e43fd5db74b639470b08b749d212a18b0df509d	10_Org2/profile/1760394722952-435551.jpg
11	Spoon Org	2025-10-13 23:53:56	2025-10-13 23:53:56.089	http://localhost:9011/app-bucket/11_Spoon%20Org/profile/1760399636006-R.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251013T235356Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a48c75ffdc09cd4ae139752b4298fa8eec32b6cd3f4fb6b60cbca4311a4846a0	11_Spoon Org/profile/1760399636006-R.jpg
12	Spork Org	2025-10-14 01:50:03.011	2025-10-14 01:50:03.078	http://localhost:9011/app-bucket/12_Spork%20Org/profile/1760406603015-spork.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251014%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251014T015003Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=6d8859c8d259edfd384ebbf22a36cc1f1d2bfc1548763bfc164156207f6dcadf	12_Spork Org/profile/1760406603015-spork.jpg
13	Org3	2025-10-17 03:30:49.93	2025-10-17 03:30:50.089	http://localhost:9011/app-bucket/13_Org3/profile/1760671849944-15505776.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O5B0A2ZHEITMFMLGWLEE%2F20251017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251017T033050Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e87ea5810bf565350493d8914eed98145218ba016364b9c1b372fa51ed62f421	13_Org3/profile/1760671849944-15505776.png
\.


--
-- TOC entry 3495 (class 0 OID 16394)
-- Dependencies: 218
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (email, "createdAt", "accountType", firstname, lastname, "preName", "studentID", id, "updateAt", faculty) FROM stdin;
john.doe@example.com	2025-10-03 03:33:44.892	StdAcc	John	Doe	\N	12345678	20	2025-10-03 03:33:44.892	Computer Science
john.doe2@example.com	2025-10-04 16:34:32.953	StdAcc	John	Doe	\N	12345678	30	2025-10-04 16:34:32.953	Computer Science
thiranat_kakanmee@cmu.ac.th	2025-10-04 16:39:16.368	StdAcc	ถิรณัฐ	ก๋ากันมี		650610762	31	2025-10-04 16:39:16.368	คณะวิศวกรรมศาสตร์
john.doe3@example.com	2025-10-06 07:55:35.643	StdAcc	John	Doe	\N	12345678	32	2025-10-06 07:55:35.643	Computer Science
\.


--
-- TOC entry 3506 (class 0 OID 33840)
-- Dependencies: 229
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRole" (id, "userId", "organizationId", role, "assignedAt") FROM stdin;
9	30	\N	USER	2025-10-04 16:34:32.961
10	31	\N	USER	2025-10-04 16:39:16.375
11	32	\N	USER	2025-10-06 07:55:35.656
12	32	\N	SYSTEM_ADMIN	2025-10-06 14:57:09.801
13	31	\N	SYSTEM_ADMIN	2025-10-06 14:49:05.93
16	31	\N	ORG_STAFF	2025-10-11 07:37:59.789
18	31	10	ORG_STAFF	2025-10-13 23:06:07.289
19	31	9	ORG_STAFF	2025-10-13 23:06:13.456
24	31	11	ORG_STAFF	2025-10-13 23:56:36.532
25	31	12	ORG_STAFF	2025-10-14 01:50:15.347
26	20	13	ORG_STAFF	2025-10-17 03:31:11.504
\.


--
-- TOC entry 3494 (class 0 OID 16385)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6816d83b-40a8-4f0e-8814-ddc30ade6d4f	0645f5abc771f0697f76a4c865518c0a9014eea33dafb71ad457ab738d16b91a	2025-09-24 03:46:21.095076+00	20250921144733_init	\N	\N	2025-09-24 03:46:21.070878+00	1
afd2efc6-bc0a-4124-b91a-fa6dc012581b	4793ab3a2c316121c7137346e6cfe4a4b8c48af3aab983e43a5df66ae8a2335e	2025-09-27 09:22:46.856698+00	20250927092246_schema_v1	\N	\N	2025-09-27 09:22:46.79433+00	1
4c66a5f3-0a75-437c-9287-83dfcfe3f205	63befaade6400e7f26a2703b8d1c7b04ccec4000a1b37f273e6afe1573ed2435	2025-09-28 15:03:01.387572+00	20250928150301_add_unique_email	\N	\N	2025-09-28 15:03:01.371511+00	1
0b3dd2e3-3081-4be8-bb8e-e376f5a0ea8a	b3782d21db900c309cc548f7a84585dc4e64aca1a397b34567dbe8c7d1683faf	2025-09-29 16:02:25.091186+00	20250929160225_add_create_at_update_at_remove_redundant_field_from_equipment	\N	\N	2025-09-29 16:02:25.064172+00	1
eef2c208-3468-4697-8ce2-73fd7e8069d6	87a842faf9ef0c38089793eac2d444ebee82cabe5e36635d2673bd149da6b1f6	2025-09-30 02:57:39.795695+00	20250930025739_fix_wrong_table_relation	\N	\N	2025-09-30 02:57:39.779246+00	1
bab384b4-b177-4994-ab7e-2057bee896c7	ecf331e5643251e889c674609352698ccc9037025f3e773eb77ff3194bc8880f	2025-09-30 03:33:30.76806+00	20250930033330_remove_unnessesary_field_from_equipment_loan	\N	\N	2025-09-30 03:33:30.751781+00	1
f1ae7ef1-b5d5-43a6-aba7-dd8a823d200e	46bf054a31a17e1e32b845b201ea5b1acf9093c0ebffec9e667b7fe31d96fa3b	2025-10-01 02:13:33.792799+00	20251001021333_add_user_roles_for_rbac	\N	\N	2025-10-01 02:13:33.767638+00	1
724318b4-0b8d-4027-a001-a28ba21ee6b3	ae016ec88f8cc4c06c9f8cb8a1ee0bb8814f6ba16d1c6c4961589c84725dfa4a	2025-10-06 16:12:14.522901+00	20251006161214_remove_type_field_from_organization	\N	\N	2025-10-06 16:12:14.509782+00	1
d67464af-be23-4b22-9c83-14fefb4eab30	7f43004294ca547688c01f7e309c6345142698cfc582df5bc6272420e7e157ae	2025-10-12 15:25:51.494282+00	20251012152551_add_image_url_field_in_organization_and_equipment	\N	\N	2025-10-12 15:25:51.481793+00	1
ccd904cb-c242-48d4-b061-1ff6ec2fca40	593c16a79a3dca13566c1316e67eb5c59e5daa54bfcda619fdd357c3cc83dac4	2025-10-12 16:50:09.92698+00	20251012165009_remove_code_field_from_category	\N	\N	2025-10-12 16:50:09.910878+00	1
6e579efa-3cfa-4aaa-b002-33c365bca939	1e9455743ec8df82a41421b536177bf73726bbbf377c3821b047b1cbdb173a75	2025-10-13 12:00:26.947685+00	20251013120026_add_image_name_field	\N	\N	2025-10-13 12:00:26.934059+00	1
\.


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 222
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 2, true);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 226
-- Name: EquipmentLoan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EquipmentLoan_id_seq"', 13, true);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 224
-- Name: Equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Equipment_id_seq"', 17, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 220
-- Name: Organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Organization_id_seq"', 13, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 228
-- Name: UserRole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserRole_id_seq"', 26, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 219
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 32, true);


--
-- TOC entry 3336 (class 2606 OID 16490)
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 16509)
-- Name: EquipmentLoan EquipmentLoan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EquipmentLoan"
    ADD CONSTRAINT "EquipmentLoan_pkey" PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 16499)
-- Name: Equipment Equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16481)
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 33846)
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 16466)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3329 (class 2606 OID 16393)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3330 (class 1259 OID 16948)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3345 (class 2606 OID 16535)
-- Name: EquipmentLoan EquipmentLoan_borrowerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EquipmentLoan"
    ADD CONSTRAINT "EquipmentLoan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3346 (class 2606 OID 16525)
-- Name: EquipmentLoan EquipmentLoan_equipmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EquipmentLoan"
    ADD CONSTRAINT "EquipmentLoan_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES public."Equipment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3343 (class 2606 OID 16520)
-- Name: Equipment Equipment_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3344 (class 2606 OID 16515)
-- Name: Equipment Equipment_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT "Equipment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3347 (class 2606 OID 33852)
-- Name: UserRole UserRole_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3348 (class 2606 OID 33847)
-- Name: UserRole UserRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2025-10-24 15:06:32

--
-- PostgreSQL database dump complete
--

-- Completed on 2025-10-24 15:06:32

--
-- PostgreSQL database cluster dump complete
--

