"use client";

function BirdFlock({ className }: { className: string }) {
  return (
    <svg
      className={`above-bird-flock ${className}`}
      viewBox="0 0 360 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="above-bird above-bird-1" transform="translate(68 48)">
        <g className="above-bird-wing above-bird-wing-left">
          <path d="M0 0 C-10 -12 -22 -12 -32 0" />
        </g>
        <g className="above-bird-wing above-bird-wing-right">
          <path d="M0 0 C10 -12 22 -12 32 0" />
        </g>
      </g>
      <g className="above-bird above-bird-2" transform="translate(174 72)">
        <g className="above-bird-wing above-bird-wing-left">
          <path d="M0 0 C-8 -10 -18 -10 -26 0" />
        </g>
        <g className="above-bird-wing above-bird-wing-right">
          <path d="M0 0 C8 -10 18 -10 26 0" />
        </g>
      </g>
      <g className="above-bird above-bird-3" transform="translate(273 42)">
        <g className="above-bird-wing above-bird-wing-left">
          <path d="M0 0 C-9 -11 -20 -11 -29 0" />
        </g>
        <g className="above-bird-wing above-bird-wing-right">
          <path d="M0 0 C9 -11 20 -11 29 0" />
        </g>
      </g>
      <g className="above-bird above-bird-4" transform="translate(298 88)">
        <g className="above-bird-wing above-bird-wing-left">
          <path d="M0 0 C-6 -8 -14 -8 -20 0" />
        </g>
        <g className="above-bird-wing above-bird-wing-right">
          <path d="M0 0 C6 -8 14 -8 20 0" />
        </g>
      </g>
    </svg>
  );
}

function PaperCloudLayer() {
  return (
    <svg
      className="above-paper-cloud-layer"
      viewBox="-180 0 1960 520"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="paper-cloud-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf2" stopOpacity="0.96" />
          <stop offset="0.62" stopColor="#f4f2e4" stopOpacity="0.84" />
          <stop offset="1" stopColor="#dfe6dc" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id="paper-cloud-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="1" stopColor="#c8d5cf" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <g className="above-paper-cloud-group above-paper-cloud-group-back">
        <path
          d="M-72 190C-12 134 76 126 138 162C172 105 258 92 330 120C376 82 466 86 526 132C570 166 574 212 528 238C408 252 286 248 164 240C54 232 -32 222 -78 208C-92 202 -88 196 -72 190Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M-34 188c72-44 128-38 172-26 44-54 118-64 190-36 60-40 134-28 184 12" stroke="url(#paper-cloud-edge)" strokeWidth="3" />
      </g>

      <g className="above-paper-cloud-group above-paper-cloud-group-left">
        <path
          d="M-110 338C-35 268 82 254 164 304C218 220 352 188 464 232C536 170 662 186 742 258C800 310 792 374 724 408C566 422 410 414 252 402C100 390 -28 374 -112 354C-134 348 -132 344 -110 338Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M-70 334c92-58 168-58 234-30 62-82 176-98 286-60 92-62 198-50 270 18" stroke="url(#paper-cloud-edge)" strokeWidth="4" />
      </g>

      <g className="above-paper-cloud-group above-paper-cloud-group-low-left">
        <path
          d="M-76 430C-20 374 68 364 138 404C184 346 288 326 366 366C428 336 512 350 558 396C588 426 584 462 548 486C424 496 302 494 178 486C58 478 -32 462 -78 446C-96 440 -94 436 -76 430Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M-42 428c64-42 124-42 180-24 54-56 138-66 220-30 68-30 146-12 188 32" stroke="url(#paper-cloud-edge)" strokeWidth="3" />
      </g>

      <g className="above-paper-cloud-group above-paper-cloud-group-high-left">
        <path
          d="M260 112C308 72 374 74 420 106C452 66 518 62 564 94C598 118 604 154 576 178C506 184 432 184 358 178C306 174 274 164 256 146C246 134 248 122 260 112Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M284 112c52-26 96-24 136-6 38-38 92-38 132-10" stroke="url(#paper-cloud-edge)" strokeWidth="2.4" />
      </g>

      <g className="above-paper-cloud-group above-paper-cloud-group-high-mid">
        <path
          d="M704 136C748 100 810 100 856 132C884 96 944 90 988 118C1022 140 1030 172 1006 196C940 204 868 202 798 196C748 192 718 182 702 164C692 154 694 144 704 136Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M728 136c48-25 88-24 128-4 34-35 86-36 124-12" stroke="url(#paper-cloud-edge)" strokeWidth="2.2" />
      </g>

      <g className="above-paper-cloud-group above-paper-cloud-group-sun-side">
        <path
          d="M1068 188C1112 154 1172 154 1218 184C1248 148 1306 146 1350 174C1382 194 1388 226 1364 248C1298 256 1228 254 1158 248C1110 244 1080 234 1064 216C1054 206 1056 196 1068 188Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M1092 188c44-23 84-22 126-3 34-32 82-32 118-10" stroke="url(#paper-cloud-edge)" strokeWidth="2.2" />
      </g>

      <g className="above-paper-cloud-group above-paper-cloud-group-right">
        <path
          d="M1200 306C1254 244 1346 236 1420 276C1466 222 1556 214 1626 258C1672 288 1692 334 1672 372C1586 394 1484 398 1380 388C1284 380 1220 360 1196 336C1184 324 1186 314 1200 306Z"
          fill="url(#paper-cloud-face)"
        />
        <path d="M1228 304c62-42 126-40 192-28 50-50 134-48 192-14" stroke="url(#paper-cloud-edge)" strokeWidth="3" />
      </g>
    </svg>
  );
}

