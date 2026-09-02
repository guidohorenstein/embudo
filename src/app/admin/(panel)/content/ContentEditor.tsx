"use client";

import { useState, useTransition } from "react";
import { saveContentAction } from "../../actions";
import type { SiteContent } from "@/lib/types";
import ImageField from "./ImageField";

export default function ContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();

  const patch = (updater: (draft: SiteContent) => void) =>
    setContent((prev) => {
      const next = structuredClone(prev);
      updater(next);
      return next;
    });

  const save = () =>
    startTransition(async () => {
      const result = await saveContentAction(JSON.stringify(content));
      setStatus(result.ok ? "saved" : "error");
    });

  const gallery = content.gallery.items;
  const move = (index: number, delta: number) =>
    patch((draft) => {
      const target = index + delta;
      if (target < 0 || target >= draft.gallery.items.length) return;
      const items = draft.gallery.items;
      [items[index], items[target]] = [items[target], items[index]];
    });

  return (
    <>
      <div className="panel">
        <h2>Page title and SEO</h2>
        <p className="hint">The text that shows up on Google and when the link is shared</p>
        <label className="f">
          <span>Page title</span>
          <input
            dir="auto"
            value={content.seo.title}
            onChange={(e) => patch((d) => void (d.seo.title = e.target.value))}
          />
        </label>
        <label className="f">
          <span>Meta description</span>
          <textarea
            dir="auto"
            value={content.seo.description}
            onChange={(e) => patch((d) => void (d.seo.description = e.target.value))}
          />
        </label>
      </div>

      <div className="panel">
        <h2>Hero</h2>
        <p className="hint">The first thing a visitor sees</p>
        <ImageField
          label="Background image"
          value={content.hero.image}
          onChange={(url) => patch((d) => void (d.hero.image = url))}
        />
        <label className="f">
          <span>Kicker (English)</span>
          <input
            value={content.hero.eyebrow}
            onChange={(e) => patch((d) => void (d.hero.eyebrow = e.target.value))}
          />
        </label>
        <div className="grid2">
          <label className="f">
            <span>First line</span>
            <input
              dir="auto"
              value={content.hero.titleLine1}
              onChange={(e) => patch((d) => void (d.hero.titleLine1 = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Highlighted line (in red)</span>
            <input
              dir="auto"
              value={content.hero.titleHighlight}
              onChange={(e) => patch((d) => void (d.hero.titleHighlight = e.target.value))}
            />
          </label>
        </div>
        <label className="f">
          <span>Subtitle</span>
          <textarea
            dir="auto"
            value={content.hero.subtitle}
            onChange={(e) => patch((d) => void (d.hero.subtitle = e.target.value))}
          />
        </label>
        <div className="grid2">
          <label className="f">
            <span>Primary button</span>
            <input
              dir="auto"
              value={content.hero.primaryCta}
              onChange={(e) => patch((d) => void (d.hero.primaryCta = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Secondary button</span>
            <input
              dir="auto"
              value={content.hero.secondaryCta}
              onChange={(e) => patch((d) => void (d.hero.secondaryCta = e.target.value))}
            />
          </label>
        </div>

        <h3 style={{ fontSize: ".95rem", margin: "18px 0 8px" }}>Trust stats</h3>
        <div className="grid3">
          {content.hero.stats.map((stat, index) => (
            <div key={index}>
              <label className="f">
                <span>Number {index + 1}</span>
                <input
                  dir="auto"
                  value={stat.value}
                  onChange={(e) => patch((d) => void (d.hero.stats[index].value = e.target.value))}
                />
              </label>
              <label className="f">
                <span>Caption {index + 1}</span>
                <input
                  dir="auto"
                  value={stat.label}
                  onChange={(e) => patch((d) => void (d.hero.stats[index].label = e.target.value))}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>About</h2>
        <div className="grid2">
          <ImageField
            label="Main image"
            value={content.about.mainImage}
            onChange={(url) => patch((d) => void (d.about.mainImage = url))}
          />
          <ImageField
            label="Detail image"
            value={content.about.detailImage}
            onChange={(url) => patch((d) => void (d.about.detailImage = url))}
          />
        </div>
        <div className="grid2">
          <label className="f">
            <span>Kicker (English)</span>
            <input
              value={content.about.eyebrow}
              onChange={(e) => patch((d) => void (d.about.eyebrow = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Round stamp</span>
            <input
              dir="auto"
              value={content.about.stamp}
              onChange={(e) => patch((d) => void (d.about.stamp = e.target.value))}
            />
          </label>
        </div>
        <label className="f">
          <span>Heading</span>
          <input
            dir="auto"
            value={content.about.title}
            onChange={(e) => patch((d) => void (d.about.title = e.target.value))}
          />
        </label>
        <label className="f">
          <span>First paragraph</span>
          <textarea
            dir="auto"
            value={content.about.paragraph1}
            onChange={(e) => patch((d) => void (d.about.paragraph1 = e.target.value))}
          />
        </label>
        <label className="f">
          <span>Second paragraph</span>
          <textarea
            dir="auto"
            value={content.about.paragraph2}
            onChange={(e) => patch((d) => void (d.about.paragraph2 = e.target.value))}
          />
        </label>
        <div className="grid2">
          {content.about.bullets.map((bullet, index) => (
            <label className="f" key={index}>
              <span>Bullet {index + 1}</span>
              <input
                dir="auto"
                value={bullet}
                onChange={(e) => patch((d) => void (d.about.bullets[index] = e.target.value))}
              />
            </label>
          ))}
        </div>
        <label className="f" style={{ maxWidth: 300 }}>
          <span>Signature</span>
          <input
            dir="auto"
            value={content.about.signature}
            onChange={(e) => patch((d) => void (d.about.signature = e.target.value))}
          />
        </label>
      </div>

      <div className="panel">
        <h2>Gallery</h2>
        <p className="hint">5 to 12 strong pieces works best. The first image renders larger.</p>
        <div className="grid2">
          <label className="f">
            <span>Kicker (English)</span>
            <input
              value={content.gallery.eyebrow}
              onChange={(e) => patch((d) => void (d.gallery.eyebrow = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Heading</span>
            <input
              dir="auto"
              value={content.gallery.title}
              onChange={(e) => patch((d) => void (d.gallery.title = e.target.value))}
            />
          </label>
        </div>
        <label className="f">
          <span>Intro text</span>
          <input
            dir="auto"
            value={content.gallery.intro}
            onChange={(e) => patch((d) => void (d.gallery.intro = e.target.value))}
          />
        </label>

        <div className="thumbs">
          {gallery.map((item, index) => (
            <div className="thumb" key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image || "data:,"} alt="" />
              <div className="thumb-body">
                <ImageField
                  label=""
                  compact
                  value={item.image}
                  onChange={(url) => patch((d) => void (d.gallery.items[index].image = url))}
                />
                <input
                  value={item.caption}
                  placeholder="Caption"
                  dir="auto"
                  onChange={(e) => patch((d) => void (d.gallery.items[index].caption = e.target.value))}
                />
                <input
                  value={item.alt}
                  placeholder="Alt text"
                  dir="auto"
                  onChange={(e) => patch((d) => void (d.gallery.items[index].alt = e.target.value))}
                />
                <div className="row">
                  <button
                    className="btn-a btn-ghost btn-sm"
                    type="button"
                    title="Move earlier"
                    onClick={() => move(index, -1)}
                  >
                    ←
                  </button>
                  <button
                    className="btn-a btn-ghost btn-sm"
                    type="button"
                    title="Move later"
                    onClick={() => move(index, 1)}
                  >
                    →
                  </button>
                  <button
                    className="btn-a btn-ghost btn-sm"
                    type="button"
                    onClick={() => patch((d) => void d.gallery.items.splice(index, 1))}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-a btn-ghost btn-sm"
          type="button"
          style={{ marginTop: 14 }}
          onClick={() =>
            patch((d) =>
              void d.gallery.items.push({
                id: crypto.randomUUID(),
                image: "",
                caption: "",
                alt: "",
              }),
            )
          }
        >
          + Add piece
        </button>
      </div>

      <div className="sticky-save">
        <button className="btn-a" type="button" onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </button>
        {status === "saved" && !pending ? <span className="saved">Saved ✓</span> : null}
        {status === "error" && !pending ? <span className="failed">Could not save</span> : null}
      </div>
    </>
  );
}
