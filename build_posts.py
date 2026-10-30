#!/usr/bin/env python3
"""
build_posts.py — генератор постов блога AnalyseDreams.

Работа:
  1. Читает исходники постов из blog/posts/*.md
     (markdown + frontmatter вверху между --- ... ---)
  2. Для каждого генерирует blog/<slug>.html по шаблону
  3. Перестраивает список карточек в blog/index.html
  4. Перегенерирует sitemap.xml

Формат .md:

  ---
  title: Заголовок поста
  date: 2026-10-30
  category: Теория
  slug: tibetskaya-kniga-mertvyh
  cover: /blog/cover-yung.svg
  preview: Короткое описание для карточки и SEO (1–2 предложения).
  reading_time: 7
  description: Описание для meta description (если нет — берётся preview)
  ---
  Текст в markdown. Поддержка:
    ## Заголовок секции       -> <h2 id="...">
    ### Подзаголовок          -> <h3>
    абзацы                    -> <p>
    **жирный**                -> <strong>
    *курсив*                  -> <em>
    - пункт                   -> <ul><li>
    1. пункт                  -> <ol><li>
    > цитата                  -> <blockquote>
    [текст](url)              -> <a href="url">текст</a>
    ![alt](src)               -> <figure><img><figcaption>

Особенности:
  - Промо-блок (@bot, analysedreams.com) в начале поста до первого ## удаляется.
  - Эмодзи в начале заголовков ## удаляются.
  - TOC строится автоматически из h2 (если их >= 2).

Запуск:
  python3 build_posts.py
"""

import glob
import os
import re
import html
import subprocess
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
BLOG_DIR = os.path.join(ROOT, "blog")
POSTS_SRC = os.path.join(BLOG_DIR, "posts")
INDEX_FILE = os.path.join(BLOG_DIR, "index.html")
SITEMAP_FILE = os.path.join(ROOT, "sitemap.xml")
DOMAIN = "https://analysedreams.com"

MONTHS_RU = {
    1: "января", 2: "февраля", 3: "марта", 4: "апреля",
    5: "мая", 6: "июня", 7: "июля", 8: "августа",
    9: "сентября", 10: "октября", 11: "ноября", 12: "декабря",
}

# Эмодзи в начале строки заголовка
EMOJI_LEAD_RE = re.compile(
    r"^[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D]+\s*"
)

# Промо-паттерны для отсечения шапки ТГ-поста
PROMO_PATTERNS = [
    "@dreams_analyse_bot",
    "analysedreams.com",
    "Бесплатный анализ сна",
    "Построить карту",
]

# Паттерны рекламных ссылок, которые удаляются из всего тела поста
AD_LINK_PATTERNS = ["t.me/"]


# ---------- разбор .md ----------

