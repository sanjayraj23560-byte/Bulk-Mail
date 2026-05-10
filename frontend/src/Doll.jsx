import { useRef, useEffect, useState } from "react"

function Doll({ size = 100, mousePos, happy, color = "purple" }) {
  const dollRef = useRef(null)
  const [eyeOffset, setEyeOffset] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } })
  const [lean, setLean] = useState(0)

  const palette = {
    purple: {
      skin:        "rgba(255,224,210,0.95)",
      skinStroke:  "rgba(255,200,185,0.8)",
      hair:        "rgba(120,40,220,0.92)",
      hairLight:   "rgba(160,80,255,0.7)",
      dress:       "rgba(180,130,255,0.45)",
      dressStroke: "rgba(210,180,255,0.6)",
      ribbon:      "rgba(230,190,255,0.9)",
      shoe:        "rgba(100,30,200,0.85)",
      cheek:       "rgba(255,160,160,0.55)",
      eye:         "rgba(60,20,100,0.92)",
    },
    pink: {
      skin:        "rgba(255,224,210,0.95)",
      skinStroke:  "rgba(255,200,185,0.8)",
      hair:        "rgba(210,30,100,0.92)",
      hairLight:   "rgba(255,100,160,0.7)",
      dress:       "rgba(255,160,210,0.45)",
      dressStroke: "rgba(255,200,230,0.6)",
      ribbon:      "rgba(255,220,240,0.9)",
      shoe:        "rgba(180,20,80,0.85)",
      cheek:       "rgba(255,150,170,0.55)",
      eye:         "rgba(100,10,50,0.92)",
    },
    blue: {
      skin:        "rgba(255,224,210,0.95)",
      skinStroke:  "rgba(255,200,185,0.8)",
      hair:        "rgba(20,80,210,0.92)",
      hairLight:   "rgba(80,140,255,0.7)",
      dress:       "rgba(130,180,255,0.45)",
      dressStroke: "rgba(180,210,255,0.6)",
      ribbon:      "rgba(200,225,255,0.9)",
      shoe:        "rgba(20,50,180,0.85)",
      cheek:       "rgba(180,200,255,0.55)",
      eye:         "rgba(10,30,100,0.92)",
    }
  }

  const c = palette[color] || palette.purple
  const s = size

  // proportions — big head chibi style
  const headR   = s * 0.33
  const headCY  = s * 0.34
  const eyeR    = s * 0.082
  const pupilR  = s * 0.042
  const bodyW   = s * 0.38
  const bodyTop = headCY + headR * 0.82
  const cx      = s / 2

  useEffect(() => {
    if (!dollRef.current) return
    const rect = dollRef.current.getBoundingClientRect()
    const dollCX = rect.left + rect.width / 2
    const dollCY = rect.top + rect.height / 2

    // lean: how far cursor is horizontally from doll center, normalized
    const dx = mousePos.x - dollCX
    const maxLean = 12
    const newLean = Math.max(-maxLean, Math.min(maxLean, dx * 0.06))
    setLean(newLean)

    // eye tracking
    const computeEye = (ecx, ecy) => {
      const edx = mousePos.x - ecx
      const edy = mousePos.y - ecy
      const angle = Math.atan2(edy, edx)
      const dist = Math.min(Math.hypot(edx, edy) * 0.1, 4)
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
    }

    const leX = dollCX - s * 0.115
    const leY = rect.top + headCY + s * 0.008
    const reX = dollCX + s * 0.115
    const reY = rect.top + headCY + s * 0.008

    setEyeOffset({
      left:  computeEye(leX, leY),
      right: computeEye(reX, reY)
    })
  }, [mousePos, s, headCY])

  return (
    <svg
      ref={dollRef}
      width={s}
      height={s * 1.25}
      viewBox={`0 0 ${s} ${s * 1.25}`}
      style={{
        overflow: "visible",
        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s",
        transform: happy
          ? `rotate(${lean * 0.4}deg) scale(1.13) translateY(-6px)`
          : `rotate(${lean * 0.55}deg) scale(1)`,
        transformOrigin: "50% 90%",
        filter: happy
          ? "drop-shadow(0 10px 28px rgba(167,139,250,0.45))"
          : "drop-shadow(0 4px 10px rgba(0,0,0,0.22))"
      }}
    >
      {/* ground shadow */}
      <ellipse cx={cx} cy={s * 1.21} rx={s * 0.19} ry={s * 0.03} fill="rgba(0,0,0,0.13)" />

      {/* ── LEGS ── */}
      <rect x={cx - s*0.13} y={s*0.955} width={s*0.1}  height={s*0.18} rx={s*0.05} fill={c.skin} stroke={c.skinStroke} strokeWidth="0.8" />
      <rect x={cx + s*0.03} y={s*0.955} width={s*0.1}  height={s*0.18} rx={s*0.05} fill={c.skin} stroke={c.skinStroke} strokeWidth="0.8" />

      {/* socks */}
      <rect x={cx - s*0.13} y={s*1.07}  width={s*0.1}  height={s*0.055} rx={s*0.03} fill="rgba(255,255,255,0.7)" />
      <rect x={cx + s*0.03} y={s*1.07}  width={s*0.1}  height={s*0.055} rx={s*0.03} fill="rgba(255,255,255,0.7)" />

      {/* shoes */}
      <ellipse cx={cx - s*0.08} cy={s*1.145} rx={s*0.082} ry={s*0.042} fill={c.shoe} />
      <ellipse cx={cx + s*0.08} cy={s*1.145} rx={s*0.082} ry={s*0.042} fill={c.shoe} />
      {/* shoe shine */}
      <ellipse cx={cx - s*0.095} cy={s*1.133} rx={s*0.025} ry={s*0.012} fill="rgba(255,255,255,0.35)" />
      <ellipse cx={cx + s*0.065} cy={s*1.133} rx={s*0.025} ry={s*0.012} fill="rgba(255,255,255,0.35)" />

      {/* ── DRESS SKIRT ── */}
      <path
        d={`M ${cx - bodyW*0.38} ${bodyTop + s*0.08}
            Q ${cx - bodyW*0.72} ${bodyTop + s*0.28} ${cx - bodyW*0.65} ${s*0.97}
            Q ${cx - bodyW*0.3}  ${s*1.01}           ${cx}              ${s*1.01}
            Q ${cx + bodyW*0.3}  ${s*1.01}           ${cx + bodyW*0.65} ${s*0.97}
            Q ${cx + bodyW*0.72} ${bodyTop + s*0.28} ${cx + bodyW*0.38} ${bodyTop + s*0.08}
            Z`}
        fill={c.dress}
        stroke={c.dressStroke}
        strokeWidth="1"
      />

      {/* dress ruffle bottom */}
      {[-0.55,-0.28,0,0.28,0.55].map((t,i) => (
        <path
          key={i}
          d={`M ${cx + t*bodyW*0.9} ${s*0.975}
              Q ${cx + t*bodyW*0.9 + (i%2===0?4:-4)} ${s*1.005}
              ${cx + (t + 0.18)*bodyW*0.9} ${s*0.975}`}
          fill="none"
          stroke={c.dressStroke}
          strokeWidth="1"
          strokeLinecap="round"
        />
      ))}

      {/* ── BODY ── */}
      <rect
        x={cx - bodyW*0.38} y={bodyTop}
        width={bodyW*0.76}   height={s*0.14}
        rx={s*0.06}
        fill={c.dress}
        stroke={c.dressStroke}
        strokeWidth="1"
      />

      {/* collar */}
      <path
        d={`M ${cx - bodyW*0.22} ${bodyTop + s*0.01}
            Q ${cx}               ${bodyTop + s*0.07}
            ${cx + bodyW*0.22}   ${bodyTop + s*0.01}`}
        fill="rgba(255,255,255,0.25)"
        stroke={c.dressStroke}
        strokeWidth="0.8"
      />

      {/* center bow on dress */}
      <path d={`M ${cx-s*0.055} ${bodyTop+s*0.04} Q ${cx-s*0.1} ${bodyTop+s*0.01} ${cx-s*0.06} ${bodyTop+s*0.07}`} fill={c.ribbon} stroke={c.dressStroke} strokeWidth="0.6"/>
      <path d={`M ${cx+s*0.055} ${bodyTop+s*0.04} Q ${cx+s*0.1} ${bodyTop+s*0.01} ${cx+s*0.06} ${bodyTop+s*0.07}`} fill={c.ribbon} stroke={c.dressStroke} strokeWidth="0.6"/>
      <circle cx={cx} cy={bodyTop+s*0.04} r={s*0.022} fill={c.ribbon} stroke={c.dressStroke} strokeWidth="0.6"/>

      {/* ── ARMS ── */}
      <path
        d={`M ${cx - bodyW*0.35} ${bodyTop + s*0.03}
            Q ${cx - bodyW*0.78} ${bodyTop + s*0.1}
            ${cx - bodyW*0.72}  ${bodyTop + s*0.26}`}
        fill="none" stroke={c.skin} strokeWidth={s*0.1} strokeLinecap="round"
      />
      <path
        d={`M ${cx + bodyW*0.35} ${bodyTop + s*0.03}
            Q ${cx + bodyW*0.78} ${bodyTop + s*0.1}
            ${cx + bodyW*0.72}  ${bodyTop + s*0.26}`}
        fill="none" stroke={c.skin} strokeWidth={s*0.1} strokeLinecap="round"
      />

      {/* hands */}
      <circle cx={cx - bodyW*0.72} cy={bodyTop + s*0.3}  r={s*0.06} fill={c.skin} stroke={c.skinStroke} strokeWidth="0.8"/>
      <circle cx={cx + bodyW*0.72} cy={bodyTop + s*0.3}  r={s*0.06} fill={c.skin} stroke={c.skinStroke} strokeWidth="0.8"/>

      {/* ── NECK ── */}
      <rect x={cx-s*0.07} y={headCY+headR*0.88} width={s*0.14} height={s*0.06} rx={s*0.04} fill={c.skin} />

      {/* ── EARS ── */}
      <ellipse cx={cx - headR*0.93} cy={headCY + s*0.012} rx={s*0.065} ry={s*0.08}  fill={c.skin} stroke={c.skinStroke} strokeWidth="0.9"/>
      <ellipse cx={cx + headR*0.93} cy={headCY + s*0.012} rx={s*0.065} ry={s*0.08}  fill={c.skin} stroke={c.skinStroke} strokeWidth="0.9"/>
      <ellipse cx={cx - headR*0.93} cy={headCY + s*0.012} rx={s*0.032} ry={s*0.044} fill={c.cheek}/>
      <ellipse cx={cx + headR*0.93} cy={headCY + s*0.012} rx={s*0.032} ry={s*0.044} fill={c.cheek}/>

      {/* ── HEAD ── */}
      <ellipse
        cx={cx} cy={headCY}
        rx={headR} ry={headR * 1.06}
        fill={c.skin} stroke={c.skinStroke} strokeWidth="1.2"
      />

      {/* ── HAIR BACK LAYER ── */}
      <ellipse cx={cx} cy={headCY - headR*0.55} rx={headR*1.08} ry={headR*0.7} fill={c.hair}/>

      {/* side hair strands */}
      <path
        d={`M ${cx - headR*0.88} ${headCY - headR*0.2}
            Q ${cx - headR*1.38} ${headCY + headR*0.55}
            ${cx - headR*1.15}  ${headCY + headR*1.12}`}
        fill="none" stroke={c.hair} strokeWidth={s*0.072} strokeLinecap="round"
      />
      <path
        d={`M ${cx + headR*0.88} ${headCY - headR*0.2}
            Q ${cx + headR*1.38} ${headCY + headR*0.55}
            ${cx + headR*1.15}  ${headCY + headR*1.12}`}
        fill="none" stroke={c.hair} strokeWidth={s*0.072} strokeLinecap="round"
      />

      {/* extra curly strand left */}
      <path
        d={`M ${cx - headR*0.7} ${headCY + headR*0.75}
            Q ${cx - headR*1.1} ${headCY + headR*1.0}
            ${cx - headR*0.85} ${headCY + headR*1.3}`}
        fill="none" stroke={c.hairLight} strokeWidth={s*0.042} strokeLinecap="round"
      />
      <path
        d={`M ${cx + headR*0.7} ${headCY + headR*0.75}
            Q ${cx + headR*1.1} ${headCY + headR*1.0}
            ${cx + headR*0.85} ${headCY + headR*1.3}`}
        fill="none" stroke={c.hairLight} strokeWidth={s*0.042} strokeLinecap="round"
      />

      {/* fringe / bangs */}
      <path
        d={`M ${cx - headR*0.95} ${headCY - headR*0.08}
            Q ${cx - headR*0.55} ${headCY + headR*0.22} ${cx - headR*0.18} ${headCY - headR*0.06}`}
        fill="none" stroke={c.hair} strokeWidth={s*0.076} strokeLinecap="round"
      />
      <path
        d={`M ${cx + headR*0.95} ${headCY - headR*0.08}
            Q ${cx + headR*0.55} ${headCY + headR*0.22} ${cx + headR*0.18} ${headCY - headR*0.06}`}
        fill="none" stroke={c.hair} strokeWidth={s*0.076} strokeLinecap="round"
      />
      <path
        d={`M ${cx - headR*0.22} ${headCY - headR*0.06}
            Q ${cx}              ${headCY + headR*0.18} ${cx + headR*0.22} ${headCY - headR*0.06}`}
        fill="none" stroke={c.hair} strokeWidth={s*0.068} strokeLinecap="round"
      />

      {/* hair highlight streak */}
      <path
        d={`M ${cx - headR*0.35} ${headCY - headR*0.88}
            Q ${cx - headR*0.1}  ${headCY - headR*0.55} ${cx - headR*0.28} ${headCY - headR*0.22}`}
        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={s*0.038} strokeLinecap="round"
      />

      {/* ── HAIR BOW ── */}
      <path
        d={`M ${cx - s*0.005} ${headCY - headR*1.08}
            Q ${cx - s*0.13}  ${headCY - headR*1.38}
            ${cx - s*0.04}   ${headCY - headR*1.12}`}
        fill={c.ribbon} stroke={c.dressStroke} strokeWidth="0.9"
      />
      <path
        d={`M ${cx + s*0.005} ${headCY - headR*1.08}
            Q ${cx + s*0.13}  ${headCY - headR*1.38}
            ${cx + s*0.04}   ${headCY - headR*1.12}`}
        fill={c.ribbon} stroke={c.dressStroke} strokeWidth="0.9"
      />
      <circle cx={cx} cy={headCY - headR*1.1} r={s*0.028} fill={c.ribbon} stroke={c.dressStroke} strokeWidth="0.7"/>

      {/* ── BLUSH ── */}
      {happy && <>
        <ellipse cx={cx - headR*0.6} cy={headCY + headR*0.38} rx={s*0.075} ry={s*0.042} fill="rgba(255,140,150,0.55)"/>
        <ellipse cx={cx + headR*0.6} cy={headCY + headR*0.38} rx={s*0.075} ry={s*0.042} fill="rgba(255,140,150,0.55)"/>
        {/* blush sparkles */}
        <circle cx={cx - headR*0.72} cy={headCY + headR*0.28} r={s*0.012} fill="rgba(255,180,180,0.7)"/>
        <circle cx={cx + headR*0.72} cy={headCY + headR*0.28} r={s*0.012} fill="rgba(255,180,180,0.7)"/>
      </>}

      {/* ── LEFT EYE ── */}
      <ellipse cx={cx - s*0.115} cy={headCY + s*0.008} rx={eyeR} ry={eyeR*1.12} fill="rgba(255,255,255,0.97)"/>
      {/* upper eyelid shadow */}
      <ellipse cx={cx - s*0.115} cy={headCY + s*0.008 - eyeR*0.55} rx={eyeR*0.92} ry={eyeR*0.38} fill="rgba(220,200,240,0.4)"/>

      {happy ? (
        <path
          d={`M ${cx - s*0.115 - eyeR*0.82} ${headCY + s*0.01}
              Q ${cx - s*0.115}              ${headCY + s*0.01 - eyeR*1.3}
              ${cx - s*0.115 + eyeR*0.82}   ${headCY + s*0.01}`}
          fill="none" stroke={c.eye} strokeWidth="2.2" strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse
            cx={cx - s*0.115 + eyeOffset.left.x}
            cy={headCY + s*0.008 + eyeOffset.left.y}
            rx={pupilR} ry={pupilR*1.15}
            fill={c.eye}
          />
          {/* pupil shine */}
          <circle
            cx={cx - s*0.115 + eyeOffset.left.x + pupilR*0.35}
            cy={headCY + s*0.008 + eyeOffset.left.y - pupilR*0.45}
            r={pupilR*0.38} fill="rgba(255,255,255,0.95)"
          />
          <circle
            cx={cx - s*0.115 + eyeOffset.left.x - pupilR*0.18}
            cy={headCY + s*0.008 + eyeOffset.left.y + pupilR*0.28}
            r={pupilR*0.18} fill="rgba(255,255,255,0.55)"
          />
        </>
      )}

      {/* left eyelashes */}
      {happy && [-0.7,-0.2,0.35].map((t,i) => (
        <line key={i}
          x1={cx - s*0.115 + t*eyeR*0.85}
          y1={headCY + s*0.008 - eyeR*1.08}
          x2={cx - s*0.115 + t*eyeR*1.1 + (t<0?-1.8:1.2)}
          y2={headCY + s*0.008 - eyeR*1.62}
          stroke={c.eye} strokeWidth="1.1" strokeLinecap="round"
        />
      ))}
      {!happy && [-0.65,-0.1,0.45].map((t,i) => (
        <line key={i}
          x1={cx - s*0.115 + t*eyeR*0.85}
          y1={headCY + s*0.008 - eyeR*1.06}
          x2={cx - s*0.115 + t*eyeR*1.05 + (t<0?-1.5:1.0)}
          y2={headCY + s*0.008 - eyeR*1.55}
          stroke={c.eye} strokeWidth="1" strokeLinecap="round"
        />
      ))}

      {/* ── RIGHT EYE ── */}
      <ellipse cx={cx + s*0.115} cy={headCY + s*0.008} rx={eyeR} ry={eyeR*1.12} fill="rgba(255,255,255,0.97)"/>
      <ellipse cx={cx + s*0.115} cy={headCY + s*0.008 - eyeR*0.55} rx={eyeR*0.92} ry={eyeR*0.38} fill="rgba(220,200,240,0.4)"/>

      {happy ? (
        <path
          d={`M ${cx + s*0.115 - eyeR*0.82} ${headCY + s*0.01}
              Q ${cx + s*0.115}              ${headCY + s*0.01 - eyeR*1.3}
              ${cx + s*0.115 + eyeR*0.82}   ${headCY + s*0.01}`}
          fill="none" stroke={c.eye} strokeWidth="2.2" strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse
            cx={cx + s*0.115 + eyeOffset.right.x}
            cy={headCY + s*0.008 + eyeOffset.right.y}
            rx={pupilR} ry={pupilR*1.15}
            fill={c.eye}
          />
          <circle
            cx={cx + s*0.115 + eyeOffset.right.x + pupilR*0.35}
            cy={headCY + s*0.008 + eyeOffset.right.y - pupilR*0.45}
            r={pupilR*0.38} fill="rgba(255,255,255,0.95)"
          />
          <circle
            cx={cx + s*0.115 + eyeOffset.right.x - pupilR*0.18}
            cy={headCY + s*0.008 + eyeOffset.right.y + pupilR*0.28}
            r={pupilR*0.18} fill="rgba(255,255,255,0.55)"
          />
        </>
      )}

      {/* right eyelashes */}
      {happy && [-0.35,0.2,0.7].map((t,i) => (
        <line key={i}
          x1={cx + s*0.115 + t*eyeR*0.85}
          y1={headCY + s*0.008 - eyeR*1.08}
          x2={cx + s*0.115 + t*eyeR*1.1 + (t<0?-1.2:1.8)}
          y2={headCY + s*0.008 - eyeR*1.62}
          stroke={c.eye} strokeWidth="1.1" strokeLinecap="round"
        />
      ))}
      {!happy && [-0.45,0.1,0.65].map((t,i) => (
        <line key={i}
          x1={cx + s*0.115 + t*eyeR*0.85}
          y1={headCY + s*0.008 - eyeR*1.06}
          x2={cx + s*0.115 + t*eyeR*1.05 + (t<0?-1.0:1.5)}
          y2={headCY + s*0.008 - eyeR*1.55}
          stroke={c.eye} strokeWidth="1" strokeLinecap="round"
        />
      ))}

      {/* ── NOSE ── */}
      <path
        d={`M ${cx - s*0.022} ${headCY + headR*0.3}
            Q ${cx}            ${headCY + headR*0.38}
            ${cx + s*0.022}  ${headCY + headR*0.3}`}
        fill="none" stroke="rgba(220,160,150,0.7)" strokeWidth="1.1" strokeLinecap="round"
      />

      {/* ── MOUTH ── */}
      {happy ? (
        <>
          <path
            d={`M ${cx - s*0.115} ${headCY + headR*0.5}
                Q ${cx}            ${headCY + headR*0.75}
                ${cx + s*0.115}   ${headCY + headR*0.5}`}
            fill="rgba(255,180,190,0.35)"
            stroke="rgba(230,130,150,0.85)"
            strokeWidth="1.6" strokeLinecap="round"
          />
          <path
            d={`M ${cx - s*0.068} ${headCY + headR*0.52}
                L ${cx - s*0.068} ${headCY + headR*0.62}
                Q ${cx}           ${headCY + headR*0.66}
                ${cx + s*0.068}  ${headCY + headR*0.62}
                L ${cx + s*0.068} ${headCY + headR*0.52}`}
            fill="rgba(255,255,255,0.92)"
          />
        </>
      ) : (
        <path
          d={`M ${cx - s*0.078} ${headCY + headR*0.5}
              Q ${cx}            ${headCY + headR*0.62}
              ${cx + s*0.078}   ${headCY + headR*0.5}`}
          fill="none"
          stroke="rgba(220,140,155,0.8)"
          strokeWidth="1.5" strokeLinecap="round"
        />
      )}

      {/* ── SPARKLES when happy ── */}
      {happy && <>
        <text x={cx - s*0.52} y={headCY - headR*0.6} fontSize={s*0.16} fill="rgba(255,220,80,0.9)">★</text>
        <text x={cx + s*0.34} y={headCY - headR*0.8} fontSize={s*0.12} fill="rgba(255,180,220,0.9)">✦</text>
        <text x={cx - s*0.38} y={headCY - headR*1.2} fontSize={s*0.1}  fill="rgba(200,160,255,0.9)">✦</text>
      </>}
    </svg>
  )
}

export default Doll