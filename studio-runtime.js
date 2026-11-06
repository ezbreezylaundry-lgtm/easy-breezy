(()=>{'use strict';const data=window.EB_STUDIO_DATA;let last='';
const path=()=>{let p=location.pathname;if(data.preview)p=p.replace(/^\/preview(?=\/|$)/,'');return p==='/'||!p?'/':'/'+p.replace(/^\/+|\/+$/g,'')+'/'};
const time=(t,short=false)=>{let[h,m]=t.split(':').map(Number);return(h%12||12)+(m||!short?':'+String(m).padStart(2,'0'):'')+(short?(h<12?'am':'pm'):(h<12?' AM':' PM'))};
const shared=value=>{const s=data.settings,r=data.pricing_rules;const money=v=>Number(v).toFixed(2);const pairs={
 '$45':'$'+money(r.delivery_min),'$75':'$'+money(r.far_recurring_min),'$100':'$'+money(r.far_once_min),'$2.50':'$'+money(r.fuel),
 '(619) 936-4218':data.site.commercial_display,'tel:6199364218':'tel:'+data.site.commercial_number,'(619) 400-3672':s.phone_display,'(619)400-3672':s.phone_display,'tel:6194003672':'tel:'+s.phone_number,'sales@easybreezylaundromat.com':s.email,'+16194003672':'+1'+s.phone_number,
 'Made Easy':s.hero_title,'7:00 AM – 9:00 PM':time(s.opens)+' – '+time(s.closes),'9:00 AM – 9:00 PM':time(s.attendant_opens)+' – '+time(s.attendant_closes),'7am–9pm':time(s.opens,true)+'–'+time(s.closes,true),'9am–9pm':time(s.attendant_opens,true)+'–'+time(s.attendant_closes,true),'7:30 PM':time(s.last_wash),
 '/assets/gallery-2-Dh_VCqhe.jpg':s.gallery_image,'/assets/pickup-van-BVOa8xaP.jpg':s.delivery_image};
 // Home introduction is uniquely identified by its original full paragraph.
 if(value.startsWith('Easy Breezy is your one-stop shop for all laundry needs.'))return s.hero_description;
 const keys=Object.keys(pairs).sort((a,b)=>b.length-a.length);return value.replace(new RegExp(keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+(/\d$/.test(k)?'(?![\\d.])':'')).join('|'),'g'),m=>pairs[m]);};
window.EB_STUDIO={commercialPhone(){return data.site.commercial_display},commercialHref(){return "tel:"+data.site.commercial_number},value(id,fallback){const f=data.fields[id];if(!f)return fallback;const page=data.pages[path()];if(f.kind==='number')return Number(page?.overrides[id]??data.global[id]??fallback);if(f.rate)return '$'+data.settings[f.rate]+(f.original.endsWith('/lb')?'/lb':'');if(f.rule)return '$'+data.pricing_rules[f.rule]+(f.original.endsWith('/lb')?'/lb':'');return page?.overrides[id]??data.global[id]??shared(fallback)}};
function tag(kind,key,value){let el=document.head.querySelector(kind+'['+(kind==='link'?'rel':key.startsWith('og:')?'property':'name')+'="'+key+'"]');if(!el){el=document.createElement(kind);el.setAttribute(kind==='link'?'rel':key.startsWith('og:')?'property':'name',key);document.head.append(el)}el.setAttribute(kind==='link'?'href':'content',value)}
function refresh(){const p=path(),page=data.pages[p];if(!page)return;const signature=p+'|'+JSON.stringify(page.sections);if(signature===last&&document.getElementById('eb-extra-sections'))return;last=signature;
 const seo=page.seo;document.title=seo.title;tag('meta','description',seo.description);tag('meta','robots',data.preview||seo.noindex?'noindex, nofollow':'index, follow');tag('link','canonical',seo.canonical);tag('meta','og:title',seo.og_title||seo.title);tag('meta','og:description',seo.og_description||seo.description);tag('meta','og:url',seo.canonical);tag('meta','og:image',data.site.domain+seo.og_image);
 const main=document.querySelector('main');if(!main)return;let container=document.getElementById('eb-extra-sections');if(!container){container=document.createElement('div');container.id='eb-extra-sections';main.append(container)}container.replaceChildren();for(const b of page.sections){const section=document.createElement('section');section.className='eb-extra-section';const inner=document.createElement('div');inner.className='container';if(b.image){const img=document.createElement('img');img.src=b.image;img.alt=b.title;inner.append(img)}const h=document.createElement('h2');h.textContent=b.title;const body=document.createElement('p');body.textContent=b.body;body.style.whiteSpace='pre-line';inner.append(h,body);if(b.button&&b.url){const a=document.createElement('a');a.className='btn btn-primary';a.textContent=b.button;a.href=b.url;inner.append(a)}section.append(inner);container.append(section)}}
// Each page loads its own saved data before React renders. Full navigation also
// avoids cached module-level text arrays retaining the previous page's values.
if(typeof document!=='undefined')document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const a=event.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
 const target=new URL(a.href,location.href);if(target.origin!==location.origin||!/^https?:$/.test(target.protocol)||target.pathname===location.pathname)return;
 let next=target.pathname;if(data.preview)next=next.replace(/^\/preview(?=\/|$)/,'');next=next==='/'?'/':'/'+next.replace(/^\/+|\/+$/g,'')+'/';
 if(!data.pages[next])return;if(data.preview&&!target.pathname.startsWith('/preview/'))target.pathname='/preview'+(target.pathname==='/'?'/':target.pathname);event.preventDefault();event.stopImmediatePropagation();location.assign(target.href);
},true);
setInterval(refresh,250);addEventListener('DOMContentLoaded',refresh);
})();