def parse_frontmatter(text):
    """Возвращает (meta dict, body str)."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    fm = text[3:end].strip()
    body = text[end + 4:].lstrip("\n")
    meta = {}
    for line in fm.splitlines():
        if ":" not in line:
            continue
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, body


def strip_emoji(s):
    """Убирает ведущие эмодзи и лишние пробелы."""
    return EMOJI_LEAD_RE.sub("", s).strip()


def slugify_h2(text):
    """id для h2 из текста заголовка (без эмодзи, без пунктуации)."""
    t = strip_emoji(text)
    t = re.sub(r"[^\w\s-]", "", t, flags=re.UNICODE)
    t = re.sub(r"\s+", "-", t.strip().lower())
    return t or "section"


def format_date(iso):
    """'2026-10-30' -> '30 октября 2026'."""
    try:
        d = date.fromisoformat(iso)
        return f"{d.day} {MONTHS_RU[d.month]} {d.year}"
    except Exception:
        return iso


# ---------- рендер markdown в HTML ----------

def escape(s):
    return html.escape(s, quote=False)


def render_inline(text):
    """Инлайн: **bold**, *italic*, [text](url)."""
    # Сначала запомним ссылки и картинки-плейсхолдеры, чтобы не портились регекспами.
    placeholders = []

    def stash(content):
        placeholders.append(content)
        return f"\x00{len(placeholders) - 1}\x00"

    # Картинки ![alt](src)
    text = re.sub(
        r"!\[([^\]]*)\]\(([^)]+)\)",
        lambda m: stash(
            f'<figure><img src="{escape(m.group(2))}" alt="{escape(m.group(1))}">'
            f'<figcaption>{escape(m.group(1))}</figcaption></figure>'
        ),
        text,
    )
    # Ссылки [text](url)
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: stash(
            f'<a href="{escape(m.group(2))}" target="_blank" rel="noopener">{escape(m.group(1))}</a>'
        ),
        text,
    )
    # Жирный **...**
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    # Курсив *...*
    text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
    # Возвращаем плейсхолдеры
    def unstash(m):
        return placeholders[int(m.group(1))]
    text = re.sub(r"\x00(\d+)\x00", unstash, text)
    return text


def render_markdown(body):
    """Рендерит markdown в HTML, возвращает (html, [(id, text), ...] для h2)."""
    # Удаляем промо-блок до первого заголовка ##
    lines = body.split("\n")
    first_h2 = next((i for i, l in enumerate(lines) if l.strip().startswith("## ")), None)
    if first_h2 is not None:
        # отсечь всё до первого ##, если в нём есть промо-паттерны
        head = "\n".join(lines[:first_h2])
        if any(p in head for p in PROMO_PATTERNS):
            lines = lines[first_h2:]
    body = "\n".join(lines).strip()

    # Удаляем рекламные ссылки на Telegram из всего тела поста
    body = "\n".join(
        l for l in body.split("\n") if not any(p in l for p in AD_LINK_PATTERNS)
    ).strip()

    out = []
    h2s = []
    i = 0
    n = len(lines := body.split("\n"))

    def flush_paragraph(buf):
        if buf:
            out.append("<p>" + render_inline(" ".join(buf)).strip() + "</p>")

    para = []
    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            flush_paragraph(para)
            para = []
            i += 1
            continue

        # Заголовки
        if stripped.startswith("## "):
            flush_paragraph(para)
            para = []
            text = strip_emoji(stripped[3:].strip())
            sid = slugify_h2(text)
            # уникальный id
            base, k = sid, 1
            while sid in [h[0] for h in h2s]:
                k += 1
                sid = f"{base}-{k}"
            h2s.append((sid, text))
            out.append(f'<h2 id="{sid}">{render_inline(text)}</h2>')
            i += 1
            continue
        if stripped.startswith("### "):
            flush_paragraph(para)
            para = []
            text = strip_emoji(stripped[4:].strip())
            out.append(f"<h3>{render_inline(text)}</h3>")
            i += 1
            continue

        # Цитата
        if stripped.startswith("> "):
            flush_paragraph(para)
            para = []
            quote_lines = []
            while i < n and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip()[1:].strip())
                i += 1
            out.append("<blockquote>" + render_inline(" ".join(quote_lines)) + "</blockquote>")
            continue

        # Неупорядоченный список
        if re.match(r"^[-*]\s+", stripped):
            flush_paragraph(para)
            para = []
            items = []
            while i < n and re.match(r"^[-*]\s+", lines[i].strip()):
                items.append("<li>" + render_inline(re.sub(r"^[-*]\s+", "", lines[i].strip())) + "</li>")
                i += 1
            out.append("<ul>" + "".join(items) + "</ul>")
            continue

        # Упорядоченный список
        if re.match(r"^\d+\.\s+", stripped):
            flush_paragraph(para)
            para = []
            items = []
            while i < n and re.match(r"^\d+\.\s+", lines[i].strip()):
                items.append("<li>" + render_inline(re.sub(r"^\d+\.\s+", "", lines[i].strip())) + "</li>")
                i += 1
            out.append("<ol>" + "".join(items) + "</ol>")
            continue

        # Обычный текст абзаца
        para.append(stripped)
        i += 1

    flush_paragraph(para)
    return "\n".join(out), h2s


# ---------- генерация HTML поста ----------

POST_TEMPLATE = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>{title_esc} — анализ снов | AnalyseDreams</title>
  <meta name="description" content="{description_esc}" />
  <link rel="canonical" href="{url}" />

  <meta property="og:title" content="{title_esc} — анализ снов | AnalyseDreams" />
  <meta property="og:description" content="{description_esc}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{og_image}" />
  <meta property="og:locale" content="ru_RU" />
  <meta property="article:published_time" content="{date_iso}" />
  <meta property="article:author" content="AnalyseDreams" />

  <link rel="icon" href="/favicon.png" sizes="32x32" />
  <link rel="shortcut icon" type="image/png" href="/favicon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="./blog.css?v=20261030-cards4" />

  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": {title_json},
    "description": {description_json},
    "datePublished": "{date_iso}",
    "dateModified": "{date_iso}",
    "image": "{og_image}",
    "author": {{ "@type": "Organization", "name": "AnalyseDreams" }},
    "publisher": {{
      "@type": "Organization",
      "name": "AnalyseDreams",
      "logo": {{ "@type": "ImageObject", "url": "{DOMAIN}/logo.jpeg" }}
    }},
    "mainEntityOfPage": "{url}"
  }}
  </script>

  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{ "@type": "ListItem", "position": 1, "name": "Главная", "item": "{DOMAIN}/" }},
      {{ "@type": "ListItem", "position": 2, "name": "Блог", "item": "{DOMAIN}/blog/" }},
      {{ "@type": "ListItem", "position": 3, "name": {title_json}, "item": "{url}" }}
    ]
  }}
  </script>
</head>

<body>
  <div class="blog-shell">

    <nav class="blog-topbar">
      <a class="brand" href="/" aria-label="Анализ снов — на главную">
        <img class="brand-logo" src="/logo.jpeg" alt="Логотип" />
        <span class="brand-name">Анализ снов</span>
      </a>
      <a class="top-link" href="/lk" target="_blank" rel="noopener">Войти</a>
    </nav>

    <nav class="crumbs" aria-label="Хлебные крошки">
      <a href="/">Главная</a>
      <span class="crumb-sep">/</span>
      <a href="/blog/">Блог</a>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">{title_esc}</span>
    </nav>

    <article>
      <header class="post-hero">
        <h1>{h1_html}</h1>
        <div class="post-meta">
          <span>{date_pretty}</span>{meta_extra}
        </div>

        <img class="post-cover" src="{cover}" alt="" />
      </header>

      <section class="post-cta-top">
        <a class="button" href="/#cta">Анализ сна бесплатно →</a>
      </section>

{toc_html}

      <div class="post-body">
{body_html}
      </div>

      <section class="post-cta">
        <h2>Хочешь разобрать свой сон?</h2>
        <p>
          Попробуй бесплатный анализ сновидения — сервис выделит символы, эмоции
          и предложит направления для понимания в юнгианском подходе.
        </p>
        <a class="button" href="/#cta">Анализировать сон бесплатно →</a>
      </section>

      <footer class="post-footer">
        <a href="/blog/">← Все статьи</a>
      </footer>

    </article>

  </div>
</body>
</html>
"""


