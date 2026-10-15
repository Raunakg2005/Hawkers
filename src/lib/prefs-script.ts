/**
 * Render-blocking inline snippet: applies saved preferences (or the OS colour
 * scheme) before first paint, so there is never a light/dark or language flash.
 * With no saved language, the browser's language is used if we support it.
 */
export const PREFS_SCRIPT = `(function(){try{var d=document.documentElement,s=localStorage;
var t=s.getItem('naka-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
d.dataset.theme=t;
var L=['en','hi','mr','gu'],l=s.getItem('naka-lang');
if(L.indexOf(l)<0){l='en';var nl=(navigator.languages||[navigator.language||'']);for(var i=0;i<nl.length;i++){var c2=String(nl[i]).slice(0,2).toLowerCase();if(L.indexOf(c2)>-1){l=c2;break}}}
if(l!=='en'){d.dataset.lang=l;d.lang=l}
var z=s.getItem('naka-size');if(z==='lg'||z==='xl')d.dataset.size=z;
var lt=s.getItem('naka-lite');var c=navigator.connection;
if(lt==='1'||(lt===null&&c&&(c.saveData||/2g/.test(c.effectiveType||''))))d.dataset.lite='1';
var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#0b0c15':'#fdfbf7');
}catch(e){document.documentElement.dataset.theme='light'}})();`;
