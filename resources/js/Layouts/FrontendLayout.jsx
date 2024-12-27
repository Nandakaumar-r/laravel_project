export default function FrontendLayout({ children }) {
    return (
        <div>
            <header>Frontend Header</header>
            <main>{children}</main>
            <footer>Frontend Footer</footer>
        </div>
    );
}
