'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { deriveSearchParams, deriveSearchSummary, deriveLocationLabel } from '@/lib/deriveSearchParams';
import { generatePassphrase, passphraseToUserId, passphrasePersona } from '@/lib/passphrase';

const RATE=0.06168,DOWN=0.20,TAX_RATE=0.0051,INS=125;
const MIN_SAVES_FOR_PATTERN = 5; // matches onboard-flow.jsx MIN_SELECTIONS

function calcMonthly(price){const loan=price*(1-DOWN),mo=RATE/12,n=360,pi=loan*(mo*Math.pow(1+mo,n))/(Math.pow(1+mo,n)-1),tax=(price*TAX_RATE)/12;return Math.round(pi+tax+INS);}
function fmt(n){if(!n)return'—';return'$'+Math.round(n).toLocaleString();}

// ── Property card ─────────────────────────────────────────────────────────────

function PropertyCard({listing,onSave,savedIds,anonymousCount}){
  const p=listing?.raw?.property??listing;
  if(!p)return null;
  const zpid=p.zpid,address=p.address?.streetAddress??'—',city=p.address?.city??'',state=p.address?.state??'',price=p.price?.value,beds=p.bedrooms,baths=p.bathrooms,sqft=p.livingArea,yearBuilt=p.yearBuilt,propertyType=p.propertyType,daysOnMarket=p.daysOnZillow,priceChange=p.price?.priceChange,photo=p.media?.propertyPhotoLinks?.mediumSizeLink,agentName=p.propertyDisplayRules?.agent?.agentName,brokerName=p.propertyDisplayRules?.mls?.brokerName,insights=p.listCardRecommendation?.flexFieldRecommendations?.map(f=>f.displayString)??[],hdpUrl=p.hdpView?.hdpUrl?`https://www.zillow.com${p.hdpView.hdpUrl}`:null,monthly=price?calcMonthly(price):null,isSaved=savedIds?.includes(String(zpid));
  const typeLabel={singleFamily:'Single Family',townhome:'Townhome',condo:'Condo',apartment:'Apartment'}[propertyType]??propertyType??'';
  return(
    <div className="card overflow-hidden flex flex-col" style={{transition:'box-shadow 0.15s'}}>
      <div style={{position:'relative',height:'180px',background:'var(--bg-card,#f1f5f9)',overflow:'hidden'}}>
        {photo?<img src={photo} alt={address} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="48" height="48" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg></div>}
        <div style={{position:'absolute',top:8,left:8,display:'flex',gap:4,flexWrap:'wrap'}}>
          {daysOnMarket!=null&&<span style={{fontSize:11,fontWeight:700,padding:'2px 7px',borderRadius:20,background:daysOnMarket>60?'#FFF3E0':'var(--color-teal)',color:daysOnMarket>60?'#E65100':'#1a3a3a',border:'1px solid rgba(0,0,0,0.08)'}}>{daysOnMarket}d on market</span>}
          {priceChange&&priceChange<0&&<span style={{fontSize:11,fontWeight:700,padding:'2px 7px',borderRadius:20,background:'#E8F5E9',color:'#2E7D32',border:'1px solid rgba(0,0,0,0.08)'}}>Price ↓</span>}
          {typeLabel&&<span style={{fontSize:11,fontWeight:600,padding:'2px 7px',borderRadius:20,background:'rgba(255,255,255,0.88)',color:'var(--text)',border:'1px solid rgba(0,0,0,0.08)'}}>{typeLabel}</span>}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div><div style={{fontSize:15,fontWeight:700,color:'var(--text)',lineHeight:1.3,marginBottom:2}}>{address}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{city}{city&&state?', ':''}{state}</div></div>
        <div style={{display:'flex',alignItems:'baseline',gap:8}}><span style={{fontSize:22,fontWeight:800,color:'var(--color-rocket)',letterSpacing:'-0.02em'}}>{fmt(price)}</span>{monthly&&<span style={{fontSize:12,color:'var(--text-muted)'}}>~{fmt(monthly)}/mo</span>}</div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {beds&&<span style={{fontSize:13,color:'var(--text)',display:'flex',gap:3}}><span style={{fontWeight:700}}>{beds}</span><span style={{color:'var(--text-muted)'}}>bd</span></span>}
          {baths&&<span style={{fontSize:13,color:'var(--text)',display:'flex',gap:3}}><span style={{fontWeight:700}}>{baths}</span><span style={{color:'var(--text-muted)'}}>ba</span></span>}
          {sqft&&<span style={{fontSize:13,color:'var(--text)',display:'flex',gap:3}}><span style={{fontWeight:700}}>{sqft.toLocaleString()}</span><span style={{color:'var(--text-muted)'}}>sqft</span></span>}
          {yearBuilt&&<span style={{fontSize:13,color:'var(--text-muted)'}}>Built {yearBuilt}</span>}
        </div>
        {insights.length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{insights.slice(0,2).map((insight,i)=><span key={i} style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:'color-mix(in oklab, var(--color-teal) 15%, transparent)',color:'var(--text)',border:'1px solid color-mix(in oklab, var(--color-teal) 30%, transparent)'}}>{insight}</span>)}</div>}
        {(agentName||brokerName)&&<div style={{fontSize:11,color:'var(--text-muted)',marginTop:'auto',paddingTop:4}}>{agentName?`Listed by ${agentName}`:brokerName}</div>}
      </div>
      <div style={{display:'flex',gap:8,padding:'12px 16px',borderTop:'1px solid color-mix(in oklab, var(--border) 50%, transparent)'}}>
        {hdpUrl&&<a href={hdpUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{flex:1,fontSize:12,padding:'6px 12px',textAlign:'center'}}>View on Zillow ↗</a>}
        <button onClick={()=>onSave&&onSave(listing)} style={{flex:1,fontSize:12,padding:'6px 12px',borderRadius:6,fontWeight:700,cursor:'pointer',transition:'all 0.15s',background:isSaved?'color-mix(in oklab, var(--color-teal) 20%, transparent)':'var(--color-rocket)',color:isSaved?'var(--text)':'#ffffff',border:isSaved?'1.5px solid var(--color-teal)':'1.5px solid var(--border)',boxShadow:isSaved?'none':'2px 2px 0 var(--shadow)'}}>{isSaved?'✓ Saved':'Save'}</button>
      </div>
    </div>
  );
}

