export default function AuthBrandPanel({ eyebrow, headline, mobileHeadline, tagline, stats }) {
    const ContourLines = ({ count, viewBox }) => (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
            viewBox={viewBox}
            fill="none"
            preserveAspectRatio="xMidYMax slice"
        >
            {[...Array(count)].map((_, i) => (
                <path
                    key={i}
                    d={`M -50 ${(count === 9 ? 780 : 90) - i * (count === 9 ? 70 : 24)} Q 150 ${(count === 9 ? 740 : 60) - i * (count === 9 ? 70 : 24)} 250 ${(count === 9 ? 790 : 95) - i * (count === 9 ? 70 : 24)} T 550 ${(count === 9 ? 760 : 70) - i * (count === 9 ? 70 : 24)}`}
                    stroke="#D9A441"
                    strokeWidth="1.5"
                    fill="none"
                />
            ))}
        </svg>
    );

    return (
        <>
            {/* Desktop — full left panel */}
            <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-[#24402C] px-10 py-12 text-[#FAF8F3] lg:flex">
                <ContourLines count={9} viewBox="0 0 500 800" />

                <div className="relative flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9A441]/50 text-xs font-semibold tracking-wide text-[#D9A441]">
                        MAO
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#FAF8F3]/70">
                        Sta. Cruz &middot; Davao del Sur
                    </span>
                </div>

                <div className="relative">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#D9A441]">
                        {eyebrow}
                    </p>
                    <h1
                        className="text-[2.35rem] font-medium leading-[1.15] text-[#FAF8F3]"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        {headline}
                    </h1>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FAF8F3]/70">
                        {tagline}
                    </p>

                    <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-[#D9A441]/25 pt-6">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <dt className="text-xs uppercase tracking-wide text-[#FAF8F3]/50">{stat.label}</dt>
                                <dd
                                    className="mt-1 text-xl font-medium text-[#D9A441]"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <p className="relative text-xs text-[#FAF8F3]/40">Municipal Agriculture Office</p>
            </div>

            {/* Mobile — condensed top band, keeps the identity instead of dropping it */}
            <div className="relative overflow-hidden bg-[#24402C] px-5 pb-5 pt-6 text-[#FAF8F3] lg:hidden">
                <ContourLines count={4} viewBox="0 0 400 100" />

                <div className="relative flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9A441]/50 text-[10px] font-semibold tracking-wide text-[#D9A441]">
                        MAO
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#FAF8F3]/70">
                        Sta. Cruz &middot; Davao del Sur
                    </span>
                </div>

                <h1
                    className="relative mt-3 text-xl font-medium leading-snug text-[#FAF8F3]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    {mobileHeadline}
                </h1>

                <dl className="relative mt-4 flex gap-6 border-t border-[#D9A441]/25 pt-3">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <dt className="text-[10px] uppercase tracking-wide text-[#FAF8F3]/50">{stat.label}</dt>
                            <dd
                                className="text-base font-medium text-[#D9A441]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </>
    );
}