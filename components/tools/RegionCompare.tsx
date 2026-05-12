"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildComparisonText } from "@/lib/compare-copy";
import type { RegionProfile } from "@/lib/region-profiles";
import styles from "./RegionCompare.module.css";

type Props = {
  profiles: RegionProfile[];
  initialA?: string;
  initialB?: string;
};

function RegionStatCard({ profile }: { profile: RegionProfile }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>{profile.nombre}</h2>
      <dl className={styles.stats}>
        <div className={styles.row}>
          <dt className={styles.term}>Capacidad ERNC</dt>
          <dd className={styles.value}>
            {profile.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.term}>Participacion nacional</dt>
          <dd className={styles.value}>{profile.nationalSharePct.toFixed(1)}%</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.term}>Tecnologia principal</dt>
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
        <Link href={`/regiones/${profile.slug}`}>Ver region</Link>
      </p>
    </article>
  );
}

export function RegionCompare({ profiles, initialA, initialB }: Props) {
  const searchParams = useSearchParams();
  const queryA = searchParams.get("a");
  const queryB = searchParams.get("b");
  const [manualSelection, setManualSelection] = useState<{ a: string; b: string } | null>(
    null,
  );
  const defaultA = initialA ?? profiles[0]?.slug ?? "";
  const defaultB = initialB ?? profiles[1]?.slug ?? profiles[0]?.slug ?? "";
  const slugA =
    manualSelection?.a ??
    (queryA && profiles.some((profile) => profile.slug === queryA) ? queryA : defaultA);
  const slugB =
    manualSelection?.b ??
    (queryB && profiles.some((profile) => profile.slug === queryB) ? queryB : defaultB);
  const profileA = profiles.find((profile) => profile.slug === slugA);
  const profileB = profiles.find((profile) => profile.slug === slugB);
  const comparison = profileA && profileB ? buildComparisonText(profileA, profileB) : null;

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <label className={styles.label}>
          <span>Region A</span>
          <select
            className={styles.select}
            value={slugA}
            onChange={(event) =>
              setManualSelection({
                a: event.target.value,
                b: manualSelection?.b ?? slugB,
              })
            }
          >
            {profiles.map((profile) => (
              <option key={profile.slug} value={profile.slug}>
                {profile.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          <span>Region B</span>
          <select
            className={styles.select}
            value={slugB}
            onChange={(event) =>
              setManualSelection({
                a: manualSelection?.a ?? slugA,
                b: event.target.value,
              })
            }
          >
            {profiles.map((profile) => (
              <option key={profile.slug} value={profile.slug}>
                {profile.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {profileA && profileB ? (
        <>
          <div className={styles.grid}>
            <RegionStatCard profile={profileA} />
            <RegionStatCard profile={profileB} />
          </div>
          <p className={styles.summary}>{comparison}</p>
          <p className={styles.links}>
            <Link href={`/regiones/${profileA.slug}`}>Ir a {profileA.nombre}</Link>
            <Link href={`/regiones/${profileB.slug}`}>Ir a {profileB.nombre}</Link>
          </p>
        </>
      ) : null}
    </div>
  );
}
