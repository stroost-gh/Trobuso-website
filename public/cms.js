/**
 * Trobuso CMS – laadt website-content uit de API en vult de pagina dynamisch.
 */
(function () {
  var script = document.currentScript;
  var API_URL = (script && script.getAttribute("data-api")) || "/api/website-content";

  function laden() {
    fetch(API_URL)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) vulPagina(d); })
      .catch(function () { /* statische tekst blijft staan */ });
  }

  function vulPagina(d) {
    if (d.hero) {
      setText(".hero .eyebrow", d.hero.eyebrow);
      setHtml(".hero .display",
        esc(d.hero.titel_voor_accent) + ' <span class="accent">' + esc(d.hero.titel_accent) + "</span><br/>" +
        esc(d.hero.titel_na_accent) + ' <span class="italic">' + esc(d.hero.titel_italic) + "</span>");
      setText(".hero .lede", d.hero.beschrijving);
      setText(".hero .cta-btn.primary", d.hero.cta_primair);
      setText(".hero .cta-btn.ghost", d.hero.cta_secundair);
      if (d.hero.marquee) {
        var track = document.querySelector(".marquee-track");
        if (track) {
          var h = "";
          for (var r = 0; r < 2; r++) d.hero.marquee.forEach(function (w) { h += "<span>" + esc(w) + "</span><span>·</span>"; });
          track.innerHTML = h;
        }
      }
    }

    if (d.klanten) setText(".clients .eyebrow", d.klanten.eyebrow);

    if (d.intro) {
      setHtml(".intro .section-title",
        esc(d.intro.titel_voor_accent) + ' <span class="accent">' + esc(d.intro.titel_accent) + "</span><br/>" +
        esc(d.intro.titel_na_accent) + ' <span class="italic">' + esc(d.intro.titel_italic) + "</span>");
      var ips = document.querySelectorAll(".intro .section-body p");
      if (ips[0]) ips[0].textContent = d.intro.alinea_1;
      if (ips[1]) ips[1].textContent = d.intro.alinea_2;
    }

    if (d.diensten) {
      setText("#diensten .eyebrow", d.diensten.eyebrow);
      setSectTitel("#diensten .section-title", d.diensten.titel, d.diensten.titel_italic);
      var svcs = document.querySelectorAll(".service");
      (d.diensten.items || []).forEach(function (item, i) {
        var el = svcs[i]; if (!el) return;
        var num = el.querySelector(".service-num"); if (num) num.textContent = item.nummer;
        var h3 = el.querySelector(".service-title h3"); if (h3) h3.innerHTML = esc(item.titel).replace(/\n/g, "<br/>");
        var p = el.querySelector(".service-body p"); if (p) p.textContent = item.beschrijving;
        if (item.bullets) { var ul = el.querySelector(".service-body ul"); if (ul) ul.innerHTML = item.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join(""); }
      });
    }

    if (d.aanpak) {
      setText("#aanpak .eyebrow", d.aanpak.eyebrow);
      setSectTitel("#aanpak .section-title", d.aanpak.titel, d.aanpak.titel_italic);
      var steps = document.querySelectorAll(".steps li");
      (d.aanpak.stappen || []).forEach(function (s, i) {
        var el = steps[i]; if (!el) return;
        var sn = el.querySelector(".step-n"); if (sn) sn.textContent = s.nummer;
        var h3 = el.querySelector("h3"); if (h3) h3.textContent = s.titel;
        var p = el.querySelector("p"); if (p) p.textContent = s.beschrijving;
      });
    }

    if (d.over) {
      setText("#over .eyebrow", d.over.eyebrow);
      setHtml("#over .section-title", esc(d.over.titel) + "<br/>" + '<span class="italic">' + esc(d.over.titel_italic) + "</span>");
      var ops = document.querySelectorAll("#over .section-body p");
      if (ops[0]) ops[0].textContent = d.over.alinea_1;
      if (ops[1]) ops[1].textContent = d.over.alinea_2;
      if (d.over.stats) {
        var statDivs = document.querySelectorAll(".stats > div");
        d.over.stats.forEach(function (st, i) {
          var el = statDivs[i]; if (!el) return;
          var strong = el.querySelector("strong"); if (strong) strong.textContent = st.waarde;
          var span = el.querySelector("span"); if (span) span.textContent = st.label;
        });
      }
    }

    if (d.cases) {
      setText("#cases .eyebrow", d.cases.eyebrow);
      setSectTitel("#cases .section-title", d.cases.titel, d.cases.titel_italic);
      var cg = document.querySelector(".case-grid");
      if (cg) cg.innerHTML = (d.cases.items || []).map(function (c) {
        return '<a class="case" href="#contact"><span class="case-tag">' + esc(c.tag) + "</span><h3>" + esc(c.titel) + "</h3><p>" + esc(c.beschrijving) + "</p></a>";
      }).join("");
    }

    if (d.specialisaties) {
      setText("#specialisaties .eyebrow", d.specialisaties.eyebrow);
      setSectTitel("#specialisaties .section-title", d.specialisaties.titel, d.specialisaties.titel_italic);
      var specs = document.querySelectorAll(".spec");
      (d.specialisaties.items || []).forEach(function (item, i) {
        var el = specs[i]; if (!el) return;
        var h3 = el.querySelector("h3"); if (h3) h3.textContent = item.titel;
        var p = el.querySelector("p"); if (p) p.textContent = item.beschrijving;
        if (item.bullets) { var ul = el.querySelector("ul"); if (ul) ul.innerHTML = item.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join(""); }
      });
    }

    if (d.contact) {
      setText("#contact .eyebrow", d.contact.eyebrow);
      setHtml("#contact .display", esc(d.contact.titel) + "<br/>" + '<span class="italic">' + esc(d.contact.titel_italic) + "</span>");
      setText("#contact .lede", d.contact.beschrijving);
      var cds = document.querySelectorAll("#contact .contact-grid > div");
      if (cds[0]) { var a0 = cds[0].querySelector("a"); if (a0) { a0.textContent = d.contact.email; a0.href = "mailto:" + d.contact.email; } }
      if (cds[1]) { var a1 = cds[1].querySelector("a"); if (a1) { a1.textContent = d.contact.telefoon; a1.href = "tel:" + d.contact.telefoon_link; } }
      if (cds[2]) { var bl = cds[2].querySelector(".big-link"); if (bl) bl.innerHTML = esc(d.contact.adres_regel_1) + "<br/>" + esc(d.contact.adres_regel_2); }
      var ccta = document.querySelector("#contact .cta-btn.primary.xl");
      if (ccta) { ccta.textContent = d.contact.cta; ccta.href = "mailto:" + d.contact.email; }
    }

    if (d.footer) {
      var fbp = document.querySelector(".foot-brand p"); if (fbp) fbp.textContent = d.footer.beschrijving;
      var fcs = document.querySelectorAll(".foot-cols > div");
      if (fcs[1]) { var fts = fcs[1].querySelectorAll(".foot-text"); if (fts[0]) fts[0].textContent = d.footer.adres_regel_1; if (fts[1]) fts[1].textContent = d.footer.adres_regel_2; if (fts[2]) fts[2].textContent = d.footer.kvk; if (fts[3]) fts[3].textContent = d.footer.iban; }
      if (fcs[2]) { var fls = fcs[2].querySelectorAll("a"); if (fls[0]) { fls[0].textContent = d.footer.email; fls[0].href = "mailto:" + d.footer.email; } if (fls[1]) fls[1].textContent = d.footer.telefoon; }
    }
  }

  function setText(sel, t) { var el = document.querySelector(sel); if (el && t != null) el.textContent = t; }
  function setHtml(sel, h) { var el = document.querySelector(sel); if (el && h != null) el.innerHTML = h; }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function setSectTitel(sel, t, it) { setHtml(sel, esc(t) + ' <span class="italic">' + esc(it) + "</span>"); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", laden);
  else laden();
})();
