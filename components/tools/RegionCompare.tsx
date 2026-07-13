"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buildComparisonText } from "@/lib/compare-copy";
import type { RegionProfile } from "@/lib/region-profiles";
import styles from "./RegionCompare.module.css";

type Props = {
  profiles: RegionProfile[];
  initialA?: string;
  initialB?: string;
};

function RegionStatCard({ profile, winner }: { profile: RegionProfile; winner: boolean }) {
  return (
    <article className={`${styles.card} ${winner ? styles.cardWinner : ""}`}>
      <h2 className={styles.cardTitle}>{profile.nombre}</h2>
      <dl className={styles.stats}>
        <div className={styles.row}>
          <dt className={styles.term}>Capacidad ERNC</dt>
          <dd className={styles.value}>
            {profile.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.term}>Participación nacional</dt>
          <dd className={styles.value}>{profile.nationalSharePct.toFixed(1)}%</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.term}>Tecnología principal</dt>
          <dd className={styles.value}>{profile.mainTecnologia ?? "-"}</dd>
        </div>
        {profile.nbMw !== null ? (
          <div className={styles.row}>
            <dt className={styles.term}>Net billing</dt>
            <dd className={styles.value}>
              {profile.nbMw.toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW
            </dd>
          </div>
        ) : null}
        {profile.pipelineMw !== null ? (
          <div className={styles.row}>
            <dt className={styles.term}>Pipeline</dt>
            <dd className={styles.value}>
              {profile.pipelineMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
            </dd>
          </div>
        ) : null}
      </dl>
      <p>
        <Link href={`/regiones/${profile.slug}`}>Ver región</Link>
      </p>
    </article>
  );
}

export function RegionCompare({ profiles, initialA, initialB }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryA = searchParams.get("a");
  const queryB = searchParams.get("b");
  const [manualSelection, setManualSelection] = useState<{ a: string; b: string } | null>(null);

  const defaultA = initialA ?? profiles[0]?.slug ?? "";
  const defaultB = initialB ?? profiles[1]?.slug ?? profiles[0]?.slug ?? "";
  const slugA =
    manualSelection?.a ??
    (queryA && profiles.some((p) => p.slug === queryA) ? queryA : defaultA);
  const slugB =
    manualSelection?.b ??
    (queryB && profiles.some((p) => p.slug === queryB) ? queryB : defaultB);

  const profileA = profiles.find((p) => p.slug === slugA);
  const profileB = profiles.find((p) => p.slug === slugB);
  const comparison = profileA && profileB ? buildComparisonText(profileA, profileB) : null;
  const aWins = profileA && profileB ? profileA.erncMw >= profileB.erncMw : false;

  function updateSelection(newA: string, newB: string) {
    setManualSelection({ a: newA, b: newB });
    router.replace(`/comparar?a=${newA}&b=${newB}`, { scroll: false });
  }

  function handleSwap() {
    updateSelection(slugB, slugA);
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <label className={styles.label}>
          <span>Región A</span>
          <select
            className={styles.select}
            value={slugA}
            onChange={(e) => updateSelection(e.target.value, slugB)}
          >
            {profiles.map((p) => (
              <option key={p.slug} value={p.slug}>{p.nombre}</option>
            ))}
          </select>
          <svg className={styles.selectChevron} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
            <path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </label>

        <button
          className={styles.swapButton}
          onClick={handleSwap}
          aria-label="Intercambiar regiones"
          title="Intercambiar regiones"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 5h11M9 2l3 3-3 3M15 11H4M6 8l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <label className={styles.label}>
          <span>Región B</span>
          <select
            className={styles.select}
            value={slugB}
            onChange={(e) => updateSelection(slugA, e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.slug} value={p.slug}>{p.nombre}</option>
            ))}
          </select>
          <svg className={styles.selectChevron} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
            <path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </label>
      </div>

      {profileA && profileB ? (
        <>
          <div className={styles.grid}>
            <RegionStatCard profile={profileA} winner={aWins} />
            <RegionStatCard profile={profileB} winner={!aWins} />
          </div>
          <p className={styles.summary}>{comparison}</p>
          <div className={styles.links}>
            <Link href={`/regiones/${profileA.slug}`}>Ir a {profileA.nombre}</Link>
            <Link href={`/regiones/${profileB.slug}`}>Ir a {profileB.nombre}</Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
