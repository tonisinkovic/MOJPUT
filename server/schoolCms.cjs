/**
 * MojPut Junior — CMS i auth za srednje škole.
 * Katalog ostaje u src/data/highSchools.ts; ovdje su računi, overlay i objave.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { resolveSqliteDataDir } = require("./appDb.cjs");
const { getSchoolById, getSchoolBySlug, publicCatalogFields, idsInCity, loadHighSchools } = require("./schoolCatalog.cjs");
const { slugifyPostTitle } = require("./schoolSlug.cjs");
const { generateSchoolPassword, credentialsCsv, credentialsHtml, htmlEscape } = require("./schoolPasswords.cjs");

const POST_STATUSES = new Set(["DRAFT", "PUBLISHED", "ARCHIVED", "HIDDEN"]);
const SCHOOL_POST_CATEGORIES = new Set(["dogadaj", "upisi", "uspjeh", "obavijest", "ostalo"]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const SCHOOL_INTERNAL_EMAIL_DOMAIN = "skole.mojput.internal";

function truthyFlag(v) {
  return v === true || v === 1 || v === "1";
}

function uploadsRoot() {
  const dir = path.join(resolveSqliteDataDir(), "uploads", "schools");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function credentialsDir() {
  const dir = path.join(resolveSqliteDataDir(), "school-credentials");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function sniffImageMime(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

function extForMime(mime) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

async function optimizeImageBuffer(buf, mime) {
  try {
    const sharp = require("sharp");
    const out = await sharp(buf)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    return { buffer: out, mime: "image/webp", ext: "webp" };
  } catch {
    return { buffer: buf, mime, ext: extForMime(mime) };
  }
}

function isHttpUrl(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}

function normalizeCategory(raw) {
  const v = String(raw || "")
    .trim()
    .toLowerCase();
  if (!v) return null;
  return SCHOOL_POST_CATEGORIES.has(v) ? v : "ostalo";
}

function publicPostRow(post, images) {
  return {
    id: post.id,
    schoolId: post.high_school_id,
    schoolSlug: post.slug_school || post.school_slug,
    schoolName: post.school_name || null,
    schoolCity: post.school_city || null,
    title: post.title,
    content: post.content,
    slug: post.slug,
    category: post.category || null,
    linkUrl: post.link_url || null,
    status: post.status,
    publishedAt: post.published_at,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    images: (images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || "",
      sortOrder: img.sort_order,
    })),
  };
}

async function loadPostImages(db, postId) {
  return db
    .prepare("SELECT id, url, alt, sort_order FROM school_post_images WHERE post_id = ? ORDER BY sort_order ASC, id ASC")
    .all(postId);
}

async function attachImages(db, posts) {
  const out = [];
  for (const post of posts) {
    const images = await loadPostImages(db, post.id);
    out.push(publicPostRow(post, images));
  }
  return out;
}

function uniquePostSlug(base, taken) {
  let slug = base;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

async function enrichUserWithSchool(db, userPayload) {
  if (!userPayload || !userPayload.id) return userPayload;
  const acc = await db
    .prepare(
      "SELECT id, slug, high_school_id, must_change_password, is_active FROM school_accounts WHERE user_id = ?",
    )
    .get(userPayload.id);
  if (!acc) return userPayload;
  return {
    ...userPayload,
    user_type: userPayload.user_type || "skola",
    school: {
      id: acc.id,
      slug: acc.slug,
      high_school_id: acc.high_school_id,
      must_change_password: truthyFlag(acc.must_change_password),
      is_active: truthyFlag(acc.is_active),
    },
  };
}

function schoolAuthMiddleware(db, authMiddleware) {
  return (req, res, next) => {
    authMiddleware(req, res, async () => {
      try {
        const account = await db.prepare("SELECT * FROM school_accounts WHERE user_id = ?").get(req.user.id);
        if (!account) {
          return res.status(403).json({ success: false, message: "Nemaš pristup školskom dijelu." });
        }
        if (!truthyFlag(account.is_active)) {
          return res.status(403).json({ success: false, message: "Račun trenutno nije aktivan." });
        }
        req.schoolAccount = account;
        next();
      } catch (err) {
        console.error("[schools/authz]", err?.message || err);
        return res.status(500).json({ success: false, message: "Interna greška servera." });
      }
    });
  };
}

function latestCredentialsFiles() {
  const dir = credentialsDir();
  const names = fs
    .readdirSync(dir)
    .filter((n) => n.startsWith("school-credentials-") && (n.endsWith(".csv") || n.endsWith(".html")))
    .sort()
    .reverse();
  const csv = names.find((n) => n.endsWith(".csv"));
  const html = names.find((n) => n.endsWith(".html"));
  return {
    csv: csv ? path.join(dir, csv) : null,
    html: html ? path.join(dir, html) : null,
  };
}

function registerSchoolCms(app, ctx) {
  const {
    db,
    authMiddleware,
    adminMiddleware,
    signToken,
    setAuthCookie,
    bcrypt,
    express,
  } = ctx;

  const schoolAuth = schoolAuthMiddleware(db, authMiddleware);

  app.use(
    "/uploads/schools",
    express.static(uploadsRoot(), {
      index: false,
      maxAge: "7d",
    }),
  );

  let multerUpload = null;
  try {
    const multer = require("multer");
    multerUpload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
    }).single("file");
  } catch {
    multerUpload = null;
  }

  app.post("/api/schools/login", async (req, res) => {
    try {
      const login = String(req.body?.email || req.body?.username || req.body?.login || "")
        .trim()
        .toLowerCase();
      const password = String(req.body?.password || "");
      if (!login || !password) {
        return res.status(400).json({ success: false, message: "Unesi korisničko ime i lozinku." });
      }

      const row = await db
        .prepare(
          `SELECT u.id, u.username, u.email, u.password_hash, u.created_at, u.email_verified, u.user_type, u.last_login_at,
                  sa.id AS school_account_id, sa.is_active, sa.must_change_password, sa.slug, sa.high_school_id
           FROM users u
           JOIN school_accounts sa ON sa.user_id = u.id
           WHERE lower(u.email) = ? OR lower(u.username) = ?`,
        )
        .get(login, login);

      if (!row || !row.password_hash) {
        return res.status(401).json({ success: false, message: "Neispravno korisničko ime ili lozinka." });
      }
      if (!bcrypt.compareSync(password, row.password_hash)) {
        return res.status(401).json({ success: false, message: "Neispravno korisničko ime ili lozinka." });
      }
      if (!truthyFlag(row.is_active)) {
        return res.status(403).json({ success: false, message: "Račun trenutno nije aktivan." });
      }

      await db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(row.id);
      const fresh = await db
        .prepare(
          "SELECT id, username, email, created_at, email_verified, user_type, last_login_at FROM users WHERE id = ?",
        )
        .get(row.id);
      const user = await enrichUserWithSchool(db, {
        id: fresh.id,
        username: fresh.username,
        email: fresh.email,
        created_at: fresh.created_at,
        email_verified: fresh.email_verified,
        user_type: fresh.user_type,
        last_login_at: fresh.last_login_at,
        is_admin: false,
      });
      const token = signToken({ sub: user.id });
      setAuthCookie(res, token, req);
      return res.json({ success: true, user, token });
    } catch (err) {
      console.error("[schools/login]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.get("/api/schools/public/:slug", async (req, res) => {
    try {
      const slug = String(req.params.slug || "")
        .trim()
        .toLowerCase();
      const catalog = getSchoolBySlug(slug);
      if (!catalog) return res.status(404).json({ success: false, message: "Škola nije pronađena." });
      const account = await db.prepare("SELECT * FROM school_accounts WHERE slug = ?").get(slug);
      const posts = account
        ? await db
            .prepare(
              `SELECT p.*, sa.high_school_id, sa.slug AS slug_school
               FROM school_posts p
               JOIN school_accounts sa ON sa.id = p.school_account_id
               WHERE p.school_account_id = ? AND p.status = 'PUBLISHED'
               ORDER BY COALESCE(p.published_at, p.created_at) DESC, p.id DESC
               LIMIT 40`,
            )
            .all(account.id)
        : [];
      const feed = await attachImages(db, posts);
      return res.json({
        success: true,
        data: {
          catalog: publicCatalogFields(catalog),
          profile: {
            aboutText: account?.about_text || "",
            logoUrl: account?.logo_url || null,
            coverUrl: account?.cover_url || null,
            extraWebsite: account?.extra_website || null,
            isActive: account ? truthyFlag(account.is_active) : true,
          },
          posts: feed,
        },
      });
    } catch (err) {
      console.error("[schools/public]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.get("/api/schools/summaries", async (_req, res) => {
    try {
      const rows = await db
        .prepare(
          `SELECT sa.high_school_id, sa.slug, sa.logo_url, sa.is_active,
                  (SELECT COUNT(*) FROM school_posts p WHERE p.school_account_id = sa.id AND p.status = 'PUBLISHED') AS post_count
           FROM school_accounts sa`,
        )
        .all();
      const data = {};
      for (const row of rows) {
        data[row.high_school_id] = {
          slug: row.slug,
          logoUrl: row.logo_url || null,
          isActive: truthyFlag(row.is_active),
          postCount: Number(row.post_count || 0),
        };
      }
      return res.json({ success: true, data });
    } catch (err) {
      console.error("[schools/summaries]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.get("/api/schools/feed", async (req, res) => {
    try {
      const city = String(req.query.city || "").trim();
      const category = normalizeCategory(req.query.category);
      const schoolSlug = String(req.query.school || "")
        .trim()
        .toLowerCase();
      const from = String(req.query.from || "").trim();
      const to = String(req.query.to || "").trim();
      const limit = Math.min(50, Math.max(1, Number(req.query.limit || 24) || 24));
      const offset = Math.max(0, Number(req.query.offset || 0) || 0);

      const clauses = ["p.status = 'PUBLISHED'"];
      const params = [];
      if (schoolSlug) {
        clauses.push("sa.slug = ?");
        params.push(schoolSlug);
      }
      if (category) {
        clauses.push("p.category = ?");
        params.push(category);
      }
      if (from) {
        clauses.push("COALESCE(p.published_at, p.created_at) >= ?");
        params.push(from);
      }
      if (to) {
        clauses.push("COALESCE(p.published_at, p.created_at) <= ?");
        params.push(to);
      }
      if (city) {
        const ids = idsInCity(city);
        if (ids.length === 0) return res.json({ success: true, data: [] });
        clauses.push(`sa.high_school_id IN (${ids.map(() => "?").join(",")})`);
        params.push(...ids);
      }

      const sql = `SELECT p.*, sa.high_school_id, sa.slug AS slug_school
        FROM school_posts p
        JOIN school_accounts sa ON sa.id = p.school_account_id
        WHERE ${clauses.join(" AND ")}
        ORDER BY COALESCE(p.published_at, p.created_at) DESC, p.id DESC
        LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      const posts = await db.prepare(sql).all(...params);
      const catalog = loadHighSchools().byId;
      const withNames = posts.map((p) => {
        const school = catalog.get(p.high_school_id);
        return {
          ...p,
          school_name: school?.name || null,
          school_city: school?.city || null,
        };
      });
      return res.json({ success: true, data: await attachImages(db, withNames) });
    } catch (err) {
      console.error("[schools/feed]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.get("/api/schools/me", schoolAuth, async (req, res) => {
    try {
      const catalog = getSchoolById(req.schoolAccount.high_school_id);
      const counts = await db
        .prepare(
          `SELECT
             SUM(CASE WHEN status = 'PUBLISHED' THEN 1 ELSE 0 END) AS published,
             SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END) AS draft,
             SUM(CASE WHEN status = 'ARCHIVED' THEN 1 ELSE 0 END) AS archived,
             SUM(CASE WHEN status = 'HIDDEN' THEN 1 ELSE 0 END) AS hidden,
             COUNT(*) AS total
           FROM school_posts WHERE school_account_id = ?`,
        )
        .get(req.schoolAccount.id);
      const recent = await db
        .prepare(
          `SELECT p.*, sa.high_school_id, sa.slug AS slug_school
           FROM school_posts p
           JOIN school_accounts sa ON sa.id = p.school_account_id
           WHERE p.school_account_id = ?
           ORDER BY p.updated_at DESC, p.id DESC
           LIMIT 8`,
        )
        .all(req.schoolAccount.id);
      return res.json({
        success: true,
        data: {
          catalog: publicCatalogFields(catalog),
          account: {
            slug: req.schoolAccount.slug,
            aboutText: req.schoolAccount.about_text || "",
            logoUrl: req.schoolAccount.logo_url || null,
            coverUrl: req.schoolAccount.cover_url || null,
            extraWebsite: req.schoolAccount.extra_website || null,
            mustChangePassword: truthyFlag(req.schoolAccount.must_change_password),
            isActive: truthyFlag(req.schoolAccount.is_active),
          },
          stats: {
            published: Number(counts?.published || 0),
            draft: Number(counts?.draft || 0),
            archived: Number(counts?.archived || 0),
            hidden: Number(counts?.hidden || 0),
            total: Number(counts?.total || 0),
          },
          recentPosts: await attachImages(db, recent),
        },
      });
    } catch (err) {
      console.error("[schools/me]", err?.message || err);
      return res.status(500).json({ success: false, message: "Interna greška servera." });
    }
  });

  app.patch("/api/schools/me", schoolAuth, async (req, res) => {
    try {
      const aboutText = String(req.body?.aboutText ?? req.schoolAccount.about_text ?? "").slice(0, 8000);
      const extraWebsite = isHttpUrl(req.body?.extraWebsite);
      await db
        .prepare(
          "UPDATE school_accounts SET about_text = ?, extra_website = ?, updated_at = datetime('now') WHERE id = ?",
        )
        .run(aboutText, extraWebsite || null, req.schoolAccount.id);
      return res.json({ success: true });
    } catch (err) {
      console.error("[schools/me-patch]", err?.message || err);
      return res.status(500).json({ success: false, message: "Spremanje profila nije uspjelo." });
    }
  });

  app.post("/api/schools/me/password", schoolAuth, async (req, res) => {
    try {
      const currentPassword = String(req.body?.currentPassword || "");
      const newPassword = String(req.body?.newPassword || "");
      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "Nova lozinka mora imati barem 8 znakova." });
      }
      const user = await db.prepare("SELECT id, password_hash FROM users WHERE id = ?").get(req.user.id);
      if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
        return res.status(401).json({ success: false, message: "Trenutna lozinka nije točna." });
      }
      const hash = bcrypt.hashSync(newPassword, 12);
      await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, req.user.id);
      await db
        .prepare("UPDATE school_accounts SET must_change_password = 0, updated_at = datetime('now') WHERE id = ?")
        .run(req.schoolAccount.id);
      return res.json({ success: true, message: "Lozinka je promijenjena." });
    } catch (err) {
      console.error("[schools/password]", err?.message || err);
      return res.status(500).json({ success: false, message: "Promjena lozinke nije uspjela." });
    }
  });

  app.get("/api/schools/me/posts", schoolAuth, async (req, res) => {
    try {
      const status = String(req.query.status || "")
        .trim()
        .toUpperCase();
      const params = [req.schoolAccount.id];
      let extra = "";
      if (POST_STATUSES.has(status)) {
        extra = " AND p.status = ?";
        params.push(status);
      }
      const posts = await db
        .prepare(
          `SELECT p.*, sa.high_school_id, sa.slug AS slug_school
           FROM school_posts p
           JOIN school_accounts sa ON sa.id = p.school_account_id
           WHERE p.school_account_id = ?${extra}
           ORDER BY p.updated_at DESC, p.id DESC`,
        )
        .all(...params);
      return res.json({ success: true, data: await attachImages(db, posts) });
    } catch (err) {
      console.error("[schools/me/posts]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati objave." });
    }
  });

  async function assertOwnPost(req, res) {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Nevažeća objava." });
      return null;
    }
    const post = await db.prepare("SELECT * FROM school_posts WHERE id = ?").get(id);
    if (!post || Number(post.school_account_id) !== Number(req.schoolAccount.id)) {
      res.status(404).json({ success: false, message: "Objava nije pronađena." });
      return null;
    }
    return post;
  }

  app.post("/api/schools/me/posts", schoolAuth, async (req, res) => {
    try {
      const title = String(req.body?.title || "").trim().slice(0, 200);
      const content = String(req.body?.content || "").trim().slice(0, 20000);
      if (!title) return res.status(400).json({ success: false, message: "Unesi naslov objave." });
      let status = String(req.body?.status || "DRAFT")
        .trim()
        .toUpperCase();
      if (status === "HIDDEN") status = "DRAFT";
      if (!POST_STATUSES.has(status)) status = "DRAFT";
      const category = normalizeCategory(req.body?.category);
      const linkUrl = isHttpUrl(req.body?.linkUrl);
      const existing = await db
        .prepare("SELECT slug FROM school_posts WHERE school_account_id = ?")
        .all(req.schoolAccount.id);
      const slug = uniquePostSlug(
        slugifyPostTitle(title),
        new Set(existing.map((r) => r.slug)),
      );
      const publishedAt = status === "PUBLISHED" ? new Date().toISOString() : null;
      const info = await db
        .prepare(
          `INSERT INTO school_posts (school_account_id, title, content, slug, category, link_url, status, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(req.schoolAccount.id, title, content, slug, category, linkUrl || null, status, publishedAt);
      const post = await db.prepare("SELECT * FROM school_posts WHERE id = ?").get(info.lastInsertRowid);
      return res.json({ success: true, data: publicPostRow({ ...post, high_school_id: req.schoolAccount.high_school_id, slug_school: req.schoolAccount.slug }, []) });
    } catch (err) {
      console.error("[schools/posts-create]", err?.message || err);
      return res.status(500).json({ success: false, message: "Objava nije spremljena." });
    }
  });

  app.patch("/api/schools/me/posts/:id", schoolAuth, async (req, res) => {
    try {
      const post = await assertOwnPost(req, res);
      if (!post) return;
      if (post.status === "HIDDEN") {
        return res.status(403).json({ success: false, message: "Ova objava je sakrivena. Kontaktiraj MojPut." });
      }
      const title = req.body?.title != null ? String(req.body.title).trim().slice(0, 200) : post.title;
      const content = req.body?.content != null ? String(req.body.content).trim().slice(0, 20000) : post.content;
      let status = req.body?.status != null ? String(req.body.status).trim().toUpperCase() : post.status;
      if (status === "HIDDEN") status = post.status;
      if (!POST_STATUSES.has(status)) status = post.status;
      const category = req.body?.category !== undefined ? normalizeCategory(req.body.category) : post.category;
      const linkUrl = req.body?.linkUrl !== undefined ? isHttpUrl(req.body.linkUrl) || null : post.link_url;
      let publishedAt = post.published_at;
      if (status === "PUBLISHED" && post.status !== "PUBLISHED") publishedAt = new Date().toISOString();
      if (status !== "PUBLISHED" && status !== "HIDDEN") {
        /* keep publishedAt history for republish */
      }
      await db
        .prepare(
          `UPDATE school_posts
           SET title = ?, content = ?, category = ?, link_url = ?, status = ?, published_at = ?, updated_at = datetime('now')
           WHERE id = ? AND school_account_id = ?`,
        )
        .run(title, content, category, linkUrl, status, publishedAt, post.id, req.schoolAccount.id);
      const fresh = await db.prepare("SELECT * FROM school_posts WHERE id = ?").get(post.id);
      const images = await loadPostImages(db, post.id);
      return res.json({
        success: true,
        data: publicPostRow(
          { ...fresh, high_school_id: req.schoolAccount.high_school_id, slug_school: req.schoolAccount.slug },
          images,
        ),
      });
    } catch (err) {
      console.error("[schools/posts-patch]", err?.message || err);
      return res.status(500).json({ success: false, message: "Objava nije spremljena." });
    }
  });

  app.delete("/api/schools/me/posts/:id", schoolAuth, async (req, res) => {
    try {
      const post = await assertOwnPost(req, res);
      if (!post) return;
      await db.prepare("DELETE FROM school_post_images WHERE post_id = ?").run(post.id);
      await db.prepare("DELETE FROM school_posts WHERE id = ? AND school_account_id = ?").run(post.id, req.schoolAccount.id);
      return res.json({ success: true });
    } catch (err) {
      console.error("[schools/posts-delete]", err?.message || err);
      return res.status(500).json({ success: false, message: "Brisanje objave nije uspjelo." });
    }
  });

  async function handleImageUpload(req, res) {
    if (!multerUpload) {
      return res.status(501).json({ success: false, message: "Upload slika nije dostupan na ovom serveru." });
    }
    multerUpload(req, res, async (err) => {
      if (err) {
        const tooBig = err.code === "LIMIT_FILE_SIZE" || /file too large/i.test(String(err.message || ""));
        return res.status(400).json({
          success: false,
          message: tooBig ? "Slika je prevelika (najviše 4 MB)." : "Prijenos slike nije uspio.",
        });
      }
      try {
        if (!req.file || !req.file.buffer) {
          return res.status(400).json({ success: false, message: "Odaberi sliku za prijenos." });
        }
        if (req.file.size > MAX_IMAGE_BYTES) {
          return res.status(400).json({ success: false, message: "Slika je prevelika (najviše 4 MB)." });
        }
        const sniffed = sniffImageMime(req.file.buffer);
        const declared = String(req.file.mimetype || "").toLowerCase();
        if (!sniffed || !ALLOWED_IMAGE_MIME.has(sniffed) || (declared && !ALLOWED_IMAGE_MIME.has(declared))) {
          return res.status(400).json({ success: false, message: "Dopušteni formati: JPEG, PNG i WebP." });
        }
        const optimized = await optimizeImageBuffer(req.file.buffer, sniffed);
        const kind = String(req.body?.kind || req.query.kind || "post")
          .trim()
          .toLowerCase();
        const schoolDir = path.join(uploadsRoot(), String(req.schoolAccount.high_school_id));
        fs.mkdirSync(schoolDir, { recursive: true });
        const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${optimized.ext}`;
        fs.writeFileSync(path.join(schoolDir, filename), optimized.buffer);
        const url = `/uploads/schools/${req.schoolAccount.high_school_id}/${filename}`;

        if (kind === "logo" || kind === "cover") {
          const col = kind === "logo" ? "logo_url" : "cover_url";
          await db
            .prepare(`UPDATE school_accounts SET ${col} = ?, updated_at = datetime('now') WHERE id = ?`)
            .run(url, req.schoolAccount.id);
          return res.json({ success: true, data: { url, kind } });
        }

        const postId = Number(req.body?.postId || req.query.postId);
        if (!postId) return res.status(400).json({ success: false, message: "Nedostaje objava za sliku." });
        const post = await db.prepare("SELECT id, school_account_id FROM school_posts WHERE id = ?").get(postId);
        if (!post || Number(post.school_account_id) !== Number(req.schoolAccount.id)) {
          return res.status(404).json({ success: false, message: "Objava nije pronađena." });
        }
        const countRow = await db.prepare("SELECT COUNT(*) as c FROM school_post_images WHERE post_id = ?").get(postId);
        const sortOrder = Number(countRow?.c || 0);
        const alt = String(req.body?.alt || "").slice(0, 200);
        const info = await db
          .prepare("INSERT INTO school_post_images (post_id, url, alt, sort_order) VALUES (?, ?, ?, ?)")
          .run(postId, url, alt, sortOrder);
        return res.json({
          success: true,
          data: { id: info.lastInsertRowid, url, alt, sortOrder, kind: "post" },
        });
      } catch (e) {
        console.error("[schools/upload]", e?.message || e);
        return res.status(500).json({ success: false, message: "Prijenos slike nije uspio." });
      }
    });
  }

  app.post("/api/schools/me/upload", schoolAuth, handleImageUpload);

  app.delete("/api/schools/me/images/:id", schoolAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const img = await db
        .prepare(
          `SELECT i.id, i.post_id FROM school_post_images i
           JOIN school_posts p ON p.id = i.post_id
           WHERE i.id = ? AND p.school_account_id = ?`,
        )
        .get(id, req.schoolAccount.id);
      if (!img) return res.status(404).json({ success: false, message: "Fotografija nije pronađena." });
      await db.prepare("DELETE FROM school_post_images WHERE id = ?").run(id);
      return res.json({ success: true });
    } catch (err) {
      console.error("[schools/images-delete]", err?.message || err);
      return res.status(500).json({ success: false, message: "Brisanje fotografije nije uspjelo." });
    }
  });

  app.get("/api/admin/schools", adminMiddleware, async (req, res) => {
    try {
      const q = String(req.query.q || "")
        .trim()
        .toLowerCase();
      const rows = await db
        .prepare(
          `SELECT sa.id, sa.high_school_id, sa.slug, sa.is_active, sa.must_change_password, sa.created_at, sa.updated_at,
                  u.username, u.email, u.last_login_at,
                  (SELECT COUNT(*) FROM school_posts p WHERE p.school_account_id = sa.id) AS post_count
           FROM school_accounts sa
           JOIN users u ON u.id = sa.user_id
           ORDER BY sa.id ASC`,
        )
        .all();
      const catalog = loadHighSchools().byId;
      const data = rows
        .map((row) => {
          const school = catalog.get(row.high_school_id);
          return {
            id: row.id,
            highSchoolId: row.high_school_id,
            name: school?.name || row.high_school_id,
            city: school?.city || "",
            county: school?.county || "",
            slug: row.slug,
            username: row.username,
            email: row.email,
            isActive: truthyFlag(row.is_active),
            mustChangePassword: truthyFlag(row.must_change_password),
            lastLoginAt: row.last_login_at,
            postCount: Number(row.post_count || 0),
            createdAt: row.created_at,
          };
        })
        .filter((row) => {
          if (!q) return true;
          return (
            row.name.toLowerCase().includes(q) ||
            row.city.toLowerCase().includes(q) ||
            row.username.toLowerCase().includes(q) ||
            row.email.toLowerCase().includes(q)
          );
        });
      return res.json({ success: true, data });
    } catch (err) {
      console.error("[admin/schools]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati škole." });
    }
  });

  app.patch("/api/admin/schools/:id", adminMiddleware, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const account = await db.prepare("SELECT * FROM school_accounts WHERE id = ?").get(id);
      if (!account) return res.status(404).json({ success: false, message: "Škola nije pronađena." });
      const isActive = req.body?.isActive;
      if (typeof isActive === "boolean" || isActive === 0 || isActive === 1) {
        await db
          .prepare("UPDATE school_accounts SET is_active = ?, updated_at = datetime('now') WHERE id = ?")
          .run(truthyFlag(isActive) ? 1 : 0, id);
      }
      return res.json({ success: true });
    } catch (err) {
      console.error("[admin/schools-patch]", err?.message || err);
      return res.status(500).json({ success: false, message: "Spremanje nije uspjelo." });
    }
  });

  app.post("/api/admin/schools/:id/reset-access", adminMiddleware, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const account = await db
        .prepare(
          `SELECT sa.id, sa.slug, u.id AS user_id, u.username, u.email
           FROM school_accounts sa JOIN users u ON u.id = sa.user_id WHERE sa.id = ?`,
        )
        .get(id);
      if (!account) return res.status(404).json({ success: false, message: "Škola nije pronađena." });
      const password = generateSchoolPassword();
      const hash = bcrypt.hashSync(password, 12);
      await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, account.user_id);
      await db
        .prepare("UPDATE school_accounts SET must_change_password = 1, updated_at = datetime('now') WHERE id = ?")
        .run(account.id);
      return res.json({
        success: true,
        data: {
          username: account.username,
          email: account.email,
          password,
          loginPath: "/srednje-skole/prijava",
        },
      });
    } catch (err) {
      console.error("[admin/schools-reset]", err?.message || err);
      return res.status(500).json({ success: false, message: "Reset pristupa nije uspio." });
    }
  });

  app.get("/api/admin/schools/posts", adminMiddleware, async (req, res) => {
    try {
      const status = String(req.query.status || "")
        .trim()
        .toUpperCase();
      const q = String(req.query.q || "").trim();
      const params = [];
      const clauses = [];
      if (POST_STATUSES.has(status)) {
        clauses.push("p.status = ?");
        params.push(status);
      }
      if (q) {
        clauses.push("(p.title LIKE ? OR p.content LIKE ?)");
        params.push(`%${q}%`, `%${q}%`);
      }
      const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
      const posts = await db
        .prepare(
          `SELECT p.*, sa.high_school_id, sa.slug AS slug_school
           FROM school_posts p
           JOIN school_accounts sa ON sa.id = p.school_account_id
           ${where}
           ORDER BY p.updated_at DESC, p.id DESC
           LIMIT 200`,
        )
        .all(...params);
      const catalog = loadHighSchools().byId;
      const named = posts.map((p) => {
        const school = catalog.get(p.high_school_id);
        return { ...p, school_name: school?.name || null, school_city: school?.city || null };
      });
      return res.json({ success: true, data: await attachImages(db, named) });
    } catch (err) {
      console.error("[admin/schools/posts]", err?.message || err);
      return res.status(500).json({ success: false, message: "Ne mogu učitati objave." });
    }
  });

  app.patch("/api/admin/schools/posts/:id", adminMiddleware, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const post = await db.prepare("SELECT * FROM school_posts WHERE id = ?").get(id);
      if (!post) return res.status(404).json({ success: false, message: "Objava nije pronađena." });
      const status = String(req.body?.status || "")
        .trim()
        .toUpperCase();
      if (!POST_STATUSES.has(status)) {
        return res.status(400).json({ success: false, message: "Nevažeći status objave." });
      }
      await db
        .prepare("UPDATE school_posts SET status = ?, updated_at = datetime('now') WHERE id = ?")
        .run(status, id);
      return res.json({ success: true });
    } catch (err) {
      console.error("[admin/schools/posts-patch]", err?.message || err);
      return res.status(500).json({ success: false, message: "Moderacija nije uspjela." });
    }
  });

  app.delete("/api/admin/schools/posts/:id", adminMiddleware, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const post = await db.prepare("SELECT id FROM school_posts WHERE id = ?").get(id);
      if (!post) return res.status(404).json({ success: false, message: "Objava nije pronađena." });
      await db.prepare("DELETE FROM school_post_images WHERE post_id = ?").run(id);
      await db.prepare("DELETE FROM school_posts WHERE id = ?").run(id);
      return res.json({ success: true });
    } catch (err) {
      console.error("[admin/schools/posts-delete]", err?.message || err);
      return res.status(500).json({ success: false, message: "Brisanje nije uspjelo." });
    }
  });

  app.get("/api/admin/schools/credentials.csv", adminMiddleware, (_req, res) => {
    const files = latestCredentialsFiles();
    if (!files.csv || !fs.existsSync(files.csv)) {
      return res.status(404).json({
        success: false,
        message: "Početne lozinke nisu više dostupne. Za novi pristup koristi reset računa škole.",
      });
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="mojput-skole-pristup.csv"');
    return res.send(fs.readFileSync(files.csv));
  });

  app.get("/api/admin/schools/credentials.html", adminMiddleware, (_req, res) => {
    const files = latestCredentialsFiles();
    if (!files.html || !fs.existsSync(files.html)) {
      return res.status(404).json({
        success: false,
        message: "Početne lozinke nisu više dostupne. Za novi pristup koristi reset računa škole.",
      });
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(fs.readFileSync(files.html, "utf8"));
  });
}

module.exports = {
  registerSchoolCms,
  enrichUserWithSchool,
  generateSchoolPassword,
  SCHOOL_INTERNAL_EMAIL_DOMAIN,
  credentialsDir,
  truthyFlag,
};
