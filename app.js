const container = document.getElementById("partidos");

const ligaColores = {
  soccer: ["#006400", "#00aa55"],
  nba: ["#111177", "#5555ff"],
  nhl: ["#0a2540", "#38bdf8"],
  nfl: ["#880000", "#ff5555"]
};




function getColoresDia(partidosDia) {
  const ligas = [...new Set(partidosDia.map(p => p.liga))];
  if (ligas.length === 1) return ligaColores[ligas[0]];
  return ligas.flatMap(liga => ligaColores[liga]);
}

fetch("partidos.json")
  .then(res => res.json())
  .then(partidos => {
    const fechas = {};
    partidos.forEach(p => {
      if (!fechas[p.fecha]) fechas[p.fecha] = [];
      fechas[p.fecha].push(p);
    });

    Object.keys(fechas).forEach(fecha => {
      const partidosDia = fechas[fecha];

      // Cabecera de agenda
      const header = document.createElement("div");
      header.className = "agenda-header";
      const fechaObj = new Date(fecha + "T00:00:00");
      const opciones = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
      const fechaBonita = fechaObj.toLocaleDateString("es-MX", opciones);
      header.textContent = `Agenda - ${fechaBonita.charAt(0).toUpperCase() + fechaBonita.slice(1)}`;
      header.style.background = `linear-gradient(90deg, ${getColoresDia(partidosDia).join(", ")})`;
      container.appendChild(header);

      let abiertoActualmente = null;

      partidosDia.forEach(p => {
        const div = document.createElement("div");
        div.className = "partido";
        div.style.background = `linear-gradient(90deg, ${ligaColores[p.liga][0]}, ${ligaColores[p.liga][1]})`;
        div.style.cursor = "pointer";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.marginBottom = "8px";
        div.style.borderRadius = "6px";
        div.style.overflow = "hidden";

        const fila = document.createElement("div");
        fila.style.display = "flex";
        fila.style.justifyContent = "flex-start";
        fila.style.gap = "15px";
        fila.style.alignItems = "center";
        fila.style.padding = "6px 12px";
        fila.style.width = "100%";

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.alignItems = "center";
        left.style.gap = "8px";

        const logoImg = document.createElement("img");
        logoImg.src = p.logo;
        logoImg.alt = "Logo";
        logoImg.style.width = "32px";
        logoImg.style.height = "32px";
        logoImg.style.objectFit = "cover";   // 🔥 clave
        logoImg.style.borderRadius = "50%";  // asegura que sea redondo

        const nombreSpan = document.createElement("span");
        nombreSpan.textContent = p.nombre;
        nombreSpan.style.color = "#fff";
        nombreSpan.style.fontSize = "17px";   // 🔥 aquí cambias el tamaño
        nombreSpan.style.fontWeight = "500";

        left.appendChild(logoImg);
        left.appendChild(nombreSpan);

        const right = document.createElement("div");
        right.style.display = "flex";
        right.style.alignItems = "center";
        right.style.gap = "8px";

        const horaSpan = document.createElement("span");
        horaSpan.textContent = p.hora;
        horaSpan.style.color = "#fff";
        horaSpan.style.width = "60px";     // ancho fijo real
        horaSpan.style.textAlign = "right";
        horaSpan.style.flexShrink = "0";
        horaSpan.style.fontSize = "19px";
        horaSpan.style.fontWeight = "bold";

        right.appendChild(horaSpan);

        fila.appendChild(right);
        fila.appendChild(left);

        const opcionesDiv = document.createElement("div");
        opcionesDiv.className = "opciones-embeds";
        opcionesDiv.style.display = "none";
        opcionesDiv.style.flexDirection = "column";
        opcionesDiv.style.padding = "0 12px 8px 12px";
        opcionesDiv.style.width = "100%";

        // Crear botones dinámicos según tipo
        p.embeds.forEach((embed, i) => {
          const btn = document.createElement("button");
          let nombreBtn, urlBtn;

          if (typeof embed === "string") {
            nombreBtn = `Evento ${i + 1}`;
            urlBtn = embed;
          } else {
            nombreBtn = embed.nombre || `Evento ${i + 1}`;
            urlBtn = embed.url;
          }

          btn.textContent = nombreBtn;
          btn.style.width = "100%";
          btn.style.padding = "8px";
          btn.style.borderRadius = "6px";
          btn.style.border = "none";
          btn.style.cursor = "pointer";
          btn.style.backgroundColor = "#4444ff";
          btn.style.color = "#fff";
          btn.onmouseover = () => btn.style.backgroundColor = "#2222cc";
          btn.onmouseout = () => btn.style.backgroundColor = "#4444ff";

          // Abrir en eventos.html con URL en Base64
          btn.onclick = e => {
            e.stopPropagation();
            const encoded = btoa(urlBtn); // codificar URL a Base64
            window.open(`eventos.html?r=${encoded}`, "_blank");
          };

          opcionesDiv.appendChild(btn);
        });

        fila.onclick = () => {
          if (abiertoActualmente && abiertoActualmente !== opcionesDiv) {
            abiertoActualmente.style.display = "none";
          }
          opcionesDiv.style.display = opcionesDiv.style.display === "flex" ? "none" : "flex";
          abiertoActualmente = opcionesDiv.style.display === "flex" ? opcionesDiv : null;
        };

        div.appendChild(fila);
        div.appendChild(opcionesDiv);
        container.appendChild(div);
      });
    });
  })
  .catch(err => console.error("Error cargando JSON:", err));
