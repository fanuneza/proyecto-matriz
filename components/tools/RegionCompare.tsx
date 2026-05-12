"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildComparisonText } from "@/lib/compare-copy";
import type { RegionProfile } from "@/lib/region-profiles";

type Props = {
  profiles: RegionProfile[];
  initialA?: string;
  initialB?: string;
};

function RegionStatCard({ profile }: { profile: RegionProfile }) {
  return (
    <article
      style={{
        border: "1px solid var(--border)",
        padding: "1rem",
        background: "var(--bg-surface)",
      }}
    >
      <h2 style={{ fontSize: "var(--step-1)", marginBottom: "0.75rem" }}>{profile.nombre}</h2>
      <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem" }}>
        <dt>Capacidad ERNC</dt>
        <dd>{profile.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</dd>
        <dt>Participacion nacional</dt>
        <dd>{profile.nationalSharePct.toFixed(1)}%</dd>
        <dt>Tecnologia principal</dt>
        <dd>{profile.mainTecnologia ?? "-"}</dd>
        {profile.nbMw !== null ? (
          <>
            <dt>Net billing</dt>
            <dd>{profile.nbMw.toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW</dd>
          </>
        ) : null}
        {profile.pipelineMw !== null ? (
          <>
            <dt>Pipeline</dt>
            <dd>
              {profile.pipelineMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
            </dd>
          </>
        ) : null}
      </dl>
      <p style={{ marginTop: "1rem" }}>
        <Link href={`/regiones/${profile.slug}`}>Ver region →</Link>
      </p>
    </article>
  );
}

export function RegionCompare({ profiles, initialA, initialB }: Props) {
  const searchParams = useSearchParams();
  const queryA = searchParams.get("a");
  const queryB = searchParams.get("b");
  const [manualSelection, setManualSelection] = useState<{
    a: string;
    b: string;
  } | null>(null);
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
  const comparison =
    profileA && profileB ? buildComparisonText(profileA, profileB) : null;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
          gap: "1rem",
        }}
      >
        <label>
          <span>Region A</span>
          <select
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
        <label>
          <span>Region B</span>
          <select
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
              gap: "1rem",
            }}
          >
            <RegionStatCard profile={profileA} />
            <RegionStatCard profile={profileB} />
          </div>
          <p>{comparison}</p>
          <p style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href={`/regiones/${profileA.slug}`}>Ir a {profileA.nombre}</Link>
            <Link href={`/regiones/${profileB.slug}`}>Ir a {profileB.nombre}</Link>
          </p>
        </>
      ) : null}
    </div>
  );
}