function VietnamFlagOnRock() {
  return (
    <g className="ha-long-vietnam-flag" transform="translate(222 -34) scale(1.1)">
      <path className="ha-long-flag-pole" d="M0 58V3" />
      <g className="ha-long-flag-cloth-wrap" transform="translate(1 5)">
        <path className="ha-long-flag-cloth" d="M0 0C11 -4 22 3 34 0C34 10 34 21 34 31C22 34 11 26 0 31Z" />
        <path className="ha-long-flag-star" d="M17 8.2 19.6 13.4 25.4 14.2 21.2 18.1 22.2 23.8 17 21 11.8 23.8 12.8 18.1 8.6 14.2 14.4 13.4Z" />
      </g>
    </g>
  );
}

function HaLongHorizon() {
  return (
    <svg
      className="ha-long-horizon"
      viewBox="0 0 520 190"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="ha-long-rock ha-long-rock-left" transform="translate(-13 -12) scale(1.08)">
        <path
          className="ha-long-rock-body"
          d="M149 156C160 145 164 132 161 116C157 98 163 82 177 70C171 58 177 44 190 40C197 30 209 27 222 30C233 33 240 42 244 54C248 66 246 78 238 88C244 100 244 114 236 124C242 136 240 148 223 156H149Z"
        />
        <VietnamFlagOnRock />
        <path className="ha-long-rock-facet ha-long-rock-facet-left-a" d="M166 153C176 129 177 103 190 77C201 94 202 123 193 154Z" />
        <path className="ha-long-rock-shadow" d="M149 156C161 146 167 130 166 112C175 132 184 145 200 156Z" />
        <path className="ha-long-crack" d="M190 62C202 82 195 101 204 121" />
        <path className="ha-long-crack" d="M216 51C222 72 214 92 220 112" />
        <path className="ha-long-crack" d="M174 101C186 115 180 131 188 146" />
      </g>

      <g className="ha-long-rock ha-long-rock-right">
        <path
          className="ha-long-rock-body"
          d="M259 156C251 145 253 130 264 121C252 109 255 91 269 83C263 69 271 55 285 53C288 42 300 35 314 38C328 35 344 42 351 56C364 64 372 78 374 94C386 103 395 120 398 136C389 147 376 154 358 156H259Z"
        />
        <path className="ha-long-rock-facet ha-long-rock-facet-right-a" d="M278 154C288 132 291 105 286 80C305 96 313 127 304 156Z" />
        <path className="ha-long-rock-shadow" d="M360 156C374 150 391 143 408 137C396 154 378 159 360 156Z" />
        <path className="ha-long-crack" d="M292 66C300 86 293 107 301 128" />
        <path className="ha-long-crack" d="M326 56C337 78 330 100 340 122" />
        <path className="ha-long-crack" d="M272 112C282 125 278 139 286 150" />
      </g>

      <path className="ha-long-reflection" d="M140 164c42-8 91-8 134 0M258 164c50-9 108-9 154 0" />
    </svg>
  );
}

