'use client';

import { useState, useEffect } from 'react';
import { deriveSearchParams, deriveSearchSummary, deriveLocationLabel } from '@/lib/deriveSearchParams';

const RATE=0.06168,DOWN=0.20,TAX_RATE=0.0051,INS=125;
function calcMonthly(price){const loan=price*(1-DOWN),mo=RATE/12,n=360,pi=loan*(mo*Math.pow(1+mo,n))/(Math.pow(1+mo,n)-1),tax=(price*TAX_RATE)/12;return Math.round(pi+tax+INS);}
function fmt(n){if(!n)return'—';return'$'+Math.round(n).toLocaleString();}

function PropertyCard({listing,onSave,savedIds}){
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

export default function ListingsPage(){
  const [listings,setListings]=useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [error,setError]=useState(null);
  const [location,setLocation]=useState('');
  const [searchInput,setSearchInput]=useState('');
  const [userId,setUserId]=useState(null);
  const [savedIds,setSavedIds]=useState([]);
  const [houseProfile,setHouseProfile]=useState(null);
  const [searchSummary,setSearchSummary]=useState(null);
  const [locationLabel,setLocationLabel]=useState('');

  useEffect(()=>{
    const id=localStorage.getItem('albroker_user')||'dev-user-sorney';
    localStorage.setItem('albroker_user',id);
    setUserId(id);
    loadProfiles(id);
    loadSaved(id);
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
    } catch{setIsLoading(false);}
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
      // For manual searches, show what was typed; for profile searches label is already set
      if(!locationLabel) setLocationLabel(params.location||'');
    }catch(err){setError(err.message);setListings([]);}
    finally{setIsLoading(false);}
  }

  function handleSearch(e){
    e.preventDefault();if(!searchInput.trim())return;
    setLocationLabel(searchInput.trim());
    const params={location:searchInput.trim(),status:'For_Sale',minBeds:houseProfile?.bedrooms_min||3,page:1};
    if(houseProfile?.budget_confirmed){if(houseProfile.budget_min)params.minPrice=houseProfile.budget_min;if(houseProfile.budget_max)params.maxPrice=houseProfile.budget_max;}
    fetchListings(params);
  }

  async function handleSave(listing){
    if(!userId)return;
    const p=listing?.raw?.property??listing;
    const zpid=String(p?.zpid);
    if(!zpid||zpid==='undefined')return;
    if(savedIds.includes(zpid)){
      try{await fetch(`/api/saved-homes?userId=${userId}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({homeId:zpid})});setSavedIds(prev=>prev.filter(id=>id!==zpid));}catch{}
    } else {
      try{await fetch('/api/saved-homes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId,home:{id:zpid,zpid,property:{address:p.address?.streetAddress,city:p.address?.city,state:p.address?.state,price:p.price?.value,beds:p.bedrooms,baths:p.bathrooms,sqft:p.livingArea,yearBuilt:p.yearBuilt,photo:p.media?.propertyPhotoLinks?.mediumSizeLink}}})});setSavedIds(prev=>[...prev,zpid]);}catch{}
    }
  }

  const validListings=listings.filter(l=>l?.raw?.property?.zpid);

  return(
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-2">{location?<>Listings in <span style={{color:'var(--color-rocket)'}}>{locationLabel||location}</span></>:'Browse Listings'}</h1>
        <p style={{color:'var(--text-muted)',fontSize:15}}>{isLoading?'Finding properties…':validListings.length>0?`${validListings.length} properties found`:location?'No listings found — try a different location':'Enter a city, ZIP, or neighborhood to search'}</p>
      </div>
      <ProfileBanner summary={searchSummary} count={validListings.length} isLoading={isLoading}/>
      <form onSubmit={handleSearch} style={{display:'flex',gap:8}}>
        <input type="text" value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="City, ZIP, or neighborhood — e.g. Gunnison CO" style={{flex:1,padding:'10px 14px',fontSize:14,borderRadius:8,border:'1.5px solid var(--border)',background:'var(--bg-card,white)',color:'var(--text)',outline:'none'}}/>
        <button type="submit" className="btn" disabled={isLoading||!searchInput.trim()} style={{whiteSpace:'nowrap'}}>{isLoading?'…':'Search'}</button>
      </form>
      {error&&<div style={{padding:'12px 16px',borderRadius:8,background:'#FFEBEE',border:'1px solid #FFCDD2',color:'#B71C1C',fontSize:14}}>{error}</div>}
      {!userId&&!isLoading&&<div className="card px-6 py-12 text-center"><p className="text-lg mb-4" style={{color:'var(--text-muted)'}}>Complete your profile to get personalized listings</p><a href="/onboard" className="btn">Get Started</a></div>}
      {isLoading&&<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_,i)=><SkeletonCard key={i}/>)}</div>}
      {!isLoading&&validListings.length>0&&<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{validListings.map((listing,i)=><PropertyCard key={listing?.raw?.property?.zpid??i} listing={listing} onSave={handleSave} savedIds={savedIds}/>)}</div>}
      {!isLoading&&!error&&validListings.length===0&&location&&<div className="card px-6 py-12 text-center"><p style={{color:'var(--text-muted)',fontSize:15}}>No listings found for <strong>{location}</strong>. Try a nearby city or ZIP code.</p></div>}
      {validListings.length>0&&<p style={{fontSize:11,color:'var(--text-muted)',textAlign:'center',opacity:0.7}}>Monthly estimates assume 20% down, 6.168% rate, CO property tax (0.51%), $125/mo insurance. Confirm with a lender.</p>}
    </div>
  );
}