def json_encode(s):
    import json
    return json.dumps(s, ensure_ascii=False)


def generate_post_html(meta, body_html, h2s):
    title = meta.get("title", "Без заголовка")
    slug = meta.get("slug", "post")
    date_iso = meta.get("date", "2026-01-01")
    category = meta.get("category")
    cover = meta.get("cover", "/blog/placeholder.svg")
    preview = meta.get("preview", "")
    description = meta.get("description", preview)
    reading_time = meta.get("reading_time", "")

    url = f"{DOMAIN}/blog/{slug}.html"
    og_image = cover if cover.startswith("http") else f"{DOMAIN}{cover}"

    # h1 с em-акцентом: *слово* в title -> <em>
    h1_html = render_inline(title)

    # meta extra: категория
    meta_bits = []
    if category:
        meta_bits.append(f'<span class="post-meta-dot"></span><span>{escape(category)}</span>')
    meta_extra = "".join(meta_bits)

    # TOC
    toc_html = ""
    if len(h2s) >= 2:
        toc_items = "".join(f'<li><a href="#{hid}">{render_inline(htext)}</a></li>' for hid, htext in h2s)
        toc_html = (
            '      <aside class="post-toc" aria-label="Оглавление">\n'
            '        <p class="post-toc-title">Оглавление</p>\n'
            f'        <ol>\n{toc_items}\n        </ol>\n'
            '      </aside>'
        )

    return POST_TEMPLATE.format(
        title_esc=escape(title),
        title_json=json_encode(title),
        description_esc=escape(description),
        description_json=json_encode(description),
        url=url,
        og_image=og_image,
        date_iso=date_iso,
        date_pretty=format_date(date_iso),
        h1_html=h1_html,
        meta_extra=meta_extra,
        cover=cover,
        toc_html=toc_html,
        body_html=body_html,
        DOMAIN=DOMAIN,
    )


# ---------- список блога ----------

INDEX_LIST_RE = re.compile(
    r'(<section class="blog-list">)(.*?)(</section>)',
    re.DOTALL,
)


def generate_card(meta):
    title = meta.get("title", "")
    slug = meta.get("slug", "post")
    cover = meta.get("cover", "/blog/placeholder.svg")
    category = meta.get("category", "")
    preview = meta.get("preview", "")
    date_iso = meta.get("date", "")
    h1_html = render_inline(title)
    date_pretty = format_date(date_iso)
    cat_label = f" · {escape(category)}" if category else ""
    return (
        f'      <a class="post-card" href="./{slug}.html">\n'
        f'        <img class="post-card-cover" src="{cover}" alt="" loading="lazy" />\n'
        f'        <span class="post-card-date">{date_pretty}{cat_label}</span>\n'
        f'        <h2>{h1_html}</h2>\n'
        f'        <p>{escape(preview)}</p>\n'
        f'        <span class="post-card-readmore">Читать →</span>\n'
        f'      </a>'
    )


def update_index(posts):
    """posts: список meta dict, отсортированный по дате desc."""
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    cards = "\n\n".join(generate_card(m) for m in posts)
    new_block = f'<section class="blog-list">\n\n{cards}\n\n    </section>'
    new_content, n = INDEX_LIST_RE.subn(new_block, content)
    if n == 0:
        print("WARN: не нашёл <section class=\"blog-list\"> в blog/index.html")
        return
    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)


