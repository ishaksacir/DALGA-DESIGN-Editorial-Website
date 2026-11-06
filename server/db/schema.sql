-- Catalogue pieces. Visible text is stored as `{ "bs": …, "en": … }` JSON, the same shape the site reads,
-- so a row maps straight onto a product object. Safe to run repeatedly (`npm run db:migrate`).

CREATE TABLE IF NOT EXISTS products (
  id          text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  number      text NOT NULL,
  year        smallint NOT NULL CHECK (year BETWEEN 1900 AND 2200),
  name        jsonb NOT NULL,
  category    jsonb NOT NULL,
  collection  jsonb NOT NULL,
  -- First image is the catalogue cover; the rest form the product gallery.
  images      text[] NOT NULL CHECK (cardinality(images) > 0),
  alt         jsonb NOT NULL,
  intro       jsonb NOT NULL,
  description jsonb NOT NULL,
  composition jsonb NOT NULL,
  creation    jsonb,
  -- [[label, value], …], each a `{ bs, en }` object.
  specs       jsonb NOT NULL DEFAULT '[]',
  -- [{ bs, en }, …]
  care        jsonb NOT NULL DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Category filters and the admin search look pieces up by their English category.
CREATE INDEX IF NOT EXISTS products_category_en ON products ((category ->> 'en'));
