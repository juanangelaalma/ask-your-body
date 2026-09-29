import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Credits and anatomy data',
  description: 'Sources, licences and scope for Ask Your Body.',
};

export default function AttributionPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[720px] px-6 py-12">
      <Link href="/" className="btn btn-ghost btn-sm !px-0">
        Back to Ask Your Body
      </Link>

      <h1 className="type-h1 mt-6 text-ink">Credits and anatomy data</h1>
      <p className="type-body-lg mt-3 text-quiet-strong">
        Ask Your Body explains anatomy through conversation and an interactive 3D reference. The geometry is not ours,
        and it comes with its own licence.
      </p>

      <section className="surface-flat mt-8 p-6">
        <h2 className="type-h2 text-ink">BodyParts3D</h2>
        <p className="type-body-sm mt-2 text-quiet-strong">
          The 3D reference is BodyParts3D 4.0, an adult male reference anatomy from the Database Center for Life Science
          (DBCLS), licensed under CC Attribution 4.0 International. This build renders 2,234 individual meshes grouped
          into 3,432 named concepts across 15 systems, from roughly 33 MB of compressed geometry.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <a className="type-body-sm text-sage-text underline" href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer">
              BodyParts3D project
            </a>
          </li>
          <li>
            <a
              className="type-body-sm text-sage-text underline"
              href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
              target="_blank"
              rel="noreferrer"
            >
              Dataset licence (CC BY 4.0)
            </a>
          </li>
        </ul>
      </section>

      <section className="surface-flat mt-5 p-6">
        <h2 className="type-h2 text-ink">Human Atlas</h2>
        <p className="type-body-sm mt-2 text-quiet-strong">
          The 3D renderer, geometry batching and interaction model come from the Human Atlas project, whose original
          application code is released under the MIT License. Ask Your Body keeps that renderer and adds a semantic
          scene layer on top of it.
        </p>
        <a
          className="type-body-sm mt-2 inline-block text-sage-text underline"
          href="https://github.com/ashemag/human-atlas"
          target="_blank"
          rel="noreferrer"
        >
          Human Atlas on GitHub
        </a>
      </section>

      <section className="surface-flat mt-5 p-6">
        <h2 className="type-h2 text-ink">Scope and limits</h2>
        <p className="type-body-sm mt-2 text-quiet-strong">
          The reference does not contain every human structure or variation, and named concepts can group several
          meshes. Colours and system groupings are designed for exploration. Ask Your Body is for anatomy education and
          general information. It does not provide medical diagnoses and does not replace professional medical care.
        </p>
      </section>
    </main>
  );
}