# ---------- sitemap ----------

def generate_sitemap(posts):
    urls = [f"  <url>\n    <loc>{DOMAIN}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>",
            f"  <url>\n    <loc>{DOMAIN}/blog/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>"]
    for m in posts:
        slug = m.get("slug", "post")
        date_iso = m.get("date", "")
        urls.append(
            f"  <url>\n    <loc>{DOMAIN}/blog/{slug}.html</loc>\n"
            f"    <lastmod>{date_iso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n</urlset>\n"
    )
    with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
        f.write(xml)


# ---------- автосжатие картинок ----------

IMG_DIR = os.path.join(BLOG_DIR, "img")
MAX_WIDTH = 800         # макс. ширина/высота в px
MAX_SIZE = 150 * 1024   # порог веса файла, выше которого сжимаем (150 КБ)
JPEG_QUALITY = 65
IMG_EXTS = (".jpg", ".jpeg", ".png", ".webp")


def image_width(path):
    """Возвращает ширину картинки в px через sips, или None."""
    try:
        out = subprocess.run(
            ["sips", "-g", "pixelWidth", path],
            capture_output=True, text=True, check=True,
        )
        m = re.search(r"pixelWidth:\s*(\d+)", out.stdout)
        return int(m.group(1)) if m else None
    except Exception:
        return None


def needs_optimize(path):
    """True если ширина > MAX_WIDTH или вес > MAX_SIZE."""
    if os.path.getsize(path) > MAX_SIZE:
        return True
    w = image_width(path)
    return w is not None and w > MAX_WIDTH


def optimize_image(path):
    """Сжимает картинку in-place через sips. True если успешно."""
    ext = os.path.splitext(path)[1].lower()
    if ext in (".jpg", ".jpeg"):
        cmd = ["sips", "-Z", str(MAX_WIDTH),
               "-s", "format", "jpeg", "-s", "formatOptions", str(JPEG_QUALITY),
               path, "--out", path]
    elif ext == ".png":
        cmd = ["sips", "-Z", str(MAX_WIDTH), path, "--out", path]
    else:
        # webp и прочие — sips не умеет webp output, пропускаем
        return False
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        return True
    except Exception as e:
        print(f"  WARN: не удалось сжать {os.path.basename(path)}: {e}")
        return False


def optimize_images():
    """Проходит по blog/img/ и сжимает тяжёлые/крупные картинки."""
    if not os.path.isdir(IMG_DIR):
        return
    files = [f for f in sorted(os.listdir(IMG_DIR))
             if os.path.splitext(f)[1].lower() in IMG_EXTS]
    if not files:
        return
    print("Картинки:")
    for fn in files:
        path = os.path.join(IMG_DIR, fn)
        before = os.path.getsize(path)
        if needs_optimize(path):
            if optimize_image(path):
                after = os.path.getsize(path)
                print(f"  сжато: blog/img/{fn}  {before//1024} КБ -> {after//1024} КБ")
            else:
                print(f"  пропущено: blog/img/{fn}  {before//1024} КБ (формат не поддержан)")
        else:
            print(f"  ок: blog/img/{fn}  {before//1024} КБ")


# ---------- main ----------

def main():
    optimize_images()

    md_files = sorted(glob.glob(os.path.join(POSTS_SRC, "*.md")))
    if not md_files:
        print("Нет .md файлов в blog/posts/")
        return

    metas = []
    for md in md_files:
        with open(md, "r", encoding="utf-8") as f:
            text = f.read()
        meta, body = parse_frontmatter(text)
        if not meta.get("slug"):
            meta["slug"] = os.path.splitext(os.path.basename(md))[0]
        if not meta.get("cover"):
            meta["cover"] = "/blog/placeholder.svg"
        else:
            cover_path = meta["cover"]
            if not cover_path.startswith("http"):
                local = os.path.join(ROOT, cover_path.lstrip("/"))
                if not os.path.exists(local):
                    print(f"  WARN: обложка не найдена: {cover_path} (в {os.path.basename(md)})")
        body_html, h2s = render_markdown(body)
        html_str = generate_post_html(meta, body_html, h2s)
        out_path = os.path.join(BLOG_DIR, meta["slug"] + ".html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html_str)
        print(f"  собран: blog/{meta['slug']}.html")
        metas.append(meta)

    # сортировка по дате desc
    metas.sort(key=lambda m: m.get("date", ""), reverse=True)
    update_index(metas)
    generate_sitemap(metas)
    print(f"\nГотово. Постов: {len(metas)}. Обновлены blog/index.html и sitemap.xml.")


if __name__ == "__main__":
    main()