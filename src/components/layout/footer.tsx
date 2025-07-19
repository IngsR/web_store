import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground mt-24">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div className="md:col-span-2">
                        <h3 className="font-headline text-xl font-bold text-foreground">
                            Ing Store
                        </h3>
                        <p className="mt-2 text-sm max-w-sm mx-auto md:mx-0">
                            Destinasi terpercaya Anda untuk mobil berkualitas.
                            Kami menawarkan pilihan terbaik mobil baru dan
                            bekas.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">Shop</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-primary transition-colors"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Best Sellers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">
                            Support
                        </h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-primary transition-colors"
                                >
                                    Shipping & Returns
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} Ing Store. All rights
                        reserved.
                    </p>
                    <div className="flex items-center mt-4 md:mt-0 space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                            <a href="#" aria-label="Twitter">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <a href="#" aria-label="Instagram">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <a
                                href="https://github.com/IngsR"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
