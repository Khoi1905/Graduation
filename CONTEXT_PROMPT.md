# PROMPT CONTEXT — Thiệp mời tốt nghiệp Khôi

## Tổng quan dự án

Website thiệp mời tốt nghiệp dạng scroll-based, concept "hành trình từ đáy biển nổi lên mặt nước". User cuộn trang từ đáy đại dương tối sâu → vùng nước giữa → gần mặt biển → bãi biển/trời. Mỗi khách mời có URL riêng (ví dụ `?n=minh`) với lời nhắn cá nhân hóa và sinh vật biển đại diện.

**Ngày tốt nghiệp:** Chủ nhật 05/07/2026, 14h30 chiều, Hội trường Nguyễn Văn Đạo, 144 Xuân Thủy, Cầu Giấy, Hà Nội (UET - ĐHQGHN).

**Tác giả:** Trần Đức Đăng Khôi — sinh viên AI tại UET.

---

## Tech Stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** v3.4 — custom ocean palette
- **Three.js / React Three Fiber** — fixed background canvas lerp màu theo scroll
- **Framer Motion** — animations, useInView reveals
- **Supabase** — RSVP + Guestbook (realtime)
- **Howler.js** — nhạc nền (lazy load)
- **html2canvas** — tải thiệp PNG
- **SVG art** — tất cả sinh vật, rong biển, san hô đều là SVG chi tiết (KHÔNG dùng emoji)

---

## Ràng buộc tuyệt đối

- **KHÔNG** upload ảnh
- **KHÔNG** snap scroll — scroll tự nhiên liên tục
- **KHÔNG** auth/login
- **KHÔNG** admin dashboard
- **KHÔNG** dùng emoji cho sinh vật — phải dùng SVG component (`CreatureSVG`)
- Performance phải mượt mà

---

## Cấu trúc 4 Scene

Container chính: `<div style={{ height: "450vh" }}>` chứa 4 section, Three.js canvas fixed phía sau.

### Scene 1 — Đáy biển tối (Deep Sea)

