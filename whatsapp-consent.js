(function(){
  // URL do backend Vercel - SUBSTITUA pela sua URL apos o deploy
  var BACKEND_URL="https://dalcotone-backend.vercel.app/api/consent";

  function getEmail(){
    var body=document.body.innerText||"";
    var match=body.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    return match?match[0]:"";
  }

  function run(){
    var d=document;
    var a=d.querySelector(".holder-buttons")||d.querySelector(".inner-body");
    if(!a||d.getElementById("dc-wac"))return;
    var w=d.createElement("div");
    w.id="dc-wac";
    w.style.cssText="max-width:500px;margin:24px auto 0;background:#fff;border:1px solid #f0d0da;border-radius:12px;padding:22px 26px;font-family:Arial,sans-serif;text-align:left";
    var t=d.createElement("p");
    t.style.cssText="font-size:14px;font-weight:700;color:#dd9aae;margin:0 0 10px";
    t.textContent="Receba atualizacoes do pedido via WhatsApp";
    var de=d.createElement("p");
    de.style.cssText="font-size:12px;color:#888;margin:0 0 14px;line-height:1.6";
    de.textContent="Fique por dentro do rastreamento e receba ofertas exclusivas da Dal Cotone. Cancele respondendo SAIR.";

    // Campo de telefone
    var inp=d.createElement("input");
    inp.type="tel";
    inp.id="dc-phone";
    inp.placeholder="Seu WhatsApp com DDD (ex: 11999998888)";
    inp.style.cssText="width:100%;box-sizing:border-box;padding:10px 12px;font-size:13px;border:1px solid #e0c0ca;border-radius:8px;margin-bottom:14px;font-family:Arial,sans-serif;outline:none";

    var lb=d.createElement("label");
    lb.style.cssText="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:16px";
    var cb=d.createElement("input");
    cb.type="checkbox";
    cb.id="dc-cb";
    var sp=d.createElement("span");
    sp.style.cssText="font-size:12px;color:#444;line-height:1.5";
    sp.textContent="Quero receber rastreamento do pedido e ofertas exclusivas da Dal Cotone via WhatsApp.";
    lb.appendChild(cb);
    lb.appendChild(sp);
    var bt=d.createElement("button");
    bt.type="button";
    bt.id="dc-btn";
    bt.style.cssText="background:#dd9aae;color:#fff;border:none;border-radius:8px;padding:11px;font-size:13px;font-weight:600;cursor:pointer;width:100%;display:block";
    bt.textContent="Confirmar";
    var mg=d.createElement("p");
    mg.id="dc-msg";
    mg.style.cssText="display:none;font-size:12px;text-align:center;margin-top:10px";
    w.appendChild(t);
    w.appendChild(de);
    w.appendChild(inp);
    w.appendChild(lb);
    w.appendChild(bt);
    w.appendChild(mg);
    a.parentNode.insertBefore(w,a.nextSibling);
    cb.setAttribute("style","width:16px!important;height:16px!important;min-width:16px!important;max-width:16px!important;min-height:16px!important;max-height:16px!important;padding:0!important;margin:0!important;border-radius:3px!important;cursor:pointer!important;flex-shrink:0!important;-webkit-appearance:checkbox!important;appearance:checkbox!important");

    bt.addEventListener("click",function(e){
      e.preventDefault();
      var chk=d.getElementById("dc-cb");
      var ph=d.getElementById("dc-phone").value.replace(/\D/g,"");
      var m=d.getElementById("dc-msg");
      var b=d.getElementById("dc-btn");
      if(!chk.checked){m.style.display="block";m.style.color="#c0392b";m.textContent="Marque a caixa para confirmar.";return;}
      if(ph.length<10){m.style.display="block";m.style.color="#c0392b";m.textContent="Digite um WhatsApp valido com DDD.";return;}
      b.disabled=true;b.textContent="Enviando...";

      var em=getEmail();
      var urlId=window.location.pathname.split("/").pop()||"";

      fetch(BACKEND_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:em,phone:ph,order_id:urlId})
      })
      .then(function(r){return r.json().then(function(j){return{ok:r.ok,body:j};});})
      .then(function(res){
        m.style.display="block";
        if(res.ok&&res.body.success){
          m.style.color="#27ae60";
          m.textContent="Confirmado! Voce recebera atualizacoes via WhatsApp em breve.";
          b.style.background="#27ae60";
          b.textContent="Confirmado";
        } else {
          m.style.color="#c0392b";
          m.textContent="Erro ao confirmar. Tente novamente.";
          b.disabled=false;b.textContent="Confirmar";
        }
      })
      .catch(function(){
        m.style.display="block";m.style.color="#c0392b";
        m.textContent="Erro. Tente novamente.";
        b.disabled=false;b.textContent="Confirmar";
      });
    });
  }

  if(document.readyState==="complete"||document.readyState==="interactive"){setTimeout(run,800);}
  else{window.addEventListener("load",function(){setTimeout(run,800);});}
})();
