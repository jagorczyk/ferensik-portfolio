import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import PageTransition from '../components/PageTransition'
import { BackArrowIcon } from '../components/icons'

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <main>
        <Nav />
        <article className="legal-page">
          <Link className="back-link" to="/">
            <BackArrowIcon />
            <span>Powrót</span>
          </Link>
          <div className="section-label">Informacje prawne</div>
          <h1 className="display-heading">Polityka prywatności.</h1>
          <p>Ostatnia aktualizacja: 16 lipca 2026 r.</p>
          <section>
            <h2>1. Administrator danych</h2>
            <p>Administratorem danych osobowych jest Ferensik. W sprawach dotyczących prywatności skontaktuj się przez formularz kontaktowy dostępny na stronie.</p>
          </section>
          <section>
            <h2>2. Dane z formularza</h2>
            <p>Formularz może obejmować imię, adres e-mail, temat, treść wiadomości oraz wybrany model. Dane są podawane dobrowolnie wyłącznie w celu odpowiedzi na zapytanie.</p>
          </section>
          <section>
            <h2>3. Zakres i cel przetwarzania</h2>
            <p>Dane są przetwarzane tylko w zakresie niezbędnym do obsługi kontaktu i przygotowania odpowiedzi. Nie są sprzedawane ani udostępniane podmiotom trzecim w celach marketingowych.</p>
          </section>
          <section>
            <h2>4. Twoje prawa</h2>
            <p>Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz wniesienia sprzeciwu. Aby skorzystać z tych praw, wyślij wiadomość przez formularz kontaktowy.</p>
          </section>
          <section>
            <h2>5. Pliki cookies</h2>
            <p>Strona nie używa własnych plików cookies do profilowania użytkowników. Dostawca hostingu może stosować techniczne dane niezbędne do bezpiecznego działania serwisu.</p>
          </section>
        </article>
        <Footer />
      </main>
    </PageTransition>
  )
}
