export default function AboutSection() {
  return (
    <section className="about" id="o-mnie">
      <div className="section-label">
        <span>O mnie</span>
      </div>
      <h2 className="display-heading">
        Ferensik,
        <br />twórca modeli 3D.
      </h2>
      <div className="about-body">
        <p className="about-lead">
          Od 2020 roku tworzę zawartość do Multi Theft Auto i GTA San Andreas: pojazdy, budynki, rekwizyty
          i skiny postaci, które trafiają na serwery roleplay, drift i freeroam.
        </p>
        <p>
          Każdy projekt przechodzi ten sam proces. Najpierw bryła — blokowanie proporcji i sylwetki, dopracowanie
          topologii tak, by model dobrze się deformował i renderował w silniku gry. Później tekstury: rozkładanie UV,
          malowanie w Substance Painterze i Photoshopie, tak aby powierzchnia żyła z bliska i z daleka. Na końcu
          optymalizacja — redukcja liczby wielokątów, poprawne LOD-y i collision — oraz eksport do formatu DFF/TXD
          zgodnego z silnikiem RenderWare, żeby model działał płynnie w grze, a nie tylko w podglądzie.
        </p>
        <div className="about-columns">
          <div>
            <h4>Narzędzia</h4>
            <p>
              Blender, 3ds Max, Substance Painter i Photoshop — wspierane własnymi skryptami do konwersji DFF/TXD
              i testów bezpośrednio w kliencie MTA.
            </p>
          </div>
          <div>
            <h4>Co oferuję</h4>
            <p>
              Gotowe modele z tego portfolio oraz zlecenia indywidualne — budynki, pojazdy, skiny postaci i całe
              zestawy mapowe dopasowane do stylu konkretnego serwera.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