- `h-[100vh]`, màu nền canvas deep blue (#0a1628)
- TypeWriter effect: "Gửi {tên}," → rồi subtext
- Vignette effect mạnh, spotlight glow
- ScrollHint "Cuộn xuống ↓" hiện khi chưa scroll
- Opacity fade out khi scroll > 18%

### Scene 2 — Vùng nước giữa (Mid Water)

- `min-h-[120vh]`, canvas chuyển từ night → mid blue
- 3 đoạn văn thơ (hoặc lời nhắn cá nhân từ guest.msg)
- 5 con cá SVG bơi qua lại (fish-swim-right / fish-swim-left)
- 9 cụm rong biển SVG + 2 nhánh san hô SVG dọc đáy
- Gradient chuyển cảnh top (Scene 1→2) và bottom (Scene 2→3)

### Scene 3 — Gần mặt biển (Surface)

- `min-h-[130vh]`, canvas chuyển từ mid → sand
- **WaterSurface**: gợn sóng SVG ở top, animation wave-move
- **SunRays**: 7 tia sáng god rays + 7 caustic shimmer spots
- **OceanCreature** components: hiển thị tất cả khách mời (avatar + SVG sinh vật + tên)
- Rong biển + san hô ở vị trí top 58-68% (KHÔNG ở bottom vì bottom chuyển sang Scene 4)
- Thông tin lễ tốt nghiệp: ngày giờ, địa điểm, link Google Maps
- **Countdown** realtime: ngày/giờ/phút/giây
- Bottom gradient: sandy tone rgba(196,168,130) fade to transparent

### Scene 4 — Bãi biển / Trời (Horizon)

- `min-h-[100vh]`, canvas chuyển từ sand → cream
- **Top blend gradient**: rgba(196,168,130,0.6) → transparent, h-32, -top-4 — che ranh giới Scene 3→4
- **SunSVG**: mặt trời radial gradient + pulse animation
- **3 CloudSVG**: mây trôi cloud-drift animation ở các tốc độ khác nhau
- **WindParticles**: 6 vệt gió mỏng
- **Sunshine radial glow**: ánh nắng vàng nhẹ
- **RSVPForm** trong GlassCard: 3 nút (Sẽ đến/Chưa chắc/Không thể) + textarea + submit → Supabase
- **Guestbook** trong GlassCard: realtime messages, input + gửi
- **DownloadCard**: nút tải thiệp PNG (html2canvas render hidden card 1080x1350)
- **BeachShore** ở bottom (28% height):
  - 3 lớp sóng biển SVG lapping qua lại (shore-wave-1/2/3)
  - Đường bọt trắng (foam) shimmer
  - Lớp cát ướt (wet sand strip)
  - Bãi cát gradient vàng ấm
  - Texture dots nhỏ
- "Made with love by Khôi" footer

---

## Three.js Background System

### OceanCanvas (fixed, z-0)

Canvas React Three Fiber, camera [0,0,5] fov 60.

### OceanScene

- `lerpOceanColor(scrollProgress)` → set `scene.background`
- 5 color stops: deep(0) → night(0.25) → mid(0.5) → sand(0.75) → cream(1.0)
- AmbientLight: intensity tăng theo scroll + flicker nhẹ ở depth
- PointLight: intensity tăng theo scroll, color #88ccee

### Bubbles

- 45 bubbles (InstancedMesh spheres) bay lên + wobble
- 180 plankton (Points, ShaderMaterial, AdditiveBlending) — particle glow xanh/cyan

### LightRays

- 5 tia sáng (PlaneGeometry + ShaderMaterial) — chỉ hiện khi scroll > 15%
- Fade in từ scroll 20%, sway theo time

### WaveMesh

- PlaneGeometry 80x40 segments, ShaderMaterial
- Wave displacement + caustic pattern
- Chỉ hiện khi scroll > 60%, fade in từ 65%

---

## SVG Art System

### SeaCreatures.tsx

- `CreatureSVG` dispatcher component: nhận `creature: CreatureType` + `size`
- 8 specific SVG: ClownfishSVG, TurtleSVG, JellyfishSVG, CrabSVG, OctopusSVG, SeahorseSVG, DolphinSVG, StarfishSVG
- `GenericFishSVG` cho các type còn lại (pufferfish, whale, shrimp, ray) — customizable colors
- Tất cả dùng `useId()` để tránh SVG gradient ID collision
- `CREATURE_COLORS` map cho 12 types

### Seaweed3D.tsx

- `SeaweedCluster`: multi-blade seaweed, gradient, drop shadow, leaf frills
- `CoralBranch`: nhánh san hô phân nhánh, đầu tròn
- Cả hai dùng `useId()` cho unique SVG IDs

---

## Guest System

### data/guests.json

```json
{
  "default": { "display": "Bạn", "pronoun": "bạn", "creature": "clownfish", ... },
  "minh": { "display": "Minh", "pronoun": "bạn", "creature": "turtle", ... }
}
```

- Mỗi guest: display, pronoun (bạn/anh/chị/em), msg (custom hoặc null→default), music, creature, creatureMsg, avatar
- URL param `?n=key` → useGuest() hook → lookup từ JSON
- **Cần thêm ~22-30 khách mời nữa** (chưa làm)

### CreatureType (12 loại)

clownfish, turtle, jellyfish, seahorse, crab, octopus, dolphin, starfish, pufferfish, whale, shrimp, ray

---

## Supabase Schema

```sql
-- rsvp: guest_key, display_name, attendance (yes/no/maybe), note
-- guestbook: guest_key, display_name, message
-- RLS: anonymous insert + select allowed
-- Realtime enabled for guestbook
```

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong `.env.local`
Lazy init via `getSupabase()` — chỉ tạo client khi cần.

---

## CSS Animations (globals.css)

| Animation            | Mô tả                              | Duration    |
| -------------------- | ---------------------------------- | ----------- |
| seaweed-sway         | Rong biển lắc lư rotate ±3deg      | 4s          |
| fish-swim-right/left | Cá bơi qua màn hình                | 18s         |
| fish-bob             | Cá nhấp nhô dọc                    | -           |
| creature-drift       | Sinh vật trôi nhẹ XY               | 8s          |
| dive-down            | RSVP confirm: sinh vật lặn xuống   | 2s forwards |
| sun-pulse            | Mặt trời nhấp nháy opacity         | 4s          |
| wave-move            | Sóng mặt biển dịch ngang           | 8s          |
| cloud-drift          | Mây trôi translateX 0→100vw        | 30s         |
| wind-streak          | Vệt gió chạy ngang                 | 5s          |
| sun-ray-sway         | Tia nắng Scene 3 nhấp nháy + scale | 5s          |
| caustic-shimmer      | Đốm ánh sáng caustic nhấp nháy     | 4s          |
| shore-wave-lap       | Sóng bờ biển lắc qua lại           | 6/8/10s     |
| shore-foam           | Bọt sóng shimmer                   | 6s          |
| bubble-rise          | Bong bóng bay lên (RSVP)           | -           |

---

## Tailwind Config

```ts
colors: {
  ocean: {
    deep: "#0a1628",   // đáy biển tối
    night: "#1a4a6b",  // vùng nước đêm
    mid: "#5b8fa8",    // vùng nước giữa
    sand: "#c4a882",   // cát biển
    cream: "#f0e8d8",  // kem sáng
  }
}
fonts: {
  serif: ["Lora", ...],      // headings
  sans: ["Be Vietnam Pro", ...] // body text
}
```

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main: OceanCanvas + 4 Scenes + MusicPlayer
│   ├── layout.tsx            # Metadata, body classes
│   └── globals.css           # All CSS animations
├── components/
│   ├── scenes/
│   │   ├── Scene1DeepSea.tsx  # TypeWriter, ScrollHint, vignette
│   │   ├── Scene2MidWater.tsx # Story text, SVG fish, seaweed/coral
│   │   ├── Scene3Surface.tsx  # Countdown, event info, creatures, sun rays
│   │   └── Scene4Horizon.tsx  # RSVP, guestbook, download, sun/clouds/beach
│   ├── three/
│   │   ├── OceanCanvas.tsx    # Canvas wrapper (fixed, z-0)
│   │   ├── OceanScene.tsx     # Background color lerp, lights
│   │   ├── Bubbles.tsx        # InstancedMesh bubbles + shader plankton
│   │   ├── LightRays.tsx      # Shader light rays
│   │   └── WaveMesh.tsx       # Shader wave surface mesh
│   ├── svg/
│   │   ├── SeaCreatures.tsx   # All 12 creature SVGs + dispatcher
│   │   └── Seaweed3D.tsx      # SeaweedCluster + CoralBranch SVGs
│   ├── OceanCreature.tsx      # Avatar + creature + name label
│   ├── RSVPForm.tsx           # RSVP 3-option form → Supabase
│   ├── Guestbook.tsx          # Realtime guestbook
│   ├── DownloadCard.tsx       # html2canvas PNG download
│   └── MusicPlayer.tsx        # Howler.js play/pause FAB
├── hooks/
│   ├── useScroll.ts           # scrollProgress = scrollY / maxScroll
│   ├── useGuest.ts            # ?n=key → Guest object from JSON
│   └── useCountdown.ts       # Live countdown to graduation date
├── lib/
│   ├── colors.ts              # lerpOceanColor: 5-stop gradient
│   └── supabase.ts            # Lazy Supabase client
└── types/
    └── guest.ts               # CreatureType, Guest interface, CREATURE_EMOJI, CREATURE_NAME_VI
data/
└── guests.json                # Guest entries (currently 2: default + minh)
supabase/
└── schema.sql                 # SQL to create rsvp + guestbook tables
```

---

## Các vấn đề đã giải quyết

1. **SVG ID collision**: Multiple SVG instances dùng chung gradient/filter ID → fix bằng `useId()` hook
2. **Emoji → SVG**: Thay toàn bộ emoji bằng SVG art chi tiết trong SeaCreatures.tsx
3. **Scene 3→4 transition**: Từng có lớp biển xanh (OceanWaves) phía trên trời → đã xóa hoàn toàn, thay bằng gradient sand-toned blend
4. **Scene transitions**: Gradient overlays ở top/bottom mỗi section để chuyển cảnh mượt
5. **Scene 3 background**: Thêm WaterSurface (gợn sóng) + SunRays (god rays + caustic) cho cảm giác gần mặt biển
6. **Scene 4 beach**: Thêm SunSVG, CloudSVG, WindParticles, BeachShore (sóng bờ + cát)
7. **Seaweed overlap**: Rong biển Scene 3 di chuyển từ bottom-0 lên top 58-68% để không che Scene 4

---

## Việc cần làm (TODO)

- [ ] Thêm ~22-30 khách mời vào `data/guests.json` (mỗi người cần display, pronoun, creature, creatureMsg)
- [ ] Thêm file mp3 vào `public/audio/bg-music.mp3`
- [ ] Chạy `supabase/schema.sql` trong Supabase SQL Editor
- [ ] Deploy lên Vercel
- [ ] Cập nhật `NEXT_PUBLIC_SITE_URL` sau deploy
- [ ] Test RSVP flow end-to-end với Supabase
- [ ] Responsive check trên mobile
- [ ] (Optional) Generate QR codes cho từng khách: `npm run gen-qr`

---

## Lưu ý kỹ thuật quan trọng

1. **scroll-behavior: smooth** trong CSS → cần override `document.documentElement.style.scrollBehavior = 'auto'` khi test programmatic scroll
2. **useId()** bắt buộc cho mọi SVG component có gradient/filter defs — tránh ID collision khi render nhiều instances
3. **Supabase lazy init** — `getSupabase()` chỉ tạo client khi được gọi, tránh crash khi chưa config env vars
4. **Three.js canvas z-0** fixed behind, HTML sections z-10 relative on top — sections transparent nên canvas hiện xuyên qua
5. **Color matching tại scene boundaries**: gradient overlays phải dùng cùng màu với canvas tại điểm scroll tương ứng (sand = #c4a882 = rgb(196,168,130) tại 75% scroll)
