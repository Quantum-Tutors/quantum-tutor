(self.webpackChunklite=self.webpackChunklite||[]).push([[6618],{37426:(t,r,e)=>{"use strict";function n(t,r){if(null==t)throw new TypeError("assign requires that input parameter not be null or undefined");for(var e in r=r||{})r.hasOwnProperty(e)&&(t[e]=r[e]);return t}e.d(r,{A:()=>n})},19312:(t,r,e)=>{"use strict";e.d(r,{A:()=>o});var n=e(10123),a=e(70551);function o(t){(0,a.A)(1,arguments);var r=(0,n.A)(t),e=r.getMonth();return r.setFullYear(r.getFullYear(),e+1,0),r.setHours(23,59,59,999),r}},34284:(t,r,e)=>{"use strict";e.d(r,{A:()=>D});var n=e(10123),a=e(70551);function o(t,r){(0,a.A)(2,arguments);var e=(0,n.A)(t),o=(0,n.A)(r),i=e.getTime()-o.getTime();return i<0?-1:i>0?1:i}var i=e(19312);function s(t,r){(0,a.A)(2,arguments);var e,s=(0,n.A)(t),u=(0,n.A)(r),f=o(s,u),c=Math.abs(function(t,r){(0,a.A)(2,arguments);var e=(0,n.A)(t),o=(0,n.A)(r);return 12*(e.getFullYear()-o.getFullYear())+(e.getMonth()-o.getMonth())}(s,u));if(c<1)e=0;else{1===s.getMonth()&&s.getDate()>27&&s.setDate(30),s.setMonth(s.getMonth()-f*c);var l=o(s,u)===-f;(function(t){(0,a.A)(1,arguments);var r=(0,n.A)(t);return function(t){(0,a.A)(1,arguments);var r=(0,n.A)(t);return r.setHours(23,59,59,999),r}(r).getTime()===(0,i.A)(r).getTime()})((0,n.A)(t))&&1===c&&1===o(t,u)&&(l=!1),e=f*(c-l)}return 0===e?0:e}var u=e(81384),f=e(56438),c=e(37426),l=e(67044),h=1440,A=2520,m=43200,v=86400;function D(t,r,e){(0,a.A)(2,arguments);var i=e||{},D=i.locale||f.A;if(!D.formatDistance)throw new RangeError("locale must contain formatDistance property");var M=o(t,r);if(isNaN(M))throw new RangeError("Invalid time value");var d,p,g,w=(d=i,(0,c.A)({},d));w.addSuffix=Boolean(i.addSuffix),w.comparison=M,M>0?(p=(0,n.A)(r),g=(0,n.A)(t)):(p=(0,n.A)(t),g=(0,n.A)(r));var x,T=function(t,r){(0,a.A)(2,arguments);var e=(0,u.A)(t,r)/1e3;return e>0?Math.floor(e):Math.ceil(e)}(g,p),X=((0,l.A)(g)-(0,l.A)(p))/1e3,b=Math.round((T-X)/60);if(b<2)return i.includeSeconds?T<5?D.formatDistance("lessThanXSeconds",5,w):T<10?D.formatDistance("lessThanXSeconds",10,w):T<20?D.formatDistance("lessThanXSeconds",20,w):T<40?D.formatDistance("halfAMinute",null,w):T<60?D.formatDistance("lessThanXMinutes",1,w):D.formatDistance("xMinutes",1,w):0===b?D.formatDistance("lessThanXMinutes",1,w):D.formatDistance("xMinutes",b,w);if(b<45)return D.formatDistance("xMinutes",b,w);if(b<90)return D.formatDistance("aboutXHours",1,w);if(b<h){var y=Math.round(b/60);return D.formatDistance("aboutXHours",y,w)}if(b<A)return D.formatDistance("xDays",1,w);if(b<m){var Y=Math.round(b/h);return D.formatDistance("xDays",Y,w)}if(b<v)return x=Math.round(b/m),D.formatDistance("aboutXMonths",x,w);if((x=s(g,p))<12){var S=Math.round(b/m);return D.formatDistance("xMonths",S,w)}var E=x%12,k=Math.floor(x/12);return E<3?D.formatDistance("aboutXYears",k,w):E<9?D.formatDistance("overXYears",k,w):D.formatDistance("almostXYears",k+1,w)}},12177:(t,r,e)=>{var n=e(61489);t.exports=function(t,r){var e;if("function"!=typeof r)throw new TypeError("Expected a function");return t=n(t),function(){return--t>0&&(e=r.apply(this,arguments)),t<=1&&(r=void 0),e}}},58059:(t,r,e)=>{var n=e(12177);t.exports=function(t){return n(2,t)}}}]);
//# sourceMappingURL=https://stats.medium.build/lite/sourcemaps/6618.db187378.chunk.js.map