!function(resolving){
    let n=window,
      e=n.document,
      t=e.documentElement,
      i=resolving,
      d=i/100,
      o="orientationchange"in n?"orientationchange":"resize",
      a=function(){
        var n=t.clientWidth||320;n>resolving&&(n=resolving);
        t.style.fontSize=n/d+"px"
      };
      e.addEventListener&&(n.addEventListener(o,a,!1),e.addEventListener("DOMContentLoaded",a,!1))
  }(1920);