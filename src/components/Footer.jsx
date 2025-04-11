import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-6 w-full">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm">&copy; Copyright 2024. Tous droits réservés</p>
                <div className="flex gap-6 text-xl">
                    <a href="#" className="hover:text-gray-400">
                        <FaFacebook />
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        <FaTwitter />
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        <FaInstagram />
                    </a>
                    <a href="#" className="hover:text-gray-400">
                        <FaTiktok />
                    </a>
                </div>
            </div>
        </footer>
    );
}