function ArrivalBoat() {
  return (
    <svg
      className="arrival-boat"
      viewBox="0 0 140 90"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="arrival-boat-sail" d="M68 8 116 50H68Z" />
      <path className="arrival-boat-sail arrival-boat-sail-small" d="M65 18 31 52h34Z" />
      <path className="arrival-boat-mast" d="M67 7v58" />
      <path className="arrival-boat-hull" d="M13 58c38 17 86 17 121 0-10 20-31 29-63 29-31 0-50-9-58-29Z" />
      <path className="arrival-boat-ripple" d="M4 70c24-5 48-5 72 0M86 70c18-4 34-4 50 0" />
    </svg>
  );
}

function SeaWaveCrestRow({ className }: { className: string }) {
  const wave =
    "M0 20C25 5 75 5 100 20C125 35 175 35 200 20C225 5 275 5 300 20C325 35 375 35 400 20C425 5 475 5 500 20C525 35 575 35 600 20C625 5 675 5 700 20C725 35 775 35 800 20";
  return (
    <svg
      className={`above-sea-wave-crest ${className}`}
      viewBox="0 0 1600 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="sea-wave-crest-line" d={wave} />
      <path className="sea-wave-crest-line" d={wave} transform="translate(800,0)" />
    </svg>
  );
}

export default function AboveWaterScenery() {
  return (
    <div className="above-water-scenery absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="above-depth-far">
        <div className="above-sky-haze" />
        <div className="above-sky-warm-wash" />
        <PaperCloudLayer />
        <BirdFlock className="above-bird-flock-1" />
        <BirdFlock className="above-bird-flock-2" />
        <BirdFlock className="above-bird-flock-3" />
        <BirdFlock className="above-bird-flock-4 above-bird-flock-reverse" />
        <BirdFlock className="above-bird-flock-5 above-bird-flock-reverse" />
        <div className="above-sun-cluster">
          <div className="above-sun-glow" />
          <div className="above-sun-bloom" />
          <div className="above-sun-disc" />
        </div>
        <HaLongHorizon />
      </div>

      <div className="above-depth-mid">
        <div className="above-horizon-line" />
        <div className="above-horizon-edge" />
        <div className="above-horizon-blend" />
        <div className="above-horizon-warmth" />
        <div className="above-horizon-swell above-horizon-swell-1" />
        <div className="above-horizon-swell above-horizon-swell-2" />
        <div className="above-water-plane" />
        <div className="above-sun-reflection" />
        <div className="above-golden-current above-golden-current-1" />
        <div className="above-golden-current above-golden-current-2" />
        <div className="above-golden-current above-golden-current-3" />
        <div className="above-water-contours above-water-contours-1" />
        <div className="above-water-contours above-water-contours-2" />
        <div className="above-paper-reflection" />
        <SeaWaveCrestRow className="above-sea-wave-crest-1" />
        <SeaWaveCrestRow className="above-sea-wave-crest-2" />
        <div className="above-wave-ridges above-wave-ridges-1" />
        <div className="above-wave-ridges above-wave-ridges-2" />
        <div className="above-wave-glint above-wave-glint-1" />
        <div className="above-wave-glint above-wave-glint-2" />
        <div className="above-wave-glint above-wave-glint-3" />
        <div className="above-water-sheen above-water-sheen-1" />
        <div className="above-water-sheen above-water-sheen-2" />
        <ArrivalBoat />
      </div>

      <div className="above-depth-near">
        <div className="above-wave-lap above-wave-lap-1" />
        <div className="above-wave-lap above-wave-lap-2" />
        <div className="above-foam above-foam-1" />
        <div className="above-foam above-foam-2" />
        <div className="above-foam-mist" />
        <div className="above-card-glow" />
      </div>
    </div>
  );
}