function SkeletonCard(){return(<div className="card overflow-hidden" style={{opacity:0.6}}><div style={{height:180,background:'color-mix(in oklab, var(--border) 40%, transparent)',animation:'pulse 1.5s infinite'}}/><div style={{padding:16,display:'flex',flexDirection:'column',gap:12}}>{[140,80,100].map((w,i)=><div key={i} style={{height:i===1?28:14,width:w,borderRadius:4,background:'color-mix(in oklab, var(--border) 60%, transparent)',animation:'pulse 1.5s infinite'}}/>)}</div></div>);}

// ── Profile banner (authenticated users only) ─────────────────────────────────

function ProfileBanner({summary,count,isLoading}){
  if(!summary)return null;
  return(
    <div style={{background:'color-mix(in oklab, var(--color-teal) 10%, var(--bg-main,white))',border:'1px solid color-mix(in oklab, var(--color-teal) 30%, transparent)',borderRadius:10,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
      <div style={{fontSize:13,color:'var(--text)'}}>
        {isLoading?<span style={{color:'var(--text-muted)'}}>Al is searching your profile…</span>:count>0?<>Al found <strong style={{color:'var(--color-teal)'}}>{count} listings</strong> matching your profile</>:'No listings matched your profile — try adjusting filters'}
        {summary&&!isLoading&&<span style={{color:'var(--text-muted)',marginLeft:8,fontSize:12}}>· {summary}</span>}
      </div>
      <a href="/profile" style={{fontSize:12,fontWeight:600,color:'var(--color-teal)',textDecoration:'none'}}>Edit profile →</a>
    </div>
  );
}

// ── Anonymous save progress bar ───────────────────────────────────────────────

function AnonymousSaveBar({count, onTrigger}){
  if(count===0)return null;
  const remaining = MIN_SAVES_FOR_PATTERN - count;
  const pct = Math.min((count/MIN_SAVES_FOR_PATTERN)*100, 100);

  return(
    <div style={{background:'color-mix(in oklab, var(--color-rocket) 6%, var(--bg-main,white))',border:'1px solid color-mix(in oklab, var(--color-rocket) 20%, transparent)',borderRadius:10,padding:'12px 16px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,gap:8,flexWrap:'wrap'}}>
        <div style={{fontSize:13,color:'var(--text)',fontWeight:600}}>
          {remaining > 0
            ? <>You've saved <strong style={{color:'var(--color-rocket)'}}>{count}</strong> home{count!==1?'s':''} — save {remaining} more and Al will tell you what you're drawn to</>
            : <>Al is ready to analyse your saves — <strong style={{color:'var(--color-rocket)'}}>see what you like</strong></>
          }
        </div>
        {remaining===0&&(
          <button onClick={onTrigger} className="btn" style={{fontSize:12,padding:'6px 14px',flexShrink:0}}>
            Analyse my picks →
          </button>
        )}
      </div>
      <div style={{height:4,borderRadius:2,background:'var(--border)',overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:2,background:'var(--color-rocket)',width:`${pct}%`,transition:'width 0.4s ease'}}/>
      </div>
    </div>
  );
}

// ── Anonymous onboard modal ───────────────────────────────────────────────────
// Fires when anonymous user has saved MIN_SAVES_FOR_PATTERN listings.
// Passphrase → Pattern (skips preferences since we already have saves).

function AnonymousOnboardModal({saves, onComplete, onDismiss}){
  const router = useRouter();
  const [screen, setScreen] = useState('passphrase');
  const [phrase, setPhrase] = useState(()=>generatePassphrase());
  const [copied, setCopied] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [confirmed, setConfirmed] = useState(new Set());

  function regenerate(){setPhrase(generatePassphrase());setCopied(false);}
  function copy(){navigator.clipboard?.writeText(phrase).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}

  async function handlePassphraseContinue(){
    setScreen('pattern');
    setLoadingInsights(true);

    // Run pattern analysis on the anonymous saves
    try{
      const summaries = saves.map(l=>{
        const p=l?.raw?.property??l;
        return{
          address:p.address?.streetAddress,city:p.address?.city,
          price:p.price?.value,beds:p.bedrooms,sqft:p.livingArea,
          yearBuilt:p.yearBuilt,lotSize:p.resoFacts?.lotSize,
          hasGarage:p.resoFacts?.hasGarage,hasFireplace:p.resoFacts?.hasFireplace,
          hasView:p.resoFacts?.hasView,hoaFee:p.resoFacts?.monthlyHoaFee,
          homeType:p.homeType,
        };
      });

      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          messages:[{role:'user',content:`A homebuyer saved these ${saves.length} listings while browsing anonymously. Identify 3-5 specific preferences from what they have in common.

Listings:
${JSON.stringify(summaries,null,2)}

Return ONLY a JSON array. No preamble, no markdown, no backticks.
Each object: { "signal": "short label", "description": "one sentence", "icon": "single emoji" }

Focus on specific observable patterns — price range, size, lot, garage, views, HOA, location type, age of home.`}],
        }),
      });
      const data=await res.json();
      const text=data.content?.[0]?.text||'[]';
      const parsed=JSON.parse(text.replace(/```json|```/g,'').trim());
      setInsights(parsed);
      setConfirmed(new Set(parsed.map((_,i)=>i)));
    }catch(e){
      console.error(e);
      setInsights([]);
    }finally{
      setLoadingInsights(false);
    }
  }

  async function handleConfirm(){
    const confirmedInsights=(insights||[]).filter((_,i)=>confirmed.has(i));
    const userId=await passphraseToUserId(phrase);

    // Infer budget from saves
    const prices=saves.map(l=>(l?.raw?.property??l)?.price?.value).filter(Boolean);
    const budgetMin=prices.length?Math.min(...prices):null;
    const budgetMax=prices.length?Math.max(...prices):null;

    await fetch('/api/profile',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        userId,
        profile:{journeyStage:'Actively searching',targetMarket:saves[0]?.raw?.property?.address?.city||null},
      }),
    });

    await fetch('/api/profile',{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        userId,
        houseProfile:{
          budget_min:budgetMin,budget_max:budgetMax,
          budget_confirmed:false, // not explicitly confirmed yet
          bedrooms_min:3,
          inferred_summary:{
            insights:confirmedInsights,
            locationClusters:[],
            priceRange:{serious_min:budgetMin,serious_max:budgetMax},
            summary:confirmedInsights.map(i=>i.signal).join(', ')||'Profile built from browse behavior',
          },
          profile_completeness:confirmedInsights.length>0?35:15,
        },
      }),
    });

    localStorage.setItem('albroker_user',userId);
    localStorage.removeItem('albroker_anon_saves');
    onComplete(userId);
  }

  function toggleInsight(i){
    setConfirmed(prev=>{const next=new Set(prev);next.has(i)?next.delete(i):next.add(i);return next;});
  }

  return(
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}}>
      <div style={{background:'var(--bg)',borderRadius:16,padding:'28px 24px',maxWidth:520,width:'100%',maxHeight:'90vh',overflowY:'auto',border:'1.5px solid var(--border)',boxShadow:'0 24px 48px rgba(0,0,0,0.3)',position:'relative'}}>

        <button onClick={onDismiss} style={{position:'absolute',top:16,right:16,background:'none',border:'none',cursor:'pointer',fontSize:18,color:'var(--text-muted)',lineHeight:1}}>✕</button>

        {screen==='passphrase'&&(
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--color-teal)',marginBottom:8,fontFamily:'monospace'}}>
                Good eye — {saves.length} homes saved
              </div>
              <h3 style={{fontSize:'1.4rem',fontWeight:800,color:'var(--text)',marginBottom:8}}>
                Get your access code to save your profile
              </h3>
              <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.6}}>
                No email needed. This three-word code is your private key. Write it down — then Al will tell you what your saves have in common.
              </p>
            </div>

            <div style={{background:'#1a2530',border:'2px solid var(--color-teal)',borderRadius:12,padding:'20px',boxShadow:'4px 4px 0 var(--color-teal)'}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--color-teal)',marginBottom:8,fontFamily:'monospace'}}>◈ your passphrase</div>
              <div style={{fontSize:'clamp(1.1rem,3vw,1.4rem)',fontWeight:800,color:'#fff',fontFamily:'monospace',letterSpacing:'0.06em',marginBottom:6,wordBreak:'break-all'}}>{phrase}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontStyle:'italic',marginBottom:14}}>{passphrasePersona(phrase)}</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={copy} style={{fontSize:11,fontWeight:700,padding:'6px 12px',borderRadius:6,cursor:'pointer',fontFamily:'monospace',background:copied?'var(--color-teal)':'rgba(255,255,255,0.08)',color:copied?'#1a2530':'rgba(255,255,255,0.7)',border:'1px solid rgba(255,255,255,0.15)'}}>{copied?'✓ Copied':'Copy'}</button>
                <button onClick={regenerate} style={{fontSize:11,fontWeight:700,padding:'6px 12px',borderRadius:6,cursor:'pointer',fontFamily:'monospace',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.1)'}}>↺ New phrase</button>
              </div>
            </div>

            <div style={{display:'flex',gap:8,alignItems:'flex-start',background:'color-mix(in oklab, #FF7043 8%, transparent)',border:'1px solid color-mix(in oklab, #FF7043 25%, transparent)',borderRadius:8,padding:'10px 12px',fontSize:12,color:'var(--text)'}}>
              <span style={{flexShrink:0}}>⚠</span>
              <span><strong>Write this down.</strong> We don't store it — there's no recovery if you lose it.</span>
            </div>

            <button onClick={handlePassphraseContinue} className="btn btn-lg" style={{width:'100%',justifyContent:'center'}}>
              I've saved it — show me what Al found →
            </button>
          </div>
        )}

        {screen==='pattern'&&(
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div>
              <h3 style={{fontSize:'1.4rem',fontWeight:800,color:'var(--text)',marginBottom:8}}>Here's what Al noticed</h3>
              <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.6}}>
                Based on your {saves.length} saves. Tap to confirm or remove any insight.
              </p>
            </div>

            {loadingInsights&&(
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[...Array(4)].map((_,i)=><div key={i} style={{height:60,borderRadius:10,background:'var(--border)',opacity:0.4,animation:'pulse 1.5s infinite',animationDelay:`${i*0.15}s`}}/>)}
                <p style={{fontSize:12,color:'var(--text-muted)',textAlign:'center'}}>Al is reading the pattern…</p>
              </div>
            )}

            {!loadingInsights&&insights?.length>0&&(
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {insights.map((insight,i)=>(
                  <button key={i} onClick={()=>toggleInsight(i)} style={{all:'unset',display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:10,cursor:'pointer',background:confirmed.has(i)?'color-mix(in oklab, var(--color-teal) 10%, var(--bg-card))':'var(--bg-card)',border:confirmed.has(i)?'1.5px solid var(--color-teal)':'1.5px solid var(--border)',boxShadow:confirmed.has(i)?'2px 2px 0 var(--color-teal)':'none',transition:'all 0.15s'}}>
                    <span style={{fontSize:22,flexShrink:0}}>{insight.icon}</span>
                    <div style={{flex:1,textAlign:'left'}}>
                      <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:2}}>{insight.signal}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)',lineHeight:1.4}}>{insight.description}</div>
                    </div>
                    <div style={{width:18,height:18,borderRadius:'50%',flexShrink:0,background:confirmed.has(i)?'var(--color-teal)':'var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:confirmed.has(i)?'#1a2530':'transparent',transition:'all 0.15s'}}>✓</div>
                  </button>
                ))}
              </div>
            )}

            {!loadingInsights&&insights?.length===0&&(
              <div style={{padding:16,borderRadius:8,background:'var(--border)',fontSize:13,color:'var(--text-muted)',textAlign:'center'}}>
                Not enough signal yet — your profile will build as you keep browsing.
              </div>
            )}

            {!loadingInsights&&(
              <button onClick={handleConfirm} className="btn btn-lg" style={{width:'100%',justifyContent:'center'}}>
                {confirmed.size>0?`Save ${confirmed.size} insight${confirmed.size!==1?'s':''} to my profile →`:'Skip and go to my profile →'}
              </button>
            )}
          </div>
        )}

      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}`}</style>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ListingsPage(){
  const router = useRouter();
  const [listings,setListings]=useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [error,setError]=useState(null);
  const [location,setLocation]=useState('');
  const [locationLabel,setLocationLabel]=useState('');
  const [searchInput,setSearchInput]=useState('');
  const [userId,setUserId]=useState(null);
  const [savedIds,setSavedIds]=useState([]);
  const [houseProfile,setHouseProfile]=useState(null);
  const [searchSummary,setSearchSummary]=useState(null);

  // Anonymous save tracking
  const [anonSaves,setAnonSaves]=useState([]); // full listing objects
  const [showOnboardModal,setShowOnboardModal]=useState(false);

  useEffect(()=>{
    const id=localStorage.getItem('albroker_user');
    // No dev-user-sorney fallback — real anonymous experience
    if(id){
      setUserId(id);
      loadProfiles(id);
      loadSaved(id);
    } else {
      // Load any anonymous saves from localStorage
      try{
        const stored=localStorage.getItem('albroker_anon_saves');
        if(stored){
          const parsed=JSON.parse(stored);
          setAnonSaves(parsed);
          setSavedIds(parsed.map(l=>String((l?.raw?.property??l)?.zpid)));
        }
      }catch{}
      setIsLoading(false);
    }
  },[]);

  async function loadProfiles(id){
    try{
      const res=await fetch(`/api/profile?userId=${id}`);
      if(!res.ok){setIsLoading(false);return;}
      const data=await res.json();
      const hp=data.houseProfile;
      if(hp){
        setHouseProfile(hp);
        const params=deriveSearchParams(hp);
        const summary=deriveSearchSummary(hp);
        const label=deriveLocationLabel(hp);
        setSearchSummary(summary);
        setLocationLabel(label||params.location.split(';')[0]);
        setSearchInput(params.location.split(';')[0]);
        await fetchListings(params);
      } else {
        const market=data.profile?.quiz_answers?.targetMarket;
        if(market){setSearchInput(market);await fetchListings({location:market,status:'For_Sale',page:1});}
        else setIsLoading(false);
      }
    }catch{setIsLoading(false);}
  }

  async function loadSaved(id){
    try{const res=await fetch(`/api/saved-homes?userId=${id}`);if(res.ok){const data=await res.json();setSavedIds((data.homes||[]).map(h=>String(h.zpid||h.id)));}}catch{}
  }

  async function fetchListings(params){
    setIsLoading(true);setError(null);
    try{
      const qs=new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([,v])=>v!=null)));
      const res=await fetch(`/api/listings?${qs}`);
      if(!res.ok)throw new Error('Failed to fetch listings');
      const data=await res.json();
      setListings(data.listings||[]);
      setLocation(params.location||'');
      if(!locationLabel)setLocationLabel(params.location||'');
    }catch(err){setError(err.message);setListings([]);}
    finally{setIsLoading(false);}
  }

  function handleSearch(e){
    e.preventDefault();if(!searchInput.trim())return;
    setLocationLabel(searchInput.trim());
    const params={location:searchInput.trim(),status:'For_Sale',minBeds:houseProfile?.bedrooms_min||3,page:1};
    if(houseProfile?.budget_confirmed){
      if(houseProfile.budget_min)params.minPrice=houseProfile.budget_min;
      if(houseProfile.budget_max)params.maxPrice=houseProfile.budget_max;
    }
    fetchListings(params);
  }

  async function handleSave(listing){
    const p=listing?.raw?.property??listing;
    const zpid=String(p?.zpid);
    if(!zpid||zpid==='undefined')return;

    // ── Authenticated user save ──────────────────────────────────────────────
    if(userId){
      if(savedIds.includes(zpid)){
        try{await fetch(`/api/saved-homes?userId=${userId}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({homeId:zpid})});setSavedIds(prev=>prev.filter(id=>id!==zpid));}catch{}
      }else{
        try{
          await fetch('/api/saved-homes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId,home:{id:zpid,zpid,property:{address:p.address?.streetAddress,city:p.address?.city,state:p.address?.state,price:p.price?.value,beds:p.bedrooms,baths:p.bathrooms,sqft:p.livingArea,yearBuilt:p.yearBuilt,photo:p.media?.propertyPhotoLinks?.mediumSizeLink}}})});
          setSavedIds(prev=>[...prev,zpid]);
        }catch{}
      }
      return;
    }

    // ── Anonymous save ───────────────────────────────────────────────────────
    if(savedIds.includes(zpid)){
      // Unsave
      const updated=anonSaves.filter(l=>String((l?.raw?.property??l)?.zpid)!==zpid);
      setAnonSaves(updated);
      setSavedIds(updated.map(l=>String((l?.raw?.property??l)?.zpid)));
      localStorage.setItem('albroker_anon_saves',JSON.stringify(updated));
    }else{
      // Save
      const updated=[...anonSaves,listing];
      setAnonSaves(updated);
      setSavedIds(updated.map(l=>String((l?.raw?.property??l)?.zpid)));
      localStorage.setItem('albroker_anon_saves',JSON.stringify(updated));

      // Trigger modal at threshold
      if(updated.length>=MIN_SAVES_FOR_PATTERN){
        setShowOnboardModal(true);
      }
    }
  }

  function handleModalComplete(newUserId){
    setShowOnboardModal(false);
    setUserId(newUserId);
    setAnonSaves([]);
    // Reload with new profile
    loadProfiles(newUserId);
    loadSaved(newUserId);
  }

  const validListings=listings.filter(l=>l?.raw?.property?.zpid);

  return(
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="mb-2">
          {location
            ?<>Listings in <span style={{color:'var(--color-rocket)'}}>{locationLabel||location}</span></>
            :'Browse Listings'}
        </h1>
        <p style={{color:'var(--text-muted)',fontSize:15}}>
          {isLoading?'Finding properties…':validListings.length>0?`${validListings.length} properties found`:location?'No listings found — try a different location':'Enter a city, ZIP, or neighborhood to search'}
        </p>
      </div>

      {/* Profile banner — authenticated users */}
      {userId&&<ProfileBanner summary={searchSummary} count={validListings.length} isLoading={isLoading}/>}

      {/* Anonymous save progress — anonymous users who have saved something */}
      {!userId&&anonSaves.length>0&&(
        <AnonymousSaveBar
          count={anonSaves.length}
          onTrigger={()=>setShowOnboardModal(true)}
        />
      )}

      {/* Anonymous nudge — no saves yet */}
      {!userId&&anonSaves.length===0&&!isLoading&&(
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,padding:'10px 14px',borderRadius:10,background:'color-mix(in oklab, var(--text) 4%, transparent)',border:'1px solid var(--border)',fontSize:13,color:'var(--text-muted)'}}>
          <span>Save homes you like — Al will learn your preferences as you browse</span>
          <a href="/onboard" style={{fontSize:12,fontWeight:700,color:'var(--color-rocket)',textDecoration:'none',flexShrink:0}}>Build a full profile →</a>
        </div>
      )}

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{display:'flex',gap:8}}>
        <input type="text" value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="City, ZIP, or neighborhood — e.g. Gunnison CO" style={{flex:1,padding:'10px 14px',fontSize:14,borderRadius:8,border:'1.5px solid var(--border)',background:'var(--bg-card,white)',color:'var(--text)',outline:'none'}}/>
        <button type="submit" className="btn" disabled={isLoading||!searchInput.trim()} style={{whiteSpace:'nowrap'}}>{isLoading?'…':'Search'}</button>
      </form>

      {error&&<div style={{padding:'12px 16px',borderRadius:8,background:'#FFEBEE',border:'1px solid #FFCDD2',color:'#B71C1C',fontSize:14}}>{error}</div>}

      {isLoading&&<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_,i)=><SkeletonCard key={i}/>)}</div>}

      {!isLoading&&validListings.length>0&&(
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validListings.map((listing,i)=>(
            <PropertyCard key={listing?.raw?.property?.zpid??i} listing={listing} onSave={handleSave} savedIds={savedIds} anonymousCount={anonSaves.length}/>
          ))}
        </div>
      )}

      {!isLoading&&!error&&validListings.length===0&&!location&&(
        <div className="card px-6 py-16 text-center">
          <p style={{color:'var(--text-muted)',fontSize:15,marginBottom:16}}>Search for a city, ZIP, or neighborhood to find listings</p>
          <p style={{fontSize:13,color:'var(--text-muted)'}}>Or <a href="/onboard" style={{color:'var(--color-rocket)',fontWeight:600,textDecoration:'none'}}>build a profile</a> to get personalized results automatically</p>
        </div>
      )}

      {!isLoading&&!error&&validListings.length===0&&location&&(
        <div className="card px-6 py-12 text-center">
          <p style={{color:'var(--text-muted)',fontSize:15}}>No listings found for <strong>{location}</strong>. Try a nearby city or ZIP code.</p>
        </div>
      )}

      {validListings.length>0&&(
        <p style={{fontSize:11,color:'var(--text-muted)',textAlign:'center',opacity:0.7}}>
          Monthly estimates assume 20% down, 6.168% rate, CO property tax (0.51%), $125/mo insurance. Confirm with a lender.
        </p>
      )}

      {/* Anonymous onboard modal */}
      {showOnboardModal&&(
        <AnonymousOnboardModal
          saves={anonSaves}
          onComplete={handleModalComplete}
          onDismiss={()=>setShowOnboardModal(false)}
        />
      )}

    </div>
  );
}
